import express, { Response, Request } from 'express';
import { Category, Article } from '../../models';
import { Cache } from 'memory-cache';
import { ICategory } from '../../models/category/category.interface';
import { Status } from '../article/article.constants';

const cache = new Cache();
const cacheTime = 5 * 60 * 60 * 1000; // 5 hrs
const CATEGORY_KEY = 'CATEGORIES';

export const categoryRouter = express.Router();

categoryRouter.route('/')
  .get(getCategories);

interface ICategoryItem extends ICategory {
  articleCount: number;
}

async function getCategories(_req: Request, res: Response) {
  const cachedCategories = cache.get(CATEGORY_KEY);
  if (cachedCategories) {
    return res.send({ categories: cachedCategories });
  }

  try {
    const dbCategories = await Category.find({}).lean();
    const categories: ICategoryItem[] = [];
    const documentCountPromises = dbCategories.map(
      dbCategory => Article.find({ category_id: dbCategory._id }).countDocuments(),
    );
    const documentCounts = await Promise.all(documentCountPromises);
    for (let i = 0; i < documentCounts.length; i++) {
      const dbCategory = dbCategories[i];
      const articleCount = documentCounts[i];
      categories.push({ ...dbCategory, articleCount });
    }
    cache.put(CATEGORY_KEY, categories, cacheTime);
    res.send({ categories });
  } catch (error) {
    res.status(Status.Error).send({ error });
  }
}
