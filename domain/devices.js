const { from, throwError, of } = require('rxjs');
const { mergeMap } = require('rxjs/operators');
const { ObjectID } = require('mongodb');

module.exports.addDevice = function addDevice(db, gatewayId, device) {
  const collection = db.collection('gateways');
  return from(collection.findOne({ _id: ObjectID(gatewayId) })).pipe(
    mergeMap((gateway) => {
      if (!gateway) {
        return throwError('Not found');
      }
      if (gateway.devices.find((d) => d.uid === device.uid)) {
        return throwError('Already exists');
      }
      return collection.updateOne({ _id: ObjectID(gatewayId), 'devices.uid': { $ne: device.uid } }, { $push: { devices: device } });
    }),
    mergeMap((result) => {
      if (result.modifiedCount) {
        return of(device);
      }
      return throwError('Already exists');
    }),
  );
};

module.exports.removeDeviceInGateway = function removeDeviceInGateway(db, gatewayId, deviceId) {
  return from(db.collection('gateways').updateOne({ _id: ObjectID(gatewayId) }, {
    $pull: { devices: { uid: deviceId } },
  })).pipe(
    mergeMap((result) => {
      if (!result.matchedCount) {
        return throwError('Not found');
      }
      if (!result.modifiedCount) {
        return throwError('Not found');
      }
      return of(deviceId);
    }),
  );
};
