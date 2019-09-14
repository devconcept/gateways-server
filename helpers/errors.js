const { MongoError } = require('mongodb');

const codes = {
  generic: 'GenericError',
  dataValidation: 'DatabaseValidationError',
};

module.exports.normalizeError = function normalizeError(error) {
  if (error && typeof error === 'object') {
    if (error instanceof MongoError) {
      return { code: codes.dataValidation, error: error.errmsg };
    }
  }
  return {
    code: codes.generic,
    error,
  };
};
