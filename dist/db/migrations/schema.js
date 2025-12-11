import { pgTable, serial, varchar, integer } from "drizzle-orm/pg-core";
export const users = pgTable("users", {
    id: serial().primaryKey().notNull(),
    name: varchar({ length: 256 }),
    age: integer(),
});
