export interface IBaseMLArticle {
  id: string;
  title: string;
  price: number;
  original_price: number|null;
  currency_id: string;
  thumbnail: string;
}

export interface IMLArticle extends IBaseMLArticle {
  status: string;
  seller_id: number;
  pictures: [{
    secure_url: string;
  }];
}

export interface ISearchMLArticle extends IBaseMLArticle {
  seller: {
    id: number;
  };
}

export interface IMLSeller {
  id: number;
  nickname: string;
}

export interface IMLSearchResult {
  site_id: string;
  paging: {
    total: number;
    offset: number;
    limit: number;
  };
  results: ISearchMLArticle[];
}

export interface IMLCategory {
  id: string;
  name: string;
  total_items_in_this_category: number;
  children_categories: IMLCategory[];
}
