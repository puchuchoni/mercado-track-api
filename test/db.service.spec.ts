import mongoose from 'mongoose';
import mockdate from 'mockdate';
import { expect } from 'chai';
import { format, addDays } from 'date-fns';
import { Article } from '../src/models';
import { MLATEST_FIRST, MLATEST_SECOND, MLATEST_THIRD } from './articles.mock';
import { DBService } from '../src/services/db.service';

const leanPrice = { price: 123 };
const baseArticles = [MLATEST_FIRST, MLATEST_SECOND, MLATEST_THIRD];
const updatedArticles = baseArticles.map(article => Object.assign({}, article, leanPrice));

describe('DBService', () => {
  before(() => mongoose.connection.dropCollection('articles'));

  it('should insertMany articles', async () => {
    await DBService.createArticles(baseArticles);
    const articles = await Article.find();
    expect(articles.length).to.equal(3);
    expect(articles[0].images).to.be.empty;
  });

  it('should update lean and newly created articles', async () => {
    await DBService.updateArticles(baseArticles);
    const articles = await Article.find();
    for (const article of articles) {
      const imgUrl = `https://some-img/${article.id}`;
      expect(article.images).to.be.an('array').that.includes(imgUrl);
      expect(article.history).to.have.lengthOf(1);
    }
  });

  it('should update articles with a different price', async () => {
    await DBService.updateArticles(updatedArticles);
    const articles = await Article.find();
    for (const article of articles) {
      expect(article.history).to.have.lengthOf(2);
      expect(article.history.pop()).to.include({
        ...leanPrice,
        date: format(new Date(), 'DD/MM/YYYY'),
      });
    }
  });

  it('should update articles when the date changes', async () => {
    mockdate.set(addDays(new Date(), 1)); // mocking today as tomorrow
    await DBService.updateArticles(updatedArticles);
    mockdate.reset();
    const articles = await Article.find();
    for (const article of articles) {
      expect(article.history).to.have.lengthOf(3);
      expect(article.history.pop()).to.include({
        ...leanPrice,
        date: format(addDays(new Date(), 1), 'DD/MM/YYYY'),
      });
    }
  });
});
