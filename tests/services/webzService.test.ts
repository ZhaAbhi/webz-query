import { WebzService } from "../../src/services/webzService";
import { QueryBuilder } from "../../src/utils/queryBuilder";
import axios from "axios";
import { savePostsToDb } from "../../src/services/dbService";
import { redisClient } from "../../src/config/redis";

// Mock dependencies
jest.mock("axios");
jest.mock("../../src/services/dbService", () => ({
  savePostsToDb: jest.fn().mockResolvedValue(undefined),
}));
jest.mock("../../src/config/redis", () => ({
  redisClient: {
    get: jest.fn().mockResolvedValue(null),
    setEx: jest.fn().mockResolvedValue(undefined),
    isOpen: true,
    connect: jest.fn().mockResolvedValue(undefined),
  },
}));
const mockedAxios = axios as jest.Mocked<typeof axios>;
const mockedSavePostsToDb = savePostsToDb as jest.MockedFunction<typeof savePostsToDb>;

describe("WebzService", () => {
  it("fetches and saves posts using mocks", async () => {
    const webzService = new WebzService("https://api.webz.io/newsApiLite", "mock-token");
    const queryBuilder = new QueryBuilder().setQuery("test");
    const mockResponse = {
      data: {
        posts: [{ thread: { title: "Test", url: "http://test.com", published: "2023-01-01" } }],
        totalResults: 1,
        moreResultsAvailable: 0,
        next: undefined,
        requestsLeft: 100,
      },
    };
    mockedAxios.get.mockResolvedValue(mockResponse);
    const callback = jest.fn();

    await webzService.fetchAndSavePosts(queryBuilder, callback);

    expect(mockedAxios.get).toHaveBeenCalledWith("https://api.webz.io/newsApiLite?q=test&token=mock-token&format=json&size=10&sort=relevancy");
    expect(mockedSavePostsToDb).toHaveBeenCalledWith(mockResponse.data.posts);
    expect(callback).toHaveBeenCalledWith(1, 1);
  });
});
