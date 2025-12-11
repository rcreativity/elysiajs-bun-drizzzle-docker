import { Pool } from "pg";
import { drizzle } from "drizzle-orm/node-postgres";
import * as schema from "./schema";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 20, // allow multiple concurrent connections
  idleTimeoutMillis: 30000, // close idle after 30 sec
  connectionTimeoutMillis: 2000 // wait max 2 sec to get a conn
});

export const db = drizzle(pool, { schema });
export { schema };
