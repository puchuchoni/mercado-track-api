import * as dotenv from 'dotenv';

dotenv.config();
if (!process.env.CI) {
  let path: string;
  switch (process.env.NODE_ENV) {
    case 'production':
      path = `${__dirname}/../../.env.prod`;
      break;
    default:
      path = `${__dirname}/../../.env.dev`;
  }
  dotenv.config({ path });
}

export const NODE_ENV = process.env.NODE_ENV;
export const PORT = process.env.PORT;
export const LOGGLY_TOKEN = process.env.LOGGLY_TOKEN;
export const LOGGLY_SUBDOMAIN = process.env.LOGGLY_SUBDOMAIN;
export const ML_CLIENT_ID = process.env.ML_CLIENT_ID;
export const ML_CLIENT_SECRET = process.env.ML_CLIENT_SECRET;
export const DB_URL = process.env.DB_URL;
export const TEST_DB_URL = process.env.TEST_DB_URL;
