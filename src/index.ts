import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import cors from 'cors';
import { DB_URL, PORT } from './shared/config';
import * as routes from './routes';
import { Sync } from './jobs/sync';
import logger from './shared/logger';

if (!DB_URL) {
  throw new ReferenceError('DB_URL Needs to be defined');
}

mongoose.set('useCreateIndex', true);
mongoose.connect(DB_URL, { useNewUrlParser: true });

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

app.use('/articles', routes.articleRouter);
app.use('/collector', routes.collectorRouter);
app.use('/sync', routes.syncRouter);

app.listen(PORT);
logger.info(`Mercado Track API running on port: ${PORT}`);

Sync.run();
