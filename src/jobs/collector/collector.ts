import { DBService, MLService } from '../../services';
import { MainCategories } from '../../constants';
import { Progress } from './progress';
import { Sync } from './../sync';
import { IMLSearchResult } from '../../interfaces/ml.interfaces';

const limit = 50;
const maxOffset = 10000;

let progress: Progress;

export class Collector {

  public static async run() {
    await Sync.stop();
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
    Sync.run();
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
      await this.createArticles(page, categoryId);
      await this.addSellers(page);
      progress.pageStep(page.results.length);
    } catch (error) {
      // todo: add # of new articles vs already existing articles
      if (page) progress.pageStep(page.results.length);
      if (progress) progress.logError(error);
    }
  }

  private static async createArticles(page: IMLSearchResult, categoryId: string) {
    DBService.createArticles(page.results, categoryId).catch(() => {
      // silent errors to continue execution
    });
  }

  private static async addSellers(page: IMLSearchResult) {
    try {
      const sellersSet = new Set(page.results.map(article => article.seller.id));
      const sellersPromises = Array.from(sellersSet).map(MLService.getSeller);
      const sellers = await Promise.all(sellersPromises);
      return DBService.addSellers(sellers);
    } catch (err) {
      // silent errors to continue execution
    }
  }
}
