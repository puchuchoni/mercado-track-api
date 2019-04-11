import mongoose from 'mongoose';
import { TEST_DB_URL } from '../src/shared/config';

if (!TEST_DB_URL) {
  throw new ReferenceError('TEST_DB_URL Needs to be defined');
}

before(async () => {
  await mongoose.connect(TEST_DB_URL, { useNewUrlParser: true });
});

after(async () => {
  const collections = await mongoose.connection.db.listCollections().toArray();
  for (const { name } of collections) {
    await mongoose.connection.dropCollection(name);
  }
  await mongoose.connection.close();
});