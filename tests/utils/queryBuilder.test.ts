import { QueryBuilder } from "../../src/utils/queryBuilder";

describe("QueryBuilder", () => {
  it("builds a basic query URL", () => {
    const queryBuilder = new QueryBuilder().setQuery("test");
    const url = queryBuilder.build("https://api.webz.io/newsApiLite", "mock-token", 10);
    expect(url).toContain("q=test");
    expect(url).toContain("token=mock-token");
    expect(url).toContain("size=10");
  });
});
