export interface IMLArticle {
  id: string;
  price: number;
  original_price: number|null;
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
