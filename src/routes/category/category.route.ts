import express, { Response, Request } from 'express';
import { Cache } from 'memory-cache';
import { Status } from '../article/article.constants';
import { CategoryRouteService } from './category.route.service';

const cache = new Cache();
const cacheTime = 24 * 60 * 60 * 1000; // 24 hrs
const CATEGORY_KEY = 'CATEGORIES';

export const categoryRouter = express.Router();

categoryRouter.route('/')
  .get(getCategories);

async function getCategories(_req: Request, res: Response) {
  const cachedCategories = cache.get(CATEGORY_KEY);
  if (cachedCategories) {
    return res.send({ categories: cachedCategories });
  }
  try {
    const categories = await CategoryRouteService.getCategoriesAggregated();
    cache.put(CATEGORY_KEY, categories, cacheTime);
    res.send({ categories });
  } catch (error) {
    res.status(Status.Error).send({ error });
  }
}
