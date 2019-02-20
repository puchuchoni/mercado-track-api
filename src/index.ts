import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import cors from 'cors';
import hidden from '../hidden';
import * as routes from './routes';
import { Sync } from './jobs/sync';
import logger from './shared/logger';

const app = express();

mongoose.set('useCreateIndex', true);
mongoose.connect(hidden.atlasUrl, { useNewUrlParser: true });

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

app.use('/articles', routes.articleRouter);
app.use('/collector', routes.collectorRouter);
app.use('/sync', routes.syncRouter);

app.listen(hidden.port);
logger.info(`Mercado Track API running on port: ${hidden.port}`);

Sync.run();
