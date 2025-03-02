export interface WebzThread {
  uuid: string;
  url: string;
  site_full: string;
  site: string;
  site_section: string;
  site_categories: string[];
  section_title: string;
  title: string;
  title_full: string;
  published: string;
  replies_count: number;
  participants_count: number;
  site_type: string;
  country: string;
  main_image: string;
  performance_score: number;
  domain_rank: number;
  domain_rank_updated: string;
  social: {
    updated: string;
    facebook: {
      likes: number;
      comments: number;
      shares: number;
    };
  };
}

export interface WebzPost {
  thread: WebzThread;
}

export interface WebzResponse {
  posts: WebzPost[];
  totalResults: number;
  moreResultsAvailable: number;
  next?: string;
}
