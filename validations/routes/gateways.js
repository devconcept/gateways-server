const { body, param, query } = require('express-validator');

const pages = [10, 25, 50];

module.exports = {
  getAllGatewaysValidation: [
    query('page')
      .optional({ nullable: false, checkFalsy: false })
      .isInt({ min: 1, allow_leading_zeroes: false }).withMessage('The field page must be integer')
      .if(query('next').exists()).not().exists().withMessage('Only one of page or next must be provided'),
    query('size')
      .optional({ nullable: false, checkFalsy: false })
      .isIn(pages).withMessage(`The field must be one of ${pages.join(',')}`)
      .toInt(10),
    query('next')
      .optional({ nullable: false, checkFalsy: false })
      .isMongoId().withMessage('The field next must be a valid MongoId value')
      .if(query('query').exists()).not().exists().withMessage('Only one of page or next must be provided'),
  ],
  getGatewayValidation: [
    param('gatewayId')
      .exists({ checkFalsy: true, checkNull: true })
      .isMongoId().withMessage('The parameter gatewayId must be a valid MongoId value'),
  ],
  addGatewayValidation: [
    body('name')
      .exists({ checkFalsy: true, checkNull: true }).withMessage('The field name is required')
      .isString().withMessage('The the field name must be a string'),
    body('serial')
      .exists({ checkFalsy: true, checkNull: true }).withMessage('The field serial is required')
      .isString().withMessage('The the field serial must be a string'),
    body('ipv4')
      .exists({ checkFalsy: true, checkNull: true }).withMessage('The field ipv4 is required')
      .isIP(4).withMessage('The field ipv4 must be a valid ipv4 address'),
  ],
};
