import { ArticleStatus, ArticleTags } from './../models/article/article.constants';
import { Error } from 'mongoose';
import splitargs from 'splitargs';
import { ICategoryLean } from './../models/category/category.interface';
import { Snapshot, Article, Seller, Category } from '../models';
import { IArticle } from '../models/article/article.interface';
import { IMLArticle, ISearchMLArticle, IMLCategory, IMLSeller } from '../interfaces';
import { MLService } from './ml.service';
import { logger } from '../shared';
import { updateMTArticleFromMLArticle } from '../shared/article.utils';

type IArticleNullable = (IArticle|null);

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

  public static async addSellers(sellers: IMLSeller[]) {
    return Seller.insertMany(sellers, { ordered: false });
  }

  public static async updateArticles(articles: IArticle[], mlArticles: IMLArticle[]): Promise<(IArticleNullable)[]> {
    const promises: Promise<IArticleNullable>[] = [];
    articles.forEach(async (article, i) => {
      const mlArticle = mlArticles[i];
      if (!mlArticle) return; // skipping because request failed for this article
      updateMTArticleFromMLArticle(article, mlArticle);
      if (article.isModified()) {
        // TODO: make pretty
        const promise = article
          .save()
          .catch((error) => {
            logger.log({ error, id: article.id });
            return error;
          })
          .then(() => null);
        promises.push(promise);
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

  public static async paginateArticles({ skip = 0, limit = 200, ...params }) {
    if (limit > 1000) {
      return Promise.reject(new Error('Using a limit higher than 1k is not allowed.'));
    }
    // TODO: this should be in some utils or another function for query building
    const query: any = {};
    if (params.search) {
      query.$text = { $search: this.parseSearchQuery(params.search) };
    }
    if (params.category) {
      const categories = await this.getSubcategories(params.category);
      query.category_id = { $in: categories };
    }
    if (params.priceMin || params.priceMax) {
      query.price = {};
      if (params.priceMin === params.priceMax) {
        query.price.$eq = params.priceMin;
      } else {
        if (params.priceMin) {
          query.price.$gt = params.priceMin;
        }
        if (params.priceMax) {
          query.price.$lt = params.priceMax;
        }
      }
    }
    if (params.pretty) {
      // getting "pretty" articles
      // => filtering for the ones that have good images & are active
      query.images = { $ne: [] };
      query.tags = ArticleTags.Good_Quality_Picture; // if query comes with tags this will be overwritten
      query.status = ArticleStatus.Active;
    }
    if (params.status) {
      query.status = params.status;
    }
    if (params.tags) {
      // assuming structure to be ?tags=tag_1,tag_2,tag_3
      query.tags = { $all: params.tags.split(',') };
    }
    try {
      const articles = await Article.find(query, null, { skip, limit });
      const total = Object.keys(params).length
        ? await Article.find(query).countDocuments()
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

  public static async getSubcategories (category: string): Promise<string[]> {
    if (!category) return [];
    const categories = [category];
    const subCategories = await Category.find({ parent: category }, { _id: 1 });
    return [...categories, ...subCategories.map(subCategory => subCategory._id)];
  }
}
