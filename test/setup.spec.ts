import mongoose from 'mongoose';
import { TEST_DB_URL } from '../src/shared/config';

if (!TEST_DB_URL) {
  throw new ReferenceError('TEST_DB_URL Needs to be defined');
}

mongoose.connect(TEST_DB_URL, { useNewUrlParser: true });

before(() => mongoose.connection.dropCollection('articles'));

after(() => mongoose.connection.close());
