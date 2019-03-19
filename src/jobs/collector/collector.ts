import { DBService, MLService } from '../../services';
import { MainCategories } from '../../constants';
import { Progress } from './progress';

const limit = 50;
const maxOffset = 10000;

let progress: Progress;

export class Collector {

  public static async run() {
    const categories = Object.values(MainCategories);
    progress = new Progress(categories.length);
    for (const categoryId of categories) {
      try {
        const category = await MLService.getCategory(categoryId);
        const subCategories = category.children_categories;
        progress.setChildrenCategorySize(subCategories.length);
        for (const subCategory of subCategories) {
          await DBService.addCategory(subCategory, category);
          await Collector.processCategory(subCategory.id);
          progress.childrenCategoryStep();
        }
        await DBService.addCategory(category);
        await Collector.processCategory(categoryId);
        progress.mainCategoryStep();
      } catch (error) {
        progress.logError(error);
      }
    }
    progress.finish();
  }

  public static get progress() {
    return progress && progress.data;
  }

  private static async processCategory(categoryId: string) {
    try {
      const page = await MLService.searchByCategory({ categoryId });
      const pagesTotal = Math.ceil(page.paging.total / limit);
      const promises: Promise<void>[] = [];
      for (let pageNumber = 0; pageNumber < pagesTotal && pageNumber * limit <= maxOffset; pageNumber++) {
        promises.push(Collector.processPage(pageNumber, categoryId));
      }
      return Promise.all(promises);
    } catch (error) {
      if (progress) progress.logError(error);
    }
  }

  private static async processPage(pageNumber: number, categoryId: string) {
    let page;
    try {
      const offset = pageNumber * limit;
      page = await MLService.searchByCategory({ categoryId, offset, limit });
      await DBService.createArticles(page.results, categoryId);
      progress.pageStep(page.results.length);
    } catch (error) {
      // todo: add # of new articles vs already existing articles
      if (page) progress.pageStep(page.results.length);
      if (progress) progress.logError(error);
    }
  }

}
