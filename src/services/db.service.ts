import { Error } from 'mongoose';
import { Snapshot, Article } from '../models';
import { IArticle } from '../models/article/article.interface';
import { IMLArticle } from '../interfaces';
import { MLService } from './ml.service';

export class DBService {
  public static createArticles(items: IMLArticle[]): Promise<IArticle[]> {
    return Article.insertMany(items, { ordered: false });
  }

  public static async updateArticles(articles: IArticle[], mlArticles: IMLArticle[]): Promise<IArticle[]> {
    const promises: Promise<IArticle>[] = [];
    articles.forEach(async (article, i) => {
      const mlArticle = mlArticles[i];
      if (!mlArticle) return; // skipping because request failed for this article
      const lastSnapshot = article.history[article.history.length - 1];
      article.images = mlArticle.pictures && mlArticle.pictures.map(pic => pic.secure_url);
      article.status = mlArticle.status;
      if (!lastSnapshot || mlArticle.price !== lastSnapshot.price) {
        article.history.push(new Snapshot(mlArticle));
        article.price = mlArticle.price;
      }
      if (article.isModified()) {
        promises.push(article.save());
      }
    });
    return Promise.all(promises);
  }

  public static async followArticle(id: string) {
    const mlArticle = await MLService.getArticle(id);
    const final = {
      ...mlArticle,
      history: new Snapshot(mlArticle),
      images: mlArticle.pictures && mlArticle.pictures.map(pic => pic.secure_url),
    };
    return Article.create(final);
  }

  public static async paginateArticles({ search = '', skip = 0, limit = 200 }) {
    if (limit > 1000) {
      return Promise.reject(new Error('Using a limit higher than 1k is not allowed.'));
    }
    const query = search ? { $text: { $search: search } } : {};
    try {
      const articles = await Article.find(query, null, { skip, limit }).exec();
      const total = search
        ? await Article.find(query).count().exec()
        : await Article.estimatedDocumentCount();
      return { articles, total };
    } catch (err) {
      return Promise.reject(err.message);
    }
  }

}
