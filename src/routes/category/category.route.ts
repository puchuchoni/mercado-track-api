import express, { Response, Request } from 'express';
import { Category } from '../../models';

export const categoryRouter = express.Router();

categoryRouter.route('/')
  .get(getCategories);

async function getCategories(_req: Request, res: Response) {
  try {
    const categories = await Category.find({});
    res.send({
      categories,
      count: categories.length,
    });
  } catch (error) {
    // TODO: use variable instead of hardcoded status
    res.status(500).send({ error });
  }
}
