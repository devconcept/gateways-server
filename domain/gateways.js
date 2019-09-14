const { from } = require('rxjs');
const { map } = require('rxjs/operators');
const { ObjectID } = require('mongodb');

module.exports.getAllGateways = function getAllGateways(db, start, limit, keyset) {
  let dbQuery;
  if (keyset) {
    dbQuery = db.collection('gateways')
      .find(start ? { serial: { $gt: start } } : {})
      .sort({ serial: 1 })
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
  return from(db.collection('gateways').insertOne(gateway)).pipe(
    map((operationResult) => operationResult.ops[0]),
  );
};
