const hidden = require('./hidden.js')
const winston = require('winston')
require('winston-loggly-bulk')

 winston.add(winston.transports.Loggly, {
    token: hidden.logglyToken,
    subdomain: hidden.subdomain,
    tags: ["Winston-NodeJS"],
    json:true
});

module.exports = {
  log : (message) => winston.log(message),
  info : (message) => winston.info(message),
  error : (message) => winston.error(message),
  warning : (message) => winston.warn(message)
}