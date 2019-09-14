const { from } = require('rxjs');
const { tap, mergeMap } = require('rxjs/operators');

const { db } = require('../db');
const validator = require('../../validations/database/gateways');

function initializeDb(instance) {
  from(instance.createCollection('gateways', {
    validator,
    validationLevel: 'strict',
    validationAction: 'error',
  })).pipe(
    mergeMap((collection) => collection.createIndex({ serial: 1 }, { unique: true })),
    tap(() => {
      /* eslint-disable-next-line no-console */
      console.log('Database initialized');
      process.exit();
    }),
  ).subscribe();
}

db().pipe(tap(initializeDb)).subscribe();
