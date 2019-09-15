# Gateway Manager

[![Build Status][travis-image]][travis-url] [![Coverage Status][coveralls-image]][coveralls-url]

Rest API service to manage gateways

See [Solution.md](Solution.md) file for an explanation of the solution to the exercise.

## Technologies and tools used

- Node.js - Server engine (requirement)
- Mongodb - database (requirement)
- Travis - automated build (requirement)
- Express.js - Http framework
- Winston - Logger
- Helmet - Security
- PM2 - Load balancer
- Rx.js - utility

## Setting up the database

To add indexes and validation to the database you must:
 
- Specify the database connection string in the `MONGO_URL` environment variable and the target database in the `MONGO_DATABASE` variable
- Or add two values inside the `database.url` and `database.name` in the `config/development` (or production) file

Environment variables take precedence over configuration files. Finally run the command:

```bash
$ npm run migration
``` 

## Running the sample

To start the API service in a development environment execute `npm start` or 

```bash
$ npm run run-dev
``` 

In production mode execute

```bash
$ npm run run-prod
``` 

The default local port serving the app is `3500`

## Linting

To achieve an uniform code style the  airbnb code style was selected using eslint to enforce code style rules

## Test

To run all tests first clone the repository, install the dependencies with `npm install` and then execute `npm test`:

```bash
$ npm install
$ npm test
```

Tests are written with [mocha](https://mochajs.org/) and [chai](http://chaijs.com/).

[travis-url]: https://travis-ci.org/devconcept/gateways-server
[travis-image]: https://travis-ci.org/devconcept/gateways-server.svg?branch=master "Build status"
[coveralls-url]: https://coveralls.io/github/devconcept/gateways-server?branch=master
[coveralls-image]: https://coveralls.io/repos/github/devconcept/gateways-server/badge.svg?branch=master "Coverage report"
