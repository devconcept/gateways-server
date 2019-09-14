const winston = require('winston');
const Transport = require('winston-transport');
const debugLog = require('debug')('gateways:log');
const debugError = require('debug')('gateways:error');

class DebugTransport extends Transport {
  log(info, callback) {
    setImmediate(() => {
      this.emit('logged', info);
    });

    if (info.level === 'error') {
      debugError(info.message);
    } else {
      debugLog(info.message);
    }
    callback();
  }
}

const logger = winston.createLogger({
  transports: [
    // TODO: Add production transport
    new DebugTransport(),
  ],
});

/* eslint-disable-next-line no-console */
debugLog.log = console.log.bind(console);

module.exports.logMessage = function logMessage(data) {
  logger.log('info', data);
};

module.exports.logError = function logError(data) {
  logger.log('error', data);
};
