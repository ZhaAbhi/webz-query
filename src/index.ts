import * as dotenv from "dotenv";
import { App } from "./app";
import { initDb } from "./config/db";
import { logger } from "./utils/logger";

dotenv.config();

async function startServer() {
  try {
    await initDb();
    logger.info("Database initialized successfully");
    const app = new App();
    const port = process.env.PORT || 3000;
    app.express.listen(port, () => {
      logger.info(`Server running on port ${port}`);
    });
  } catch (error) {
    logger.error("Failed to start server", error);
    process.exit(1);
  }
}

startServer();
