const { MongoClient } = require('mongodb');
const { from, of, Subject } = require('rxjs');
const { mergeMap, map, finalize } = require('rxjs/operators');

let dbInstance;
let clientInstance;
let resolving = false;
const connectionManager = new Subject();
const databaseUrl = process.env.MONGO_URL || 'mongodb://localhost:27017';
const databaseName = process.env.MONGO_DATABASE || 'gateways';

function openConnection() {
  if (!clientInstance) {
    if (resolving) {
      return connectionManager.asObservable();
    }
    resolving = true;
    return from(MongoClient.connect(databaseUrl, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })).pipe(
      mergeMap((client) => {
        clientInstance = client;
        dbInstance = client.db(databaseName);
        connectionManager.next(clientInstance);
        connectionManager.complete();
        return of(clientInstance);
      }),
      finalize(() => { resolving = false; }),
    );
  }
  return of(clientInstance);
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

module.exports.isResolving = function isResolving() {
  return resolving;
};

module.exports.waitForConnection = function waitForConnection() {
  return connectionManager.asObservable();
};
