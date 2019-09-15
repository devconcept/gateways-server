const { NotFoundError } = require('./classes/not-found-error');
const { normalizeAndPrintError } = require('./errors');

module.exports.sendOk = function sendOk(res, data) {
  res.status(200).send(data);
};

module.exports.sendCreated = function sendCreated(res, data) {
  res.status(201).send(data);
};

module.exports.sendBadRequest = function sendBadRequest(res, err) {
  res.status(400);
  normalizeAndPrintError(res, err);
};

module.exports.sendNotFound = function sendNotFound(res, err) {
  normalizeAndPrintError(res, new NotFoundError(err));
};

module.exports.sendInternalError = function sendInternalError(res, err) {
  res.status(500);
  normalizeAndPrintError(res, err);
};
