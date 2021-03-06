const { from, throwError, of } = require('rxjs');
const { mergeMap } = require('rxjs/operators');
const { ObjectID } = require('mongodb');
const { NotFoundError } = require('../helpers/classes/not-found-error');

module.exports.addDevice = function addDevice(db, gatewayId, device) {
  return from(db.collection('gateways').updateOne({ _id: ObjectID(gatewayId), 'devices.uid': { $ne: device.uid } }, { $push: { devices: device } })).pipe(
    mergeMap((result) => {
      if (result.modifiedCount) {
        return of(device);
      }
      return throwError(new Error('Invalid gateway update'));
    }),
  );
};

module.exports.removeDeviceInGateway = function removeDeviceInGateway(db, gatewayId, deviceId) {
  return from(db.collection('gateways').updateOne({ _id: ObjectID(gatewayId) }, {
    $pull: { devices: { uid: deviceId } },
  })).pipe(
    mergeMap((result) => {
      if (result.modifiedCount) {
        return of(deviceId);
      }
      return throwError(new NotFoundError('Not found'));
    }),
  );
};
