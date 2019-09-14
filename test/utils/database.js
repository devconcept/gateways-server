const { from } = require('rxjs');
const { mergeMap, map, tap } = require('rxjs/operators');
const { db, client } = require('../../data/db');
const { initializeDb } = require('../../data/migrations/gateways_14_09_19');

module.exports.initializeDatabase = function initializeDatabase(app) {
  let dbInstance;
  if (app.locals.db) {
    dbInstance = app.locals.db;
    return db.deleteMany({});
  }
  return db().pipe(
    tap((instance) => {
      dbInstance = instance;
    }),
    // mergeMap(() => from(dbInstance.dropCollection('gateways'))),
    mergeMap(() => from(dbInstance.createCollection('gateways'))),
    mergeMap(() => initializeDb(app)),
  ).toPromise();
};

module.exports.cleanDatabase = function cleanDatabase() {
  return db().pipe(
    mergeMap((instance) => from(instance.dropDatabase())),
    map(() => client()),
    mergeMap((instance) => instance.close()),
  ).toPromise();
};
