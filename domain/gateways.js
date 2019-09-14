const { from } = require('rxjs');
const { ObjectID } = require('mongodb');

module.exports.getAllGateways = function getAllGateways(db, start, limit, keyset) {
  let dbQuery = db.collection('gateways').find().sort({ serial: 1 }).limit(limit);
  if (keyset) {
    dbQuery = db.collection('gateways')
      .find({ serial: { $gt: start } })
      .sort({ serial: 1 })
      .skip(start)
      .limit(limit);
  } else {
    dbQuery = db.collection('gateways')
      .find()
      .sort({ serial: 1 })
      .skip(start)
      .limit(limit);
  }
  return from(dbQuery.toArray());
};

module.exports.getOneGateway = function getOneGateway(db, gatewayId) {
  return from(db.collection('gateways').findOne({ _id: ObjectID(gatewayId) }));
};

module.exports.addGateway = function addGateway(db, gateway) {
  return from(db.collection('gateways').insertOne(gateway));
};
