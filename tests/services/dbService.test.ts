import { savePostsToDb } from "../../src/services/dbService";
import { dbPool } from "../../src/config/db";

// Mock database (pg) to avoid database interaction
jest.mock("../../src/config/db", () => ({
  dbPool: {
    connect: jest.fn().mockResolvedValue({
      query: jest.fn().mockResolvedValue(undefined),
      release: jest.fn(),
    }),
  },
}));
const mockedDbPool = dbPool as jest.Mocked<typeof dbPool>;

describe("DbService", () => {
  it("saves posts with mocked database", async () => {
    const posts = [
      {
        thread: {
          title: "Test",
          url: "http://test.com",
          published: "2023-01-01",
          uuid: "mock-uuid",
          site_full: "test.com",
          site: "test.com",
          site_section: "",
          site_categories: [],
          section_title: "",
          title_full: "Test",
          replies_count: 0,
          participants_count: 0,
          site_type: "",
          country: "",
          main_image: "",
          performance_score: 0,
          domain_rank: 0,
          domain_rank_updated: "2023-01-01",
          social: { updated: "2023-01-01", facebook: { likes: 0, comments: 0, shares: 0 } },
        },
      },
    ];

    await savePostsToDb(posts);

    expect(mockedDbPool.connect).toHaveBeenCalled();
    const mockClient = await mockedDbPool.connect.mock.results[0].value;
    expect(mockClient.query).toHaveBeenCalledWith("BEGIN");
    expect(mockClient.query).toHaveBeenCalledWith(expect.stringContaining("INSERT INTO posts (title, url, published)"));
    expect(mockClient.query).toHaveBeenCalledWith("COMMIT");
    expect(mockClient.release).toHaveBeenCalled();
  });
});
