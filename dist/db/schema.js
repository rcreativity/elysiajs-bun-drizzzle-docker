import { pgTable, serial, varchar, integer } from "drizzle-orm/pg-core";
export const users = pgTable("users", {
    id: serial("id").primaryKey(),
    name: varchar("name", { length: 256 }),
    age: integer("age"),
    city: varchar("city", { length: 256 })
});
