import axios, { AxiosError } from "axios";
import { WebzResponse, WebzPost } from "../types/webzTypes";
import { logger } from "../utils/logger";
import { QueryBuilder } from "../utils/queryBuilder";
import { savePostsToDb } from "./dbService";

export class WebzService {
  private readonly apiUrl: string;
  private readonly apiToken: string;
  private readonly apiBatchSize = 10;
  private readonly targetBatchSize = 200;

  constructor(apiUrl: string, apiToken: string) {
    this.apiUrl = apiUrl;
    this.apiToken = apiToken;
  }

  public async fetchAndSavePosts(queryBuilder: QueryBuilder, callback: (fetchedCount: number, totalCount: number) => void): Promise<void> {
    let totalSaved = 0;
    let nextUrl: string | undefined = undefined;
    let lastResponse: WebzResponse | undefined = undefined;

    do {
      const postsInBatch: WebzPost[] = [];
      let batchNextUrl = nextUrl;

      while (postsInBatch.length < this.targetBatchSize && (batchNextUrl || !nextUrl)) {
        try {
          const response = await this.fetchPosts(queryBuilder, batchNextUrl);
          postsInBatch.push(...response.posts);
          totalSaved += response.posts.length;
          lastResponse = response;
          batchNextUrl = response.moreResultsAvailable > 0 ? response.next : undefined;
          //TODO:
          // Check requestLeft and implement rate limiting
          if (response.moreResultsAvailable === 0 || totalSaved >= response.totalResults) {
            break;
          }
        } catch (error) {
          logger.error(`Failed to fetch batch, continuing with next available URL: ${error}`);
          if (lastResponse && lastResponse.moreResultsAvailable > 0) {
            batchNextUrl = lastResponse.next;
          } else {
            batchNextUrl = undefined;
          }
          break;
        }
      }

      if (postsInBatch.length > 0) {
        try {
          await savePostsToDb(postsInBatch);
          logger.info(`Saved ${postsInBatch.length} posts in batch. Total saved: ${totalSaved}`);
        } catch (error) {
          logger.error(`Failed to save batch of ${postsInBatch.length} posts, skipping: ${error}`);
        }
      }

      nextUrl = lastResponse && lastResponse.moreResultsAvailable > 0 ? lastResponse.next : undefined;

      //TODO:
      // Add a job queue for large totalResults (eg: Bull/rabbitmq/redis)

      if (totalSaved >= (lastResponse?.totalResults || 0) || !nextUrl) {
        logger.info("All posts fetched and saved (or no more available).");
        break;
      }
    } while (nextUrl);

    if (lastResponse) {
      callback(totalSaved, lastResponse.totalResults);
    } else {
      logger.warn("No successful responses received from Webz.io API");
      callback(totalSaved, 0);
    }
    //TODO:
    //API limits to 10 posts per request, fetching 200 requires 20 calls per batch
  }

  private async fetchPosts(queryBuilder: QueryBuilder, nextUrl?: string): Promise<WebzResponse> {
    let url: string;
    if (nextUrl) {
      url = `${this.apiUrl}${nextUrl.replace(/^\/newsApiLite/, "")}`;
    } else {
      url = queryBuilder.build(this.apiUrl, this.apiToken, this.apiBatchSize);
    }

    try {
      const response = await axios.get<WebzResponse>(url);
      logger.info(`Fetched posts from: ${url}`);
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError;
      logger.error(`Error fetching posts from Webz.io: ${axiosError.response ? JSON.stringify(axiosError.response.data) : axiosError.message}`, { url, status: axiosError.response?.status });
      throw error;
    }
  }
}
