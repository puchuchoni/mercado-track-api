import { IArticle } from '../models/article/article.interface';
import { IMLArticle } from '../interfaces';
import { Snapshot } from '../models';

export function updateMTArticleFromMLArticle(article: IArticle, mlArticle: IMLArticle) {
  const lastSnapshot = article.history[article.history.length - 1];
  article.images = mlArticle.pictures && mlArticle.pictures.map(pic => pic.secure_url);
  article.status = mlArticle.status;
  article.title = mlArticle.title;
  article.seller_id = mlArticle.seller_id;
  if (!mlArticle.price) return;
  if (!lastSnapshot || mlArticle.price !== lastSnapshot.price) {
    article.history.push(new Snapshot(mlArticle));
    if (article.history.length > 1) {
      const currentSnapshot = article.history[article.history.length - 1];
      const previousSnapshot = article.history[article.history.length - 2];
      if (currentSnapshot.price && previousSnapshot.price) {
        currentSnapshot.fluctuation = currentSnapshot.price - previousSnapshot.price;
      }
    }
    article.price = mlArticle.price;
  }
}
