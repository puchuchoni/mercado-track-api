import { Cache } from 'memory-cache';
import { CronJob } from 'cron';
import { CategoryRouteService } from '../routes/category/category.route.service';

enum CATEGORY {
  KEY = 'CATEGORIES',
  CACHE_TIME = 21600000, // 6 hours, this is never supposed to expire, as the cronjob overrides more often
  CRON_TIME = '0 */4 * * *', // 4 hours
}

class CacheService {

  private categoriesCache = new Cache();
  private categoriesCron = new CronJob(CATEGORY.CRON_TIME, this.getAndCacheCategories);

  public async init () {
    this.initCategories();
  }

  private initCategories () {
    this.categoriesCron.start();
    this.getAndCacheCategories();
  }

  private async getAndCacheCategories () {
    const categories = await CategoryRouteService.getCategoriesAggregated();
    this.categoriesCache.put(CATEGORY.KEY, categories, CATEGORY.CACHE_TIME);
  }

  public get categories () {
    return this.categoriesCache.get(CATEGORY.KEY);
  }

}

export default new CacheService();
