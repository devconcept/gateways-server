const { mergeMap } = require('rxjs/operators');
const { initializeDb } = require('../../data/migrations/gateways_14_09_19');
const { db } = require('../../data/db');

db().pipe(mergeMap(initializeDb)).subscribe();
