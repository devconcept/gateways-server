const { from } = require('rxjs');
const { ObjectID } = require('mongodb');

module.exports.addDevice = function addDevice(db, gatewayId, device) {
  return from(db.collection('gateways').findOneAndUpdate({ _id: ObjectID(gatewayId) }, {
    $push: {
      devices: {
        $each: [device],
        // $slice: -10,
      },
    },
  }));
};

module.exports.removeDeviceInGateway = function removeDeviceInGateway(db, gatewayId, deviceId) {
  return from(db.collection('gateways').findOneAndUpdate({ _id: ObjectID(gatewayId) }, {
    $pull: { devices: { uid: deviceId } },
  }));
};
