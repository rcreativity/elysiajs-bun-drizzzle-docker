import { Elysia } from "elysia";
import { openapi, fromTypes } from "@elysiajs/openapi";
import { swagger } from "@elysiajs/swagger";
import { opentelemetry } from '@elysiajs/opentelemetry';
import { db, schema } from "./db";
let cachedUsers = [];
let cacheTime = 0;
const CACHE_DURATION = 60_000; // 1 minute
const app = new Elysia()
    .use(openapi({
    references: fromTypes(),
    documentation: {
        info: {
            title: "My API",
            version: "1.0.0",
        },
    },
    path: "/openapi.json", // JSON only
}))
    .use(swagger({
    path: "/docs", // <-- Swagger UI
}))
    .use(opentelemetry())
    .get("/users", async () => {
    const now = Date.now();
    if (cachedUsers.length === 0 || now - cacheTime > CACHE_DURATION) {
        cachedUsers = await db.select().from(schema.users).limit(100); //10_000
        cacheTime = now;
        console.log("🔄 Cache refreshed from DB");
    }
    else {
        console.log("⚡ Returning cached users");
    }
    return cachedUsers;
})
    .post("/users", async ({ body }) => {
    // body: t.Object({
    //         name: t.String(),
    //         age: t.Number(),
    //     }) as any
    const { name, age } = body;
    if (age == null)
        return { error: "Age is required" };
    const [newUser] = await db
        .insert(schema.users)
        .values({ name, age })
        .returning();
    cachedUsers.push(newUser);
    return newUser;
})
    .listen(3000);
console.log("🚀 Server → http://localhost:3000");
console.log("📘 Swagger Docs → http://localhost:3000/docs");
console.log("📄 OpenAPI JSON → http://localhost:3000/openapi.json");
