const { MongoError } = require('mongodb');
const { validationResult } = require('express-validator');
const { NormalizedError } = require('./classes/normalized-error');
const { ValidationError } = require('./classes/validation-error');

const development = !process.env.NODE_ENV || process.env.NODE_ENV === 'development';

const codes = {
  generic: 'GenericError',
  dataValidation: 'DatabaseValidationError',
  routeValidation: 'RouteValidationError',
};

function normalizeError(error) {
  if (error && typeof error === 'object') {
    if (error instanceof NormalizedError) {
      return error;
    }
    if (error instanceof MongoError && error.code === 121) {
      return new NormalizedError(error.errmsg, codes.dataValidation, error, { status: 400 });
    }

    if (error instanceof ValidationError) {
      return new NormalizedError(error.message, codes.routeValidation, error, {
        status: 400,
        extra: error.extra,
      });
    }
  }
  return new NormalizedError(error.message, error.code || codes.generic, error, {
    status: error.status,
    extra: error.extra,
  });
}

module.exports.normalizeError = normalizeError;

module.exports.normalizeAndPrintError = function normalizeAndPrintError(res, error) {
  const finalError = normalizeError(error);
  const {
    message, code, extra, stack, status,
  } = finalError;
  if (status) {
    res.status(status);
  }
  if (development) {
    res.send({
      message, code, extra, stack,
    });
  } else {
    res.send({ message, code });
  }
};

module.exports.validateRequest = function validateRequest(validationRules) {
  const performValidation = function performValidation(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      next(new ValidationError('Error validating request', errors.array()));
    } else {
      next();
    }
  };

  return [
    ...validationRules,
    performValidation,
  ];
};

module.exports.ValidationError = ValidationError;
