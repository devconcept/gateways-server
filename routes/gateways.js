const express = require('express');
const { from } = require('rxjs');
const { tap } = require('rxjs/operators');
const { ObjectID } = require('mongodb');

const { addGateway, getGateway, getAllGateways } = require('../validations/routes/gateways');
const { addDevice } = require('../validations/routes/devices');

const router = express.Router();

/* GET all gateways */
router.get('/', getAllGateways, (req, res) => {
  const { db } = req.app.locals;
  const { page = 1, size = 10 } = req.query;
  const dbQuery = db.collection('gateways').find().skip((page - 1) * size).limit(size);
  from(dbQuery.toArray()).pipe(
    tap((gateways) => res.status(200).send(gateways)),
  ).subscribe({
    error: (err) => res.status(500).send(err),
  });
});

/* GET one gateway */
router.get('/:id', getGateway, (req, res) => {
  const { db } = req.app.locals;
  from(db.collection('gateways').findOne({ _id: ObjectID(req.params.id) }, { projection: { devices: 1 } })).pipe(
    tap((gateway) => {
      if (!gateway) {
        res.status(404).send('Not found');
        return;
      }
      res.status(200).send(gateway);
    }),
  ).subscribe({
    error: (err) => res.status(500).send(err),
  });
});


/* Add one gateway */
router.post('/', addGateway, (req, res) => {
  const { db } = req.app.locals;
  const { name, serial, ipv4 } = req.body;
  from(db.collection('gateways').insertOne({
    serial, name, ipv4, devices: [],
  })).pipe(
    tap((result) => {
      const { ops } = result;
      res.status(201).send(ops[0]);
    }),
  ).subscribe({
    error: (err) => res.status(500).send(err),
  });
});

/* Add a device */
router.post('/:id/devices', addDevice, (req, res) => {
  const { db } = req.app.locals;
  const {
    uid, vendor, created, status,
  } = req.body;
  const { id } = req.params;
  from(db.collection('gateways').findOneAndUpdate({ _id: ObjectID(id) }, {
    $push: {
      devices: {
        $each: [{uid, vendor, created, status,}],
        $slice: -10
      },
    },
  })).pipe(
    tap((result) => {
      console.log(result);
      res.status(201).send('');
    }),
  ).subscribe({
    error: (err) => res.status(500).send(err),
  });
});

/* Remove a device */
router.delete('/:id/devices/:deviceId', (req, res) => {
  const { db } = req.app.locals;
  const { id, deviceId: uid } = req.params;
  from(db.collection('gateways').findOneAndUpdate({ _id: ObjectID(id) }, {
    $pull: { devices: { uid } },
  })).pipe(
    tap(() => res.status(204).send()),
  ).subscribe({
    error: (err) => res.status(500).send(err),
  });
});

module.exports = router;
