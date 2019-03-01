import mongoose from 'mongoose';

// tslint:disable-next-line
const url = process.env.CI ? process.env.MONGO_TEST_URL : require('../src/hidden').testUrl;

mongoose.connect(url, { useNewUrlParser: true });

before(() => mongoose.connection.dropCollection('articles'));

after(() => mongoose.connection.close());
