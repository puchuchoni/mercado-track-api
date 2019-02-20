import { Error } from 'mongoose';
import { BulkWriteOpResultObject } from 'mongodb';
import { Snapshot, Article } from '../models';
import { IArticle } from '../models/article/article.interface';
import { IMLArticle } from '../interfaces';
import { MLService } from './ml.service';

export class DBService {
  public static createArticles(items: IMLArticle[]): Promise<IArticle[]> {
    return Article.insertMany(items, { ordered: false });
  }

  public static async updateArticles(articles: IMLArticle[]): Promise<BulkWriteOpResultObject> {
    const bulkUpdateOps = articles.map(DBService.articleUpdateOp);
    return Article.collection.bulkWrite(bulkUpdateOps);
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
    const fields = '-_id -__v';
    const query = search ? { $text: { $search: search } } : {};
    try {
      const articles = await Article.find(query, fields, { skip, limit }).exec();
      const total = search
        ? await Article.find(query).count().exec()
        : await Article.estimatedDocumentCount();
      return { articles, total };
    } catch (err) {
      return Promise.reject(err.message);
    }
  }

  private static articleUpdateOp = (mlArticle: IMLArticle) => ({
    updateOne: {
      filter: { id: mlArticle.id },
      update: {
        $set: {
          images: mlArticle.pictures ? mlArticle.pictures.map(pic => pic.secure_url) : [],
          status: mlArticle.status,
          thumbnail: mlArticle.thumbnail,
          discount: DBService.calcDiscount(mlArticle),
        },
        $addToSet: {
          history: new Snapshot({
            price: mlArticle.price,
            original_price: mlArticle.original_price,
          }),
        },
      },
    },
  })

  private static calcDiscount = ({ original_price, price }) => {
    return original_price
      ? Math.floor(((original_price - price) * 100) / original_price)
      : 0;
  }

}
