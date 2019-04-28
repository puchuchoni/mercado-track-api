import { DBService, MLService } from '../../services';
import { Article } from '../../models';
import { Progress } from './progress';
import { IMLArticle } from '../../interfaces';

const limit = 200;
let progress: Progress;

export class Sync {
  public static async run () {
    let skip = 0;
    const documentCount = await Article.estimatedDocumentCount();
    progress = new Progress(documentCount);
    try {
      let { articles } = await DBService.paginateArticles({ limit });
      while (articles.length) {
        if (progress.stopped) {
          progress.finish();
          return; // progress has been stopped so we return from the infinite loop
        }
        try {
          const mlArticles = await Sync.getMlArticles(articles);
          await DBService.updateArticles(articles, mlArticles);
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

  public static stop = () => progress && progress.stop();

  public static get progress() {
    return progress && progress.data;
  }

  private static async getMlArticles(articles): Promise<IMLArticle[]> {
    return Promise.all<IMLArticle>(
      articles.map(
        (article: IMLArticle): Promise<IMLArticle|null> => MLService.getArticle(article.id)
          .catch((error) => {
            progress.logError(error);
            return null; // returning null on catch for the promise not to throw
          }),
      ),
    );
  }

}
