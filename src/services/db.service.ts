import { Error } from 'mongoose';
import splitargs from 'splitargs';
import { ICategoryLean } from './../models/category/category.interface';
import { Snapshot, Article, Category } from '../models';
import { IArticle } from '../models/article/article.interface';
import { IMLArticle, ISearchMLArticle, IMLCategory } from '../interfaces';
import { MLService } from './ml.service';
import { logger } from '../shared';
import { updateMTArticleFromMLArticle } from '../shared/article.utils';
export class DBService {
  public static createArticles(mlArticles: ISearchMLArticle[], categoryId: string)
  : Promise<IArticle[]> {
    const categoryInfo = { category_id: categoryId };
    const items = mlArticles.map((article) => {
      const sellerInfo = { seller_id: article.seller.id };
      return Object.assign({}, article, sellerInfo, categoryInfo);
    });
    return Article.insertMany(items, { ordered: false });
  }

  public static async updateArticles(articles: IArticle[], mlArticles: IMLArticle[]): Promise<IArticle[]> {
    const promises: Promise<IArticle>[] = [];
    articles.forEach(async (article, i) => {
      const mlArticle = mlArticles[i];
      if (!mlArticle) return; // skipping because request failed for this article
      updateMTArticleFromMLArticle(article, mlArticle);
      if (article.isModified()) {
        promises.push(article.save());
      }
    });
    return Promise.all(promises);
  }

  public static async followArticle(id: string) {
    const mtArticle = await Article.findOne({ id }).exec();
    const mlArticle = await MLService.getArticle(id);
    if (!mtArticle) {
      const final = {
        ...mlArticle,
        history: new Snapshot(mlArticle),
        images: mlArticle.pictures && mlArticle.pictures.map(pic => pic.secure_url),
      };
      return Article.create(final);
    }

    updateMTArticleFromMLArticle(mtArticle, mlArticle);
    return mtArticle.save();
  }

  public static async paginateArticles({ search = '', skip = 0, limit = 200 }) {
    if (limit > 1000) {
      return Promise.reject(new Error('Using a limit higher than 1k is not allowed.'));
    }
    const query = search ? { $text: { $search: this.parseSearchQuery(search) } } : {};
    try {
      const articles = await Article.find(query, null, { skip, limit });
      const total = search
        ? await Article.find(query).count()
        : await Article.estimatedDocumentCount();
      return { articles, total };
    } catch (err) {
      return Promise.reject(err.message);
    }
  }

  public static async addCategory(category: IMLCategory, parentCategory?: IMLCategory) {
    const categoryObj: ICategoryLean = {
      _id: category.id,
      name: category.name,
    };
    try {
      const dbCategory = await Category.findById(category.id);
      if (!!dbCategory) return;
      if (parentCategory) {
        await Category.create({ ...categoryObj, parent: parentCategory.id });
      } else {
        await Category.create(categoryObj);
      }
    } catch (err) {
      logger.log(`Couldn't save category ${category.id}`, err.errmsg);
    }
  }

  public static parseSearchQuery (query): string[] {
    return splitargs(query).map(str => `"${str}"`);
  }
}
