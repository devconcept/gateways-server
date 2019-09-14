const { from } = require('rxjs');
const { map } = require('rxjs/operators');
const { ObjectID } = require('mongodb');

module.exports.addDevice = function addDevice(db, gatewayId, device) {
  return from(db.collection('gateways').findOneAndUpdate({ _id: ObjectID(gatewayId) }, {
    $push: {
      devices: {
        $each: [device],
        // $slice: -10,
      },
    },
  }, { returnOriginal: false, projection: { devices: 1 } })).pipe(
    map((operation) => operation.value.devices.find((d) => d.uid === device.uid)),
  );
};

module.exports.removeDeviceInGateway = function removeDeviceInGateway(db, gatewayId, deviceId) {
  return from(db.collection('gateways').findOneAndUpdate({ _id: ObjectID(gatewayId) }, {
    $pull: { devices: { uid: deviceId } },
  }));
};
