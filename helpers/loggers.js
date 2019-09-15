const winston = require('winston');
const Transport = require('winston-transport');
const debugLog = require('debug')('gateways:log');
const debugError = require('debug')('gateways:error');
const { isProduction } = require('./environments');
require('winston-daily-rotate-file');

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

let transports;
if (isProduction()) {
  transports = [
    new DebugTransport(),
    new winston.transports.DailyRotateFile({
      dirname: 'logs',
      frequency: '1d',
      filename: 'gateways %DATE%.log',
      zippedArchive: true,
      datePattern: 'YYYY-MM-DD',
      maxSize: '50m',
      maxFiles: '15d',
    }),
    // Add your remote logger here
  ];
} else {
  transports = [
    new DebugTransport(),
  ];
}
const logger = winston.createLogger({ transports, defaultMeta: { service: 'gateways-service' } });

/* eslint-disable-next-line no-console */
debugLog.log = console.log.bind(console);

module.exports.logMessage = function logMessage(data) {
  logger.log('info', data);
};

module.exports.logError = function logError(data) {
  logger.log('error', data);
};
