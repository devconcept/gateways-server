const { MongoClient } = require('mongodb');
const { from, of } = require('rxjs');
const { mergeMap } = require('rxjs/operators');

let dbInstance;
const databaseUrl = process.env.MONGO_URL || 'mongodb://localhost:27017';
const databaseName = process.env.MONGO_DATABASE || 'gateways';

module.exports.db = function db() {
  return !dbInstance
    ? from(MongoClient.connect(databaseUrl, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })).pipe(
      mergeMap((client) => {
        dbInstance = client.db(databaseName);
        return of(dbInstance);
      }),
    )
    : of(dbInstance);
};