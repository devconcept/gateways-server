const { from } = require('rxjs');
const { tap, mergeMap } = require('rxjs/operators');

const { db } = require('../db');
const validator = require('../../validations/database/gateways');

let gatewaysCollection;

function initializeDb(instance) {
  from(instance.createCollection('gateways', {
    validator,
    validationLevel: 'strict',
    validationAction: 'error',
  })).pipe(
    tap((collection) => { gatewaysCollection = collection; }),
    mergeMap(() => gatewaysCollection.createIndex({ serial: 1 }, { unique: true })),
    mergeMap(() => gatewaysCollection.createIndex({ 'devices.uid': 1 }, { unique: true })),
    tap(() => {
      /* eslint-disable-next-line no-console */
      console.log('Database initialized');
      process.exit();
    }),
  ).subscribe();
}

db().pipe(tap(initializeDb)).subscribe();
