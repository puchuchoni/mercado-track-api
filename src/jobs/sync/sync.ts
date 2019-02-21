import { DBService, MLService } from '../../services';
import { Article } from '../../models';
import { Progress } from './progress';
import { IMLArticle } from '../../interfaces';

const limit = 50;
let progress: Progress;

export class Sync {

  public static async run () {
    let skip = 0;
    const documentCount = await Article.estimatedDocumentCount();
    progress = new Progress(documentCount);
    try {
      let { articles } = await DBService.paginateArticles({ limit });
      while (articles.length) {
        try {
          const mlArticles = await Sync.getMlArticles(articles);
          await DBService.updateArticles(mlArticles);
          progress.step(articles.length);
          skip += limit;
          const pagination = await DBService.paginateArticles({ skip, limit });
          articles = pagination.articles;
        } catch (error) {
          if (progress) progress.logError(error);
          articles = [];
        }
      }
    } catch (error) {
      if (progress) progress.logError(error);
    }
    progress.finish();
    Sync.run();
  }

  public static get progress() {
    return progress && progress.data;
  }

  private static async getMlArticles(articles): Promise<IMLArticle[]> {
    const mlArticles = await Promise.all<IMLArticle>(
      /* returning null on catch for the promise not to throw, we'll filter later */
      articles.map(
        (article: IMLArticle): Promise<IMLArticle|null> => MLService.getArticle(article.id)
          .catch((error) => {
            progress.logError(error);
            return null;
          }),
      ),
    );
    return mlArticles.filter(article => !!article);
  }

}
