export interface IMLArticle {
  id: string;
  price: number;
  original_price: number|null;
  currency_id: string;
  thumbnail: string;
  pictures: [{
    secure_url: string,
  }];
  status: string;
}

export interface IMLSearchResult {
  site_id: string;
  paging: {
    total: number;
    offset: number;
    limit: number;
  };
  results: IMLArticle[];
}

export interface IMLCategory {
  id: string;
  name: string;
  total_items_in_this_category: number;
  children_categories: IMLCategory[];
}
