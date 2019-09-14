const express = require('express');
const { tap } = require('rxjs/operators');

const { addGatewayValidation, getGatewayValidation, getAllGatewaysValidation } = require('../validations/routes/gateways');
const { addDeviceValidation } = require('../validations/routes/devices');

const { getAllGateways, getOneGateway, addGateway } = require('../domain/gateways');
const { addDevice, removeDeviceInGateway } = require('../domain/devices');

const {
  sendInternalError, sendOk, sendNotFound, sendCreated,
} = require('../helpers/responses');

const router = express.Router();

/* GET all gateways */
router.get('/', getAllGatewaysValidation, (req, res) => {
  const { db } = req.app.locals;
  const { next, size = 10 } = req.query;
  let { page } = req.query;
  const keyset = Object.prototype.hasOwnProperty.call(req.query, 'next');
  if (!keyset && !page) {
    page = 1;
  }

  getAllGateways(db, keyset ? next : (page - 1) * size, size, keyset).pipe(
    tap((gateways) => sendOk(res, gateways)),
  ).subscribe({ error: (err) => sendInternalError(res, err) });
});

/* GET one gateway */
router.get('/:gatewayId', getGatewayValidation, (req, res) => {
  const { db } = req.app.locals;
  const { gatewayId } = req.params;

  getOneGateway(db, gatewayId).pipe(
    tap((gateway) => {
      if (!gateway) {
        sendNotFound(res, 'Gateway not found');
        return;
      }
      sendOk(res, gateway);
    }),
  ).subscribe({ error: (err) => sendInternalError(err) });
});


/* Add one gateway */
router.post('/', addGatewayValidation, (req, res) => {
  const { db } = req.app.locals;
  const { name, serial, ipv4 } = req.body;
  const newGateway = {
    serial, name, ipv4, devices: [],
  };

  addGateway(db, newGateway).pipe(
    tap((gateway) => sendCreated(res, gateway)),
  ).subscribe({ error: (err) => sendInternalError(res, err) });
});

/* Add a device */
router.post('/:gatewayId/devices', addDeviceValidation, (req, res) => {
  const { db } = req.app.locals;
  const {
    uid, vendor, created, status,
  } = req.body;
  const { gatewayId } = req.params;
  const newDevice = {
    uid, vendor, created, status,
  };

  addDevice(db, gatewayId, newDevice).pipe(
    tap((device) => sendCreated(res, device)),
  ).subscribe({ error: (err) => sendInternalError(res, err) });
});

/* Remove a device */
router.delete('/:gatewayId/devices/:deviceId', (req, res) => {
  const { db } = req.app.locals;
  const { gatewayId, deviceId } = req.params;

  removeDeviceInGateway(db, gatewayId, deviceId).pipe(
    tap(() => res.status(204).send()),
  ).subscribe({ error: (err) => sendInternalError(res, err) });
});

module.exports = router;
