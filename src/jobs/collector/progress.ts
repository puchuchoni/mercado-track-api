import { logger } from '../../shared';

export class Progress {
  private mainCategoriesProcessed: number = 1;
  private childCategoriesProcessed: number = 0;
  private articlesProcessed: number = 0;
  private childStepSize: number;
  private totalMainCategories: number;
  private startDate: Date;
  private errors: {}[];

  constructor(mainTotal, secondaryTotal = 1) {
    logger.info('Collector started');
    this.totalMainCategories = mainTotal;
    this.childStepSize = Math.round(100 / secondaryTotal);
    this.startDate = new Date();
    this.errors = [];
  }

  public setChildrenCategorySize (length: number) {
    this.childStepSize = Math.round(100 / length);
    this.childCategoriesProcessed = 0;
  }

  public mainCategoryStep() {
    this.mainCategoriesProcessed++;
  }

  public childrenCategoryStep() {
    this.childCategoriesProcessed += this.childStepSize;
  }

  public pageStep(pageArticlesProcessed: number) {
    this.articlesProcessed += pageArticlesProcessed;
  }

  public logError(error) {
    if (error.code === 11000) return; // ignoring duplicates BulkWriteError
    if (error.message) {
      this.errors.push(error.message);
    } else if (error.response) {
      const { status, statusText, data } = error.response;
      logger.info(status, statusText);
      this.errors.push(data);
    }
  }

  public finish() {
    logger.info('Collector finished');
    logger.info(this.data);
  }

  public get data () {
    const main = `${this.mainCategoriesProcessed}/${this.totalMainCategories}`;
    const child = `${this.childCategoriesProcessed}%`;
    const articles = `Articles: ${this.articlesProcessed}`;
    const errors = `Errors ${this.errors.length}`;
    return {
      progress: `${main} - ${child} - ${articles}, ${errors}`,
      articlesProcessed: this.articlesProcessed,
      timeRunning: new Date().getTime() - this.startDate.getTime(),
      errorsCount: this.errors.length,
      errors: this.errors,
    };
  }

}
