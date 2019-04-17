import { IMLArticle, ISearchMLArticle } from '../src/interfaces/ml.interfaces';
import { IArticle } from '../src/models/article/article.interface';

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

export const ML_CHEAP: IMLArticle = {
  id: 'ML_THIRD',
  title: 'Cheap Title',
  original_price: null,
  pictures: [{
    secure_url: 'https://some-img/ML_THIRD',
  }],
  currency_id: 'ARS',
  price: 240,
  thumbnail: 'www.thumbnail.com/ML_THIRD',
  status: 'active',
};

export const ML_EXPENSIVE: IMLArticle = {
  id: 'ML_EXPENSIVE',
  title: 'Expensive Title',
  original_price: null,
  pictures: [{
    secure_url: 'https://some-img/ML_EXPENSIVE',
  }],
  currency_id: 'ARS',
  price: 360,
  thumbnail: 'www.thumbnail.com/ML_EXPENSIVE',
  status: 'active',
};

export const MT_CHEAP: IArticle = {
  id: 'MT_CHEAP',
  title: 'Cheap Title',
  currency_id: 'ARS',
  price: 240,
  thumbnail: 'www.thumbnail.com/MT_CHEAP',
  status: 'active',
  history: [{ original_price: 200, price: 240, fluctuation: 0 }]
};

export const MT_EXPENSIVE: IArticle = {
  id: 'MT_THIRD',
  title: 'Expensive Title',
  currency_id: 'ARS',
  price: 360,
  thumbnail: 'www.thumbnail.com/T_EXPENSIVE',
  status: 'active',
  history: [{ original_price: 300, price: 360, fluctuation: 0 }]
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
