import { Pool } from "pg";
import * as dotenv from "dotenv";
import { logger } from "../utils/logger";

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
      CREATE TABLE IF NOT EXISTS posts (
        id SERIAL PRIMARY KEY,
        title TEXT NOT NULL,
        url TEXT NOT NULL UNIQUE,
        published TIMESTAMP NOT NULL
      )
    `);
    logger.info("Posts table initialized with UNIQUE constraint on url");
  } catch (err) {
    logger.error("Error initializing database:", err);
    throw err;
  } finally {
    client.release();
  }
}
