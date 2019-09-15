const chai = require('chai');
const request = require('supertest');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');
const app = require('../app');
const { initializeDatabase, cleanDatabase } = require('./utils/database');
const { generateGateways } = require('./utils/data');

chai.use(sinonChai);
const { expect } = chai;

describe('Gateways', () => {
  beforeEach(() => initializeDatabase(app));

  describe('All gateways', () => {
    it('Should return gateway objects', () => {
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
          resolve();
        });
      }));
    });

    it('Should work without parameters', (done) => {
      request(app).get('/gateways').end((err, res) => {
        expect(err).to.equal(null);
        expect(res.status).to.equal(200);
        expect(res.body).to.be.an('array');
        expect(res.body).to.have.length(0);
        done();
      });
    });

    it('Should work with only a page parameter', (done) => {
      request(app).get('/gateways?page=1').end((err, res) => {
        expect(err).to.equal(null);
        expect(res.status).to.equal(200);
        expect(res.body).to.be.an('array');
        expect(res.body).to.have.length(0);
        done();
      });
    });

    it('Should not work with only a next parameter', (done) => {
      request(app).get('/gateways?next=5d7e117eba4f9659a0aa5290').end((err, res) => {
        expect(err).to.equal(null);
        expect(res.status).to.equal(200);
        expect(res.body).to.be.an('array');
        expect(res.body).to.have.length(0);
        done();
      });
    });

    it('Should not work with both page and next parameters', (done) => {
      request(app).get('/gateways?page=1&next=1').end((err, res) => {
        expect(err).to.equal(null);
        expect(res.status).to.equal(400);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('code', 'RouteValidationError');
        expect(res.body).to.have.property('message', 'Error validating request');
        done();
      });
    });

    it('Should limit returned objects by default', () => {
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

    it('Should allow for a variable number of returned records', () => {
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

  afterEach(() => sinon.restore());

  after(() => cleanDatabase());
});
