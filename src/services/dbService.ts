import { dbPool } from "../config/db";
import { WebzPost } from "../types/webzTypes";
import { logger } from "../utils/logger";

export async function savePostToDb(posts: WebzPost[]): Promise<void> {
  const client = await dbPool.connect();
  try {
    await client.query("BEGIN");
    for (const post of posts) {
      await client.query("INSERT INTO posts(title, url, published) VALUES ($1, $2, $3)", [post.title, post.url, post.published]);
    }
  } catch (error) {
    await client.query("ROLLBACK");
    logger.error("Error saving posts to database", error);
    throw error;
  } finally {
    client.release();
  }
}
