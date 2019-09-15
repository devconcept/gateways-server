const { from, of } = require('rxjs');
const { mergeMap, tap } = require('rxjs/operators');

const { db } = require('../db');
const validator = require('../../validations/database/gateways');

module.exports.up = function up(next) {
  let gatewaysCollection;
  db().pipe(
    mergeMap((instance) => from(instance.createCollection('gateways', {
      validator,
      validationLevel: 'strict',
      validationAction: 'error',
    }))),
    tap((collection) => { gatewaysCollection = collection; }),
    mergeMap(() => gatewaysCollection.createIndex({ serial: 1 }, { unique: true })),
    mergeMap(() => gatewaysCollection.createIndex({ 'devices.uid': 1 }, { unique: true })),
    tap(() => next()),
  ).subscribe({ error: next });
};

module.exports.down = function down(next) {
  db().pipe(
    mergeMap((instance) => from(instance.dropCollection('gateways'))),
    mergeMap(() => {
      next();
      return of();
    }),
  ).subscribe({ error: next });
};
