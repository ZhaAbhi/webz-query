import * as dotenv from "dotenv";
import { App } from "./app";
import { initDb } from "./config/db";
import { logger } from "./utils/logger";
import { initRedis } from "./config/redis";

dotenv.config();

async function startServer() {
  try {
    await Promise.all([initDb(), initRedis()]);
    logger.info("Database and Redis has been initialized successfully");
    const app = new App();
    const port = process.env.PORT || 3000;
    app.express.listen(port, () => {
      logger.info(`Server running on port ${port}`);
    });
    //TODO:
    //Initialize job server to manage task in a queue
  } catch (error) {
    logger.error("Failed to start server", error);
    process.exit(1);
  }
}

startServer();
