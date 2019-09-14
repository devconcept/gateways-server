const { MongoClient } = require('mongodb');
const { from, of } = require('rxjs');
const { mergeMap, map } = require('rxjs/operators');

let dbInstance;
let clientInstance;
const databaseUrl = process.env.MONGO_URL || 'mongodb://localhost:27017';
const databaseName = process.env.MONGO_DATABASE || 'gateways';

function openConnection() {
  return !clientInstance
    ? from(MongoClient.connect(databaseUrl, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })).pipe(
      mergeMap((client) => {
        clientInstance = client;
        dbInstance = client.db(databaseName);
        return of(clientInstance);
      }),
    )
    : of(clientInstance);
}

module.exports.db = function db() {
  return openConnection().pipe(
    map(() => dbInstance),
  );
};

module.exports.client = function client() {
  return openConnection().pipe(
    map(() => clientInstance),
  );
};
