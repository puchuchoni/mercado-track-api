import { expect } from 'chai';
import { Article } from '../src/models';
import { MLATEST_FIRST, MLATEST_SECOND, MLATEST_THIRD } from './articles.mock';

describe('Articles', () => {
  before(async () => {
    const baseArticles = [MLATEST_FIRST, MLATEST_SECOND];
    for (const mock of baseArticles) {
      await new Article(mock).save();
    }
  });

  it('should find all articles', async () => {
    const articles = await Article.find();
    expect(articles.length).to.equal(2);
    expect(articles[1].id).to.equal(MLATEST_SECOND.id);
  });

  it('should add an article', async () => {
    await new Article(MLATEST_THIRD).save();
    const [, , article] = await Article.find();
    expect(article.id).to.equal(MLATEST_THIRD.id);
  });

  it('should remove an article', async () => {
    await Article.deleteOne({ id: MLATEST_FIRST.id });
    const articles = await Article.find();
    expect(articles.length).to.equal(2);
  });
});
