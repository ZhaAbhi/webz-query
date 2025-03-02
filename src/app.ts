import express, { Request, Response } from "express";
import { WebzService } from "./services/webzService";
import { QueryBuilder } from "./utils/queryBuilder";
import { logger } from "./utils/logger";
import { validateQueryParams } from "./middleware/validateQuery";
import * as dotenv from "dotenv";

dotenv.config();

export class App {
  public express: express.Application;
  private webzService: WebzService;

  constructor() {
    this.express = express();
    this.express.use(express.json());
    this.webzService = new WebzService(process.env.WEBZ_API_URL!, process.env.WEBZ_API_TOKEN!);
    this.configureRoutes();
  }

  private configureRoutes(): void {
    this.express.get("/fetch-posts", async (req: Request, res: Response) => {
      try {
        const { query, format, sort, language, filters } = req.query;

        const queryBuilder = new QueryBuilder()
          .setQuery((query as string) || "technology")
          .setFormat((format as "json" | "xml") || "json")
          .setSort((sort as "relevancy" | "date" | "popularity") || "relevancy");

        if (filters) {
          const filterArray = (filters as string).split(",");
          filterArray.forEach((filter) => {
            const [key, value] = filter.split(":");
            if (key && value) queryBuilder.addFilter(key, value);
          });
        }
        //TODO:
        //Implement rate limiting at the endpoint level
        await this.webzService.fetchAndSavePosts(queryBuilder, (fetchedCount, totalCount) => {
          res.json({
            fetchedCount,
            totalCount,
            message: "Posts fetched and saved successfully",
          });
        });
      } catch (error) {
        logger.error("Error in /fetch-posts endpoint:", error);
        res.status(500).json({ error: "Failed to fetch and save posts" });
      }
    });

    this.express.get("/health", (_req: Request, res: Response) => {
      res.status(200).json({ status: "OK", timestamp: new Date().toISOString() });
    });
  }
}
