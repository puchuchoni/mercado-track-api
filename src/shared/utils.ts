import { IArticle } from '../models/article/article.interface';
import { IMLArticle } from '../interfaces';
import { Snapshot } from '../models';

export function isValidNumber(value: string): boolean {
  const reg = /\D/g;
  return !reg.test(value);
}

export function datesHoursDiff(startDate: Date, endDate: Date): number {
  const dateDiff = endDate.getTime() - startDate.getTime();
  return Math.floor((dateDiff % 86400000) / 3600000);
}

export function updateArticleFluctuation(article: IArticle) {
  if (article.history.length > 1) {
    const currentSnapshot = article.history[article.history.length - 1];
    const lastSnapshot = article.history[article.history.length - 2];
    currentSnapshot.fluctuation = currentSnapshot.price - lastSnapshot.price;
  }
}

export function updateMTArticleFromMLArticle(article: IArticle, mlArticle: IMLArticle) {
  const lastSnapshot = article.history[article.history.length - 1];
  article.images = mlArticle.pictures && mlArticle.pictures.map(pic => pic.secure_url);
  article.status = mlArticle.status;
  article.title = mlArticle.title;
  article.seller_id = mlArticle.seller_id;
  if (!lastSnapshot || mlArticle.price !== lastSnapshot.price) {
    article.history.push(new Snapshot(mlArticle));
    updateArticleFluctuation(article);
    article.price = mlArticle.price;
  }
}
