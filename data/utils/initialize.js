const { from } = require('rxjs');
const { tap, mergeMap } = require('rxjs/operators');

const { db } = require('../index');

function initializeDb(instance) {
  from(instance.createCollection('gateways', {
    validator: {
      $jsonSchema: {
        bsonType: 'object',
        required: ['name', 'ipv4'],
        properties: {
          name: {
            bsonType: 'string',
            description: 'must be a string and is required',
          },
          ipv4: {
            bsonType: 'string',
            description: 'must be a string and is required',
          },
        },
      },
    },
  })).pipe(
    mergeMap((collection) => collection.createIndex({ id: 1 }, { unique: true })),
    tap(() => {
      /* eslint-disable-next-line no-console */
      console.log('Database initialized');
      process.exit();
    }),
  ).subscribe();
}

db().pipe(tap(initializeDb)).subscribe();
