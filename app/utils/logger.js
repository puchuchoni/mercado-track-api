const hidden = require('./hidden')
var winston = require('winston')
var { Loggly } = require('winston-loggly-bulk')

var transportsObject = new Loggly({
  inputToken: hidden.logglyToken,
  subdomain: hidden.logglySubdomain,
  tags: ['nodejs'],
  json: true
})

winston.add(transportsObject, null, true)

module.exports = {
  log: (message) => winston.log(message),
  info: (message) => winston.info(message),
  error: (message) => winston.error(message),
  warning: (message) => winston.warn(message)
}
