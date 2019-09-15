const { from } = require('rxjs');
const { mergeMap, tap } = require('rxjs/operators');
const { db, client } = require('../../data/db');

module.exports.initializeDatabase = function initializeDatabase(app) {
  let dbInstance;
  return db().pipe(
    tap((instance) => {
      /* eslint-disable-next-line no-param-reassign */
      app.locals.db = instance;
      dbInstance = instance;
    }),
    mergeMap(() => from(dbInstance.collection('gateways').deleteMany({}))),
  ).toPromise();
};

module.exports.cleanDatabase = function cleanDatabase() {
  return db().pipe(
    mergeMap((instance) => from(instance.dropDatabase())),
    mergeMap(() => client()),
    mergeMap((instance) => instance.close()),
  ).toPromise();
};
