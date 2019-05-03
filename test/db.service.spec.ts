import mongoose from 'mongoose';
import mockdate from 'mockdate';
import { expect } from 'chai';
import { format, addDays } from 'date-fns';
import { Article } from '../src/models';
import { MLATEST_FIRST, MLATEST_SECOND, MLATEST_THIRD, MLATEST_ARTICLES_SEARCH_RESULT } from './articles.mock';
import { DBService } from '../src/services/db.service';

const leanPrice = 123;
const baseArticles = [MLATEST_FIRST, MLATEST_SECOND, MLATEST_THIRD];
const updatedArticles = baseArticles.map(article => Object.assign({}, article, { price: leanPrice }));

describe('DBService', () => {
  before(() => mongoose.connection.dropCollection('articles'));
  it('should insertMany articles', async () => {
    await DBService.createArticles(MLATEST_ARTICLES_SEARCH_RESULT, 'category_id');
    const articles = await Article.find();
    expect(articles.length).to.equal(3);
    expect(articles[0].images).to.be.empty;
    expect(articles[0].seller_id).to.equal(123);
    expect(articles[2].seller_id).to.equal(999);
  });
  it('should update lean and newly created articles', async () => {
    let articles = await Article.find();
    await DBService.updateArticles(articles, baseArticles);
    articles = await Article.find();
    for (const article of articles) {
      expect(article.history).to.have.lengthOf(1);
      expect(article.price).to.exist;
    }
  });
  it('should update articles with a different price', async () => {
    let articles = await Article.find();
    await DBService.updateArticles(articles, updatedArticles);
    articles = await Article.find();
    for (const article of articles) {
      expect(article.history).to.have.lengthOf(2);
      expect(article.history.pop()).to.include({
        price: leanPrice,
        date: format(new Date(), 'DD/MM/YYYY'),
      });
      expect(article.price).to.be.eq(leanPrice);
    }
  });
  it('should update article with a different status', async () => {
    const pausedStatusObj = { status: 'paused' };
    let articles = await Article.find();
    const articleWithDifferentStatus = Object.assign({}, updatedArticles[0], pausedStatusObj);
    await DBService.updateArticles(articles, [articleWithDifferentStatus]);
    articles = await Article.find();
    const updatedArticle = articles.find(article => article.id === articleWithDifferentStatus.id);
    expect(updatedArticle).to.exist.and.to.include(pausedStatusObj);
  });
  it('should not update articles when only the date changes', async () => {
    mockdate.set(addDays(new Date(), 1)); // mocking today as tomorrow
    let articles = await Article.find();
    await DBService.updateArticles(articles, updatedArticles);
    articles = await Article.find();
    mockdate.reset();
    for (const article of articles) {
      expect(article.history).to.have.lengthOf(2);
      expect(article.history.pop()).to.include({
        price: leanPrice,
        date: format(new Date(), 'DD/MM/YYYY'),
      });
    }
  });
  it('should parse the search query correctly', () => {
    const query = 'some text "with quotes" somewhere';
    expect(DBService.parseSearchQuery(query))
      .to.be.an('array')
      .and.to.have.members(['"somewhere"', '"text"', '"with quotes"', '"some"']) // with quotes
      .and.not.to.have.members(['somewhere', 'text', 'with quotes', 'some']); // without quotes
  });
});
