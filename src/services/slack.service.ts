import { IncomingWebhook } from '@slack/webhook';
import { SLACK_WEBHOOK_URL } from '../shared/config';

export class SlackService {

  public static async jobProgressNotification(data: IProgressData) {
    if (!SLACK_WEBHOOK_URL) {
      return;
    }

    const webhook = new IncomingWebhook(SLACK_WEBHOOK_URL);

    const message = `${data.jobName} ${data.status} on ${data.timeRunning} minutes,
      ${data.articlesProcessed} articles were processed,
      ${data.errorsCount} errors were found`;

    await webhook.send({ text: message });
  }
}
