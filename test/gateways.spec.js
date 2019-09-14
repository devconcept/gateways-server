const chai = require('chai');
const request = require('supertest');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');
const app = require('../app');
const { initializeDatabase, cleanDatabase } = require('./utils/database');

chai.use(sinonChai);
const { expect } = chai;

describe('Gateways', () => {
  beforeEach(() => initializeDatabase(app));

  describe('All gateways', () => {
    it('Should work without parameters', (done) => {
      request(app).get('/devices').end((err, res) => {
        expect(err).to.equal(null);
        expect(res.body).to.equal(null);
        done();
      });
    });
  });

  afterEach(() => sinon.restore());

  after(() => cleanDatabase());
});
