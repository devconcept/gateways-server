const chai = require('chai');
const request = require('supertest');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');
const app = require('../app');
const { initializeDatabase, cleanDatabase } = require('./utils/database');
const { generateDevices, generateGateways } = require('./utils/data');

chai.use(sinonChai);
const { expect } = chai;

describe('Devices', function () {
  beforeEach(() => initializeDatabase(app));

  describe('Add device', function () {
    it('Should add a device to a gateway object', function () {
      this.slow(300);
      const { db } = app.locals;
      return db.collection('gateways')
        .insertOne(generateGateways(1))
        .then(() => db.collection('gateways').findOne({}))
        .then((gateway) => new Promise((resolve) => {
          const device = generateDevices(1);
          const {
            uid, vendor, created, status,
          } = device;
          /* eslint-disable-next-line no-underscore-dangle */
          request(app).post(`/gateways/${gateway._id.toString()}/devices`).send({
            uid, vendor, created, status: status.toString(),
          }).end((err, res) => {
            expect(err).to.equal(null);
            expect(res.status).to.equal(201);
            expect(res.body).to.be.an('object');
            expect(res.body).to.have.property('uid');
            expect(res.body).to.have.property('vendor');
            expect(res.body).to.have.property('created');
            expect(res.body).to.have.property('status');
            resolve();
          });
        }));
    });
  });

  describe('Remove device', function () {
    it('Should remove a device from a gateway object', function () {
      const { db } = app.locals;
      const newGateway = generateGateways(1);
      newGateway.devices = [generateDevices(1)];
      return db.collection('gateways')
        .insertOne(newGateway)
        .then(() => db.collection('gateways').findOne({}))
        .then((gateway) => new Promise((resolve) => {
          const { _id: id, devices } = gateway;
          const deviceId = devices[0].uid;
          request(app).delete(`/gateways/${id}/devices/${deviceId}`).end((err, res) => {
            expect(err).to.equal(null);
            expect(res.status).to.equal(204);
            expect(res.body).to.be.an('object');
            resolve();
          });
        }));
    });
  });

  afterEach(() => sinon.restore());

  after(() => cleanDatabase());
});
