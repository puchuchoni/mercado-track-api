import { logger } from '../../shared';
import { SlackService } from '../../services';

export class Progress {
  public stopped: boolean;
  public running: boolean;
  private processed: number = 0;
  private total: number;
  private startDate: Date;
  private jobName: string;
  private errors: {}[];

  constructor(totalArticles: number) {
    logger.info('Sync started');
    this.jobName = 'Sync';
    this.total = totalArticles;
    this.startDate = new Date();
    this.errors = [];
    this.stopped = false;
    this.running = true;
  }

  public step(length: number = 1) {
    this.processed += length;
  }

  public logError(error) {
    if (error.message) {
      this.errors.push(error.message);
    } else if (error.response) {
      const { status, statusText, data } = error.response;
      logger.info(status, statusText);
      this.errors.push(data);
    }
  }

  public finish() {
    this.running = false;
    const data = this.data;
    logger.info('Sync finished');
    logger.info(data);
    SlackService.jobProgressNotification(data);
  }

  public get data (): IProgressData {
    if (!this.running) return { status: 'Not running' };
    const timeRunning = this.formatTimeRunning;
    const percentage = Math.floor(this.processed * 100 / this.total);
    const etc = this.minutesETC;
    return {
      timeRunning,
      jobName: this.jobName,
      status: this.running ? 'running' : 'finished',
      etc: `${etc} minutes`,
      progress: `${percentage}% - ${this.processed}/${this.total} [${this.errors.length}] | ${timeRunning}/~${etc}min`,
      articlesProcessed: this.processed,
      errorsCount: this.errors.length,
      errors: this.errors,
    };
  }

  public stop () {
    this.stopped = true;
    return new Promise((resolve) => {
      const interval = setInterval(() => {
        if (!this.running) {
          this.stopped = false;
          clearInterval(interval);
          resolve();
        }
      }, 50);
    });
  }

  private get minutesETC() {
    const msRunning = new Date().getTime() - this.startDate.getTime();
    const ms = Math.ceil(this.total * msRunning / this.processed);
    return Math.ceil(ms / 1000 / 60);
  }

  private get formatTimeRunning() {
    const ms = new Date().getTime() - this.startDate.getTime();
    return Number(ms / 1000 / 60).toFixed(2);
  }

}
