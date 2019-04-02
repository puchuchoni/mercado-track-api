import { IMLArticle, ISearchMLArticle } from '../src/interfaces/ml.interfaces';

export const MLATEST_FIRST: IMLArticle = {
  id: 'MLATEST_FIRST',
  title: 'First Title',
  original_price: null,
  pictures: [{
    secure_url: 'https://some-img/MLATEST_FIRST',
  }],
  currency_id: 'ARS',
  price: 999,
  thumbnail: 'www.thumbnail.com/MLATEST_FIRST',
  status: 'active',
};

export const MLATEST_SECOND: IMLArticle = {
  id: 'MLATEST_SECOND',
  title: 'Second Title',
  original_price: null,
  pictures: [{
    secure_url: 'https://some-img/MLATEST_SECOND',
  }],
  currency_id: 'ARS',
  price: 999,
  thumbnail: 'www.thumbnail.com/MLATEST_SECOND',
  status: 'active',
};

export const MLATEST_THIRD: IMLArticle = {
  id: 'MLATEST_THIRD',
  title: 'Third Title',
  original_price: null,
  pictures: [{
    secure_url: 'https://some-img/MLATEST_THIRD',
  }],
  currency_id: 'ARS',
  price: 999,
  thumbnail: 'www.thumbnail.com/MLATEST_THIRD',
  status: 'active',
};

export const MLATEST_ARTICLES_SEARCH_RESULT: ISearchMLArticle[] = [
  {
    ...MLATEST_FIRST,
    seller: {
      id: 123,
    },
  },
  {
    ...MLATEST_SECOND,
    seller: {
      id: 123,
    },
  },
  {
    ...MLATEST_THIRD,
    seller: {
      id: 999,
    },
  },
];
