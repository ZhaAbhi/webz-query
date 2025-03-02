export class QueryBuilder {
  private query: string = "";
  private format: string = "json";
  private sort: string = "relevancy";
  private filters: Record<string, string> = {};
  private additionalParams: Record<string, string> = {};

  setQuery(query: string): this {
    this.query = this.sanitize(query);
    return this;
  }

  setFormat(format: "json" | "xml"): this {
    this.format = format;
    return this;
  }

  setSort(sort: "relevancy" | "date" | "popularity"): this {
    this.sort = sort;
    return this;
  }

  addFilter(key: string, value: string): this {
    this.filters[this.sanitize(key)] = this.sanitize(value);
    return this;
  }

  addParam(key: string, value: string): this {
    this.additionalParams[key] = this.sanitize(value);
    return this;
  }

  build(baseUrl: string, token: string, size: number): string {
    if (!this.query) throw new Error("Query is required");
    const filterString = Object.entries(this.filters)
      .map(([key, value]) => `${key}:${value}`)
      .join(" ");
    const fullQuery = `${this.query} ${filterString}`.trim();

    const params = new URLSearchParams({
      q: fullQuery,
      token,
      format: this.format,
      size: size.toString(),
      sort: this.sort,
      ...this.additionalParams,
    });

    return `${baseUrl}?${params.toString()}`;
  }

  private sanitize(input: string): string {
    return (input || "").trim().replace(/[<>]/g, "");
  }
}
