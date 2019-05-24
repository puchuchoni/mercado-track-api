import { MLService } from './services/ml.service';
import { Article } from './models/article/article.model';
import { logger } from './shared';

export const addCategoryToArticlesWithNoCategory = async () => {
  const limit = 50;
  const noCategoryQuery = { category_id: { $exists: false } };
  const total = await Article.countDocuments(noCategoryQuery);
  logger.log({ total });
  let articles = await Article.find(noCategoryQuery, null, { limit });
  let skip = 0;
  while (articles.length) {
    skip += limit;
    const promises = articles.map(async (article) => {
      try {
        const mlArticle = await MLService.getArticle(article.id) as any;
        const category = await MLService.getCategory(mlArticle.category_id) as any;
        const [, childCategory] = category.path_from_root;
        article.category_id = childCategory.id;
        await article.save();
        return ':)';
      } catch (err) {
        // logger.log('error', err._message);
        return ':(';
      }
    });
    try {
      await Promise.all(promises);
      logger.log(`${skip} / ${total} - ${+(skip * 100 / total).toFixed(3)} - e.g. ${articles[0].id}`);
      articles = await Article.find(noCategoryQuery, null, { skip, limit });
    } catch (err) {
      logger.log('error2', err);
      articles = [];
    }
  }
  logger.log('finished');
};
