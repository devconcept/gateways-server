const { body, param } = require('express-validator');

module.exports = {
  addDeviceValidation: [
    param('gatewayId')
      .isMongoId().withMessage('The parameter must be a valid MongoId value'),
    body('uid')
      .exists({ checkFalsy: true, checkNull: true }).withMessage('The field uid is required')
      .isInt({ allow_leading_zeroes: false, min: 1 })
      .withMessage('The field uid must be a number')
      .toInt(10),
    body('vendor')
      .exists({ checkFalsy: true, checkNull: true }).withMessage('The field vendor is required')
      .isString()
      .withMessage('The field vendor must be a string'),
    body('created')
      .exists({ checkFalsy: true, checkNull: true }).withMessage('The field created is required')
      .isISO8601()
      .withMessage('The field created must be a valid ISO8601 date')
      .toDate(),
    body('status')
      .exists({ checkFalsy: true, checkNull: true }).withMessage('The field status is required')
      .isBoolean()
      .withMessage('The field status must be a boolean value')
      .toBoolean(true),
  ],
  removeDeviceValidation: [
    param('gatewayId')
      .exists({ checkFalsy: true, checkNull: true })
      .isMongoId().withMessage('The parameter gatewayId must be a valid MongoId value'),
    param('deviceId')
      .exists({ checkFalsy: true, checkNull: true })
      .isInt({ min: 1, allow_leading_zeroes: 0 }).withMessage('The parameter deviceId must be an integer greater than zero')
      .toInt(10),
  ],
};
