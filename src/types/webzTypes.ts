export interface WebzPost {
  title: string;
  url: string;
  published: string;
}

export interface WebzResponse {
  posts: WebzPost[];
  totalResults: number;
  moreResultsAvailable: number;
  next?: string;
}
