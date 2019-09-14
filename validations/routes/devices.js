const { body } = require('express-validator');

module.exports = {
  addDevice: [
    body('uid').exists({ checkFalsy: true }).isNumeric({ no_symbols: true }),
    body('vendor').exists({ checkFalsy: true }).isString(),
    body('created').exists({ checkFalsy: true }).isISO8601().toDate(),
    body('status').exists({ checkFalsy: true }).isBoolean().toBoolean(true),
  ],
};
