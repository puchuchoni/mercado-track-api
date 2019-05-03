import { logger } from '../../shared';
import { SlackService } from '../../services';
import { JobStatus } from '../jobs.constants';

export class Progress {
  private mainCategoriesProcessed: number = 1;
  private childCategoriesProcessed: number = 0;
  private articlesProcessed: number = 0;
  private childStepSize: number;
  private totalMainCategories: number;
  private startDate: Date;
  private status: string;
  private jobName: string;
  private errors: {}[];

  constructor(mainTotal, secondaryTotal = 1) {
    logger.info('Collector started');
    this.jobName = 'Collector';
    this.totalMainCategories = mainTotal;
    this.childStepSize = Math.round(100 / secondaryTotal);
    this.startDate = new Date();
    this.status = JobStatus.Running;
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
    this.status = JobStatus.Finished;
    const data = this.data;
    logger.info('Collector finished');
    logger.info(data);
    SlackService.jobProgressNotification(data);
  }

  public get data (): IProgressData {
    const main = `${this.mainCategoriesProcessed}/${this.totalMainCategories}`;
    const child = `${this.childCategoriesProcessed}%`;
    const articles = `Articles: ${this.articlesProcessed}`;
    const errors = `Errors ${this.errors.length}`;
    const timeRunning = this.formatTimeRunning;
    return {
      timeRunning,
      jobName: this.jobName,
      status: this.status,
      progress: `${main} - ${child} - ${articles}, ${errors}`,
      articlesProcessed: this.articlesProcessed,
      errorsCount: this.errors.length,
      errors: this.errors,
    };
  }

  private get formatTimeRunning() {
    const ms = new Date().getTime() - this.startDate.getTime();
    return Number(ms / 1000 / 60).toFixed(2);
  }

}
