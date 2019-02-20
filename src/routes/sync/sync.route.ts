import express, { Response, Request } from 'express';
import { Sync } from '../../jobs/sync';

export const syncRouter = express.Router();

syncRouter.route('/')
  .get(getProgress);

function getProgress(req: Request, res: Response) {
  res.send({ progress: Sync.progress });
}
