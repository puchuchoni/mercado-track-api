import express from 'express';
import { IReqParams, Status, DefaultQueryParams, CONSTANTS } from './article.constants';
import { DBService, MLService } from '../../services';
import { isValidNumber } from '../../shared/utils';
import { Article } from '../../models';

export const articleRouter = express.Router();

articleRouter.route('/')
  .get(articlesGetMany)
  .post(articleFollow);

articleRouter.route('/ml/:id')
  .get(getMlArticle);

articleRouter.route('/:id')
  .get(articlesGetOne)
  .delete(articlesDeleteOne);

async function articlesGetMany(req: express.Request, res: express.Response) {
  try {
    const error = validateParams(req.query);
    if (error) {
      return res.status(Status.BadRequest).send({ error });
    }
    const {
      search,
      skip = DefaultQueryParams.Skip,
      limit = DefaultQueryParams.Limit,
    } = req.query;

    const { articles, total } = await DBService.paginateArticles({
      search,
      skip: +skip,
      limit: +limit,
    });
    const response = { skip, limit, total, page: articles };
    res.status(Status.Ok).json(response);
  } catch (err) {
    res.status(Status.BadRequest).send(err);
  }
}

async function articleFollow(req: express.Request, res: express.Response) {
  try {
    const { id } = req.body;
    if (!id) {
      return res.status(Status.BadRequest).send({ message: CONSTANTS.INVALID_ARTICLE_ID });
    }
    const result = await DBService.followArticle(req.body.id);
    res.status(Status.Created).send(result);
  } catch (err) {
    res.status(Status.Error).send(err);
  }
}

async function articlesGetOne(req: express.Request, res: express.Response) {
  try {
    const { id } = req.params;
    const [article] = await Article.find({ id }).exec();
    if (article) res.status(Status.Ok).json(article);
    else res.status(Status.NotFound).send({ message: CONSTANTS.ARTICLE_NOT_FOUND(id) });
  } catch (err) {
    res.status(Status.Error).send(err);
  }
}

async function articlesDeleteOne(req: express.Request, res: express.Response) {
  try {
    const { id } = req.params;
    const { n } = await Article.deleteOne({ id }).exec();
    if (!n) res.status(Status.NotFound).send({ message: CONSTANTS.ARTICLE_NOT_FOUND(id) });
    else res.status(Status.Ok).json({ id, message: CONSTANTS.DELETED });
  } catch (err) {
    res.status(Status.Error).send(err);
  }
}

async function getMlArticle(req: express.Request, res: express.Response) {
  const { id } = req.params;
  try {
    const article = await MLService.getArticle(id);
    res.json(article);
  } catch (err) {
    res.status(Status.Error).send(err);
  }
}

// utils
function validateParams(params: IReqParams) {
  let error = '';
  if (!isValidNumber(params.skip)) {
    error = CONSTANTS.INVALID_SKIP;
  }
  if (!isValidNumber(params.limit)) {
    error = CONSTANTS.INVALID_LIMIT;
  }
  return error;
}
