import winston from 'winston';
import { Loggly } from 'winston-loggly-bulk';
import { LOGGLY_TOKEN, LOGGLY_SUBDOMAIN, NODE_ENV } from '../shared/config';

const transportsObject = new Loggly({
  inputToken: LOGGLY_TOKEN,
  subdomain: LOGGLY_SUBDOMAIN,
  tags: ['nodejs'],
  json: true,
});

winston.add(transportsObject, null, true);

export const logger = NODE_ENV === 'development' ? console : winston;

export default {
  log: message => logger.log(message),
  info: message => logger.info(message),
  error: message => logger.error(message),
  warning: message => logger.warn(message),
};
