import { dbPool } from "../config/db";
import { WebzPost } from "../types/webzTypes";
import { logger } from "../utils/logger";

export async function savePostsToDb(posts: WebzPost[]): Promise<void> {
  if (!posts.length) {
    logger.info("No posts to save");
    return;
  }

  const client = await dbPool.connect();
  try {
    await client.query("BEGIN");

    const values = posts.map((post) => `('${post.thread.title.replace(/'/g, "''")}', '${post.thread.url}', '${post.thread.published}')`).join(",");
    const queryText = `
      INSERT INTO posts (title, url, published)
      VALUES ${values}
      ON CONFLICT (url) DO NOTHING`;

    await client.query(queryText);
    await client.query("COMMIT");
    logger.info(`Successfully saved ${posts.length} posts to database`);
  } catch (error) {
    await client.query("ROLLBACK");
    logger.error("Error saving posts to database:", error);
    throw new Error("Database save failed");
  } finally {
    client.release();
  }
}
