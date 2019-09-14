const { body, param, query } = require('express-validator');

module.exports = {
  getAllGateways: [
    query('page').isInt({ min: 1, allow_leading_zeroes: false }),
    query('size').isIn([10, 25, 50]),
  ],
  getGateway: [
    param('id').exists({ checkFalsy: true }),
  ],
  addGateway: [
    body('name').exists({ checkFalsy: true }),
    body('serial').exists({ checkFalsy: true }),
    body('ipv4').isIP(4),
  ],
};
