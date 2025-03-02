export class QueryBuilder {
  private query: string = "";
  private format: string = "json";
  private additionalParams: Record<string, string> = {};

  setQuery(query: string): this {
    this.query = query;
    return this;
  }

  setFormat(format: string): this {
    this.format = format;
    return this;
  }
  addPara(key: string, value: string): this {
    this.additionalParams[key] = value;
    return this;
  }

  build(baseUrl: string, token: string, size: number): string {
    const params = new URLSearchParams({
      q: this.query,
      token,
      format: this.format,
      size: size.toString(),
      ...this.additionalParams,
    });
    return `${baseUrl}?${params.toString()}`;
  }
}
