import winston from 'winston';
import { Loggly } from 'winston-loggly-bulk';
import hidden from '../../hidden';

const transportsObject = new Loggly({
  inputToken: hidden.logglyToken,
  subdomain: hidden.logglySubdomain,
  tags: ['nodejs'],
  json: true,
});

winston.add(transportsObject, null, true);

export const logger = process.env.NODE_ENV === 'development' ? console : winston;

export default {
  log: message => logger.log(message),
  info: message => logger.info(message),
  error: message => logger.error(message),
  warning: message => logger.warn(message),
};
