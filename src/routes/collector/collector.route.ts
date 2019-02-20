import express, { Response, Request } from 'express';
import { Collector } from '../../jobs/collector';

export const collectorRouter = express.Router();
let running = false;

collectorRouter.route('/')
  .get(getProgress)
  .post(fetchAllArticles);

function getProgress(_req: Request, res: Response) {
  if (running) res.send({ progress: Collector.progress });
  else res.send({ message: 'Collector is not running' });
}

async function fetchAllArticles(_req: Request, res: Response) {
  if (running) {
    return res.status(403).send({ message: 'Collector already running', progress: Collector.progress });
  }
  res.status(202).send({ message: 'Collector triggered successfully' });
  running = true;
  await Collector.run();
  running = false;
}
