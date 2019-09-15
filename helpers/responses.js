const { NotFoundError } = require('./classes/not-found-error');
const { normalizeAndPrintError } = require('./errors');
const { logError } = require('./loggers');

function sendError(res, err) {
  logError(typeof err === 'object' ? err.stack : err);
  normalizeAndPrintError(res, err);
}

module.exports.sendOk = function sendOk(res, data) {
  res.status(200).send(data);
};

module.exports.sendCreated = function sendCreated(res, data) {
  res.status(201).send(data);
};

module.exports.sendBadRequest = function sendBadRequest(res, err) {
  res.status(400);
  logError(err);
  normalizeAndPrintError(res, err);
};

module.exports.sendNotFound = function sendNotFound(res, err) {
  res.status(404);
  sendError(res, new NotFoundError(err));
};

module.exports.sendInternalError = function sendInternalError(res, err) {
  res.status(500);
  logError(err);
  normalizeAndPrintError(res, err);
};

module.exports.sendError = sendError;
