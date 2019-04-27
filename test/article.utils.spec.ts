import { expect } from 'chai';
import { updateMTArticleFromMLArticle } from '../src/shared/article.utils';
import { MT_CHEAP, ML_CHEAP, MT_EXPENSIVE, ML_EXPENSIVE } from './mocks/articles.mock';

describe('Articles', () => {
  it('should have lower price', async () => {
    expect(MT_EXPENSIVE.history[MT_EXPENSIVE.history.length - 1].price).to.equal(360);
    expect(ML_CHEAP.price).to.equal(240);
    updateMTArticleFromMLArticle(MT_EXPENSIVE, ML_CHEAP);
    expect(MT_EXPENSIVE.history[MT_EXPENSIVE.history.length - 1].fluctuation).to.equal(-120);
  });

  it('should have higher price', async () => {
    expect(MT_CHEAP.history[MT_CHEAP.history.length - 1].price).to.equal(240);
    expect(ML_EXPENSIVE.price).to.equal(360);
    updateMTArticleFromMLArticle(MT_CHEAP, ML_EXPENSIVE);
    expect(MT_CHEAP.history[MT_CHEAP.history.length - 1].fluctuation).to.equal(120);
  });
});
