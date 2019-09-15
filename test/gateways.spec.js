const chai = require('chai');
const request = require('supertest');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');
const { prepareDatabase, cleanDatabase } = require('./utils/database');
const { generateGateways, changeId } = require('./utils/data');
const app = require('../app');

chai.use(sinonChai);
const { expect } = chai;

describe('Gateways', function () {
  beforeEach(() => prepareDatabase(app));

  describe('All gateways', function () {
    it('Should return gateway objects', function () {
      const { db } = app.locals;
      return db.collection('gateways').insertOne(generateGateways(1)).then(() => new Promise((resolve) => {
        request(app).get('/gateways').end((err, res) => {
          expect(err).to.equal(null);
          expect(res.status).to.equal(200);
          expect(res.body).to.be.an('array');
          expect(res.body).to.have.length(1);
          expect(res.body[0]).to.have.property('name');
          expect(res.body[0]).to.have.property('serial');
          expect(res.body[0]).to.have.property('ipv4');
          expect(res.body[0]).to.have.property('devices');
          resolve();
        });
      }));
    });

    it('Should work without parameters', function (done) {
      request(app).get('/gateways').end((err, res) => {
        expect(err).to.equal(null);
        expect(res.status).to.equal(200);
        expect(res.body).to.be.an('array');
        expect(res.body).to.have.length(0);
        done();
      });
    });

    it('Should work with only a page parameter', function (done) {
      request(app).get('/gateways?page=1').end((err, res) => {
        expect(err).to.equal(null);
        expect(res.status).to.equal(200);
        expect(res.body).to.be.an('array');
        expect(res.body).to.have.length(0);
        done();
      });
    });

    it('Should not work with only a next parameter', function (done) {
      request(app).get('/gateways?next=5d7e117eba4f9659a0aa5290').end((err, res) => {
        expect(err).to.equal(null);
        expect(res.status).to.equal(200);
        expect(res.body).to.be.an('array');
        expect(res.body).to.have.length(0);
        done();
      });
    });

    it('Should not work with both page and next parameters', function (done) {
      request(app).get('/gateways?page=1&next=1').end((err, res) => {
        expect(err).to.equal(null);
        expect(res.status).to.equal(400);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('code', 'RouteValidationError');
        expect(res.body).to.have.property('message', 'Error validating request');
        done();
      });
    });

    it('Should limit returned objects by default', function () {
      const { db } = app.locals;
      return db.collection('gateways').insertMany(generateGateways(15)).then(() => new Promise((resolve) => {
        request(app).get('/gateways').end((err, res) => {
          expect(err).to.equal(null);
          expect(res.status).to.equal(200);
          expect(res.body).to.be.an('array');
          expect(res.body).to.have.length(10);
          resolve();
        });
      }));
    });

    it('Should allow for a variable number of returned records', function () {
      const { db } = app.locals;
      return db.collection('gateways').insertMany(generateGateways(30)).then(() => new Promise((resolve) => {
        request(app).get('/gateways?size=25').end((err, res) => {
          expect(err).to.equal(null);
          expect(res.status).to.equal(200);
          expect(res.body).to.be.an('array');
          expect(res.body).to.have.length(25);
          resolve();
        });
      }));
    });
  });

  describe('One gateway', function () {
    it('Should return a gateway object', function () {
      const { db } = app.locals;
      return db.collection('gateways')
        .insertOne(generateGateways(1))
        .then(() => db.collection('gateways').findOne({}))
        .then((gateway) => new Promise((resolve) => {
          /* eslint-disable-next-line no-underscore-dangle */
          request(app).get(`/gateways/${gateway._id}`).end((err, res) => {
            expect(err).to.equal(null);
            expect(res.status).to.equal(200);
            expect(res.body).to.be.an('object');
            expect(res.body).to.have.property('name');
            expect(res.body).to.have.property('serial');
            expect(res.body).to.have.property('ipv4');
            expect(res.body).to.have.property('devices');
            resolve();
          });
        }));
    });

    it('Should not return a gateway object if is not found', function () {
      const { db } = app.locals;
      return db.collection('gateways')
        .insertOne(generateGateways(1))
        .then(() => db.collection('gateways').findOne({}))
        .then((gateway) => new Promise((resolve) => {
          /* eslint-disable-next-line no-underscore-dangle */
          const id = changeId(gateway._id.toString());
          request(app).get(`/gateways/${id}`).end((err, res) => {
            expect(err).to.equal(null);
            expect(res.status).to.equal(404);
            expect(res.body).to.be.an('object');
            expect(res.body).to.have.property('code', 'NotFoundError');
            expect(res.body).to.have.property('message', 'Gateway not found');
            resolve();
          });
        }));
    });
  });

  describe('Add gateway', function () {
    it('Should add a gateway object', function () {
      const gateway = generateGateways(1);
      const { serial, name, ipv4 } = gateway;

      request(app).post('/gateways').send({ name, serial, ipv4 }).end((err, res) => {
        expect(err).to.equal(null);
        expect(res.status).to.equal(201);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('_id');
        expect(res.body).to.have.property('name');
        expect(res.body).to.have.property('serial');
        expect(res.body).to.have.property('ipv4');
        expect(res.body).to.have.property('devices');
      });
    });

    it('Should not add a gateway object with extra properties', function () {
      this.skip();
      const gateway = generateGateways(1);
      const {
        serial, name, ipv4, devices,
      } = gateway;

      request(app).post('/gateways').send({
        name, serial, ipv4, devices,
      }).end((err, res) => {
        expect(err).to.equal(null);
        expect(res.status).to.equal(400);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('code', 'RouteValidationError');
        expect(res.body).to.have.property('message', 'Error validating request');
      });
    });
  });

  afterEach(() => sinon.restore());

  after(() => cleanDatabase());
});
