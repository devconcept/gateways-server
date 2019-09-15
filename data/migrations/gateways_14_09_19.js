const { from, EMPTY } = require('rxjs');
const { tap, mergeMap } = require('rxjs/operators');
const debug = require('debug')('gateways:log');

const { db } = require('../db');
const validator = require('../../validations/database/gateways');

function initializeDb(instance) {
  let gatewaysCollection;
  return from(instance.createCollection('gateways', {
    validator,
    validationLevel: 'strict',
    validationAction: 'error',
  })).pipe(
    tap((collection) => { gatewaysCollection = collection; }),
    mergeMap(() => gatewaysCollection.createIndex({ serial: 1 }, { unique: true })),
    mergeMap(() => gatewaysCollection.createIndex({ 'devices.uid': 1 }, { unique: true })),
    tap(() => { debug('Database initialized'); }),
  );
}

db().pipe(
  mergeMap(initializeDb),
  mergeMap(() => {
    setTimeout(() => process.exit());
    return EMPTY;
  }),
).subscribe();

module.exports.initializeDb = initializeDb;
