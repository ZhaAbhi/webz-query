import { Pool } from "pg";
import * as dotenv from "dotenv";

dotenv.config();

export const dbPool = new Pool({
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || "5432", 10),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

export async function initDb(): Promise<void> {
  const client = await dbPool.connect();
  try {
    await client.query(`
            CREATE TABLE IF NOT EXISTS posts(
            id SERIAL PRIMARY KEY,
            title TEXT NOT NULL,
            url TEXT NOT NULL,
            published TIMESTAMP NOT NULL
            )
            `);
  } catch (error) {
    console.error("Error initializing database", error);
    throw error;
  } finally {
    client.release();
  }
}
