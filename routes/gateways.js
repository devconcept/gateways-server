const express = require('express');
const { from } = require('rxjs');
const { tap, mergeMap } = require('rxjs/operators');
const { ObjectID } = require('mongodb');

const router = express.Router();

/* GET All gateways */
router.get('/', (req, res) => {
  const { db } = req.app.locals;
  // TODO: Paginate results
  from(db.collection('gateways').find({}).toArray()).pipe(
    tap((gateways) => {
      res.status(200).send(gateways);
    }),
  ).subscribe({
    error: (err) => {
      res.status(500).send(err);
    },
  });
});

router.post('/', (req, res) => {
  const { db } = req.app.locals;
  // TODO: Add user input validation
  const { name, ipv4 } = req.body;
  // TODO: Add pagination
  const _id = new ObjectID();
  const gateways = db.collection('gateways');
  from(gateways.insertOne({ _id, name, ipv4 })).pipe(
    tap(result => {
      console.log(result);
      const {ops} = result;
      res.status(201).send(ops[0]);
    }),
  ).subscribe({
    error: (err) => {
      res.status(500).send(err);
    },
  });
});

module.exports = router;
