import { Elysia } from "elysia";
import { db, schema } from "./db";

// cache increased to 26k to 85k req/sec on my machine
let cachedUsers: any[] = [];
let cacheTime = 0; // timestamp of last cache refresh
// const CACHE_DURATION = 10_000; // 10 seconds (adjust as needed)
const CACHE_DURATION = 60_000; // 10 seconds (adjust as needed)

const app = new Elysia()

  // GET /users with caching
  .get("/users", async () => {
    const now = Date.now();

    // If cache is empty or expired
    if (cachedUsers.length === 0 || now - cacheTime > CACHE_DURATION) {
      cachedUsers = await db.select().from(schema.users).limit(10_000);
      cacheTime = now;
      console.log("🔄 Cache refreshed from DB");
    } else {
      console.log("⚡ Returning cached users");
    }

    return cachedUsers;
  })

  // POST /users
  .post("/users", async ({ body }) => {
    const { name, age } = body as any;

    if (age == null) {
      return { error: "Age is required for new users" };
    }

    const [newUser] = await db
      .insert(schema.users)
      .values({ name, age })
      .returning();

    // Update cache immediately
    cachedUsers.push(newUser);

    return newUser;
  })

  .listen(3000, () => console.log("🚀 Server running on port 3000"));
