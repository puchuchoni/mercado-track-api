import express, { Response, Request } from 'express';
import { CacheService } from '../../services';
import { Status } from '../article/article.constants';
import { CategoryRouteService } from './category.route.service';

export const categoryRouter = express.Router();

categoryRouter.route('/')
  .get(getCategories);

async function getCategories(_req: Request, res: Response) {
  if (CacheService.categories) {
    return res.send({ categories: CacheService.categories });
  }
  try {
    const categories = await CategoryRouteService.getCategoriesAggregated();
    res.send({ categories });
  } catch (error) {
    res.status(Status.Error).send({ error });
  }
}
