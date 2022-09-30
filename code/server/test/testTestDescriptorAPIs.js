const { expect } = require('chai');
const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
chai.should();

const { purgeAllTablesExcept } = require('../unit_test/mocks/purgeUtils');
const DBManager = require('../database/dbManager');
const app = require('../server');
var agent = chai.request.agent(app);
var dbManager = new DBManager('PROD');

describe('Test Test Descriptor APIs', () => {
    
    purgeAllExcept(dbManager, 'USERS');
    newSKU(201, 'sku 1', 100, 100, 'no notes', 5.99, 3);
    newTestDescriptor(201, 'test 1', 'test 1 desc', 1);
    newTestDescriptor(404, 'test 1', 'test 1 desc', 100000, 'no sku associated idSKU');
    newTestDescriptor(422, null, null, 1, 'validation of request body failed');
    updateTestDescriptor(200, 1, 'newTest 1', 'new Test Desc 1', 1);
    updateTestDescriptor(404, 1, 'test 1', 'test 1 desc', 100000, 'no test descriptor associated id or no sku associated to IDSku');
    updateTestDescriptor(404, 100000, 'test 1', 'test 1 desc', 1, 'no test descriptor associated id or no sku associated to IDSku');
    updateTestDescriptor(422, 'wrong', null, null, 1, 'validation of request body or of id failed');
    getTestDescriptor(200, 1);
    getTestDescriptor(404, 100000, 'no test descriptor associated id');
    getTestDescriptor(422, 'wrong', 'validation of id failed');
    getAllTestDescriptors(200);
    deleteTestDescriptor(204, 1);
    deleteTestDescriptor(422, 'wrong', 'validation of id failed');
    deleteSku(204, 1);    
    purgeAllExcept(dbManager, 'USERS');
});

function purgeAllExcept(db, ...excepts) {
    it(`Purging all except with params with params [${[...arguments]?.join(',')}]`, async function () {
        dbManager.openConnection();
        await purgeAllTablesExcept(db, excepts);
        dbManager.closeConnection();
    });
}

function getAllTestDescriptors(expectedHTTPStatus) {
    it(`Getting test descriptors with params [${[...arguments]?.join(',')}]`, function (done) {
        agent.get('/api/testDescriptors')
            .then(function (res) {
                res.should.have.status(expectedHTTPStatus);
                res.body.forEach(t => {
                    expect(t.id).not.to.be.undefined;
                    expect(t.name).not.to.be.undefined;
                    expect(t.procedureDescription).not.to.be.undefined;
                    expect(t.idSKU).not.to.be.undefined;
                });
                done();
            })
            .catch(err => done(err));
    });
}

function getTestDescriptor(expectedHTTPStatus, id, errorMessage) {
    it(`Getting test descriptor with params [${[...arguments]?.join(',')}]`, function (done) {
        let api = `/api/testDescriptors/${id}`;
        agent.get(api)
            .then(function (res) {
                res.should.have.status(expectedHTTPStatus);
                if (errorMessage) {
                    res.body.should.equal(errorMessage);
                }
                else {
                    expect(res.body.id).not.to.be.undefined;
                    expect(res.body.name).not.to.be.undefined;
                    expect(res.body.procedureDescription).not.to.be.undefined;
                    expect(res.body.idSKU).not.to.be.undefined;
                }
                done();
            })
            .catch(err => done(err));
    });
}

function newTestDescriptor(expectedHTTPStatus, name, desc, skuId, errorMessage) {
    it(`Adding a new test descriptor with params [${[...arguments]?.join(',')}]`, function (done) {
        let td = { name: name, procedureDescription: desc, idSKU: skuId };
        agent.post('/api/testDescriptor')
            .send(td)
            .then(function (res) {
                res.should.have.status(expectedHTTPStatus);
                if (errorMessage) {
                    res.body.should.equal(errorMessage);
                }
                done();
            })
            .catch(err => done(err));
    });
}


function updateTestDescriptor(expectedHTTPStatus, id, name, desc, skuId, errorMessage) {
    it(`Updating test descriptor with params [${[...arguments]?.join(',')}]`, function (done) {
        let td = { newName: name, newProcedureDescription: desc, newIdSKU: skuId };
        let api = `/api/testDescriptor/${id}`;
        agent.put(api)
            .send(td)
            .then(function (res) {
                res.should.have.status(expectedHTTPStatus);
                if (errorMessage) {
                    res.body.should.equal(errorMessage);
                }
                done();
            })
            .catch(err => done(err));
    });
}

function deleteTestDescriptor(expectedHTTPStatus, id, errorMessage) {
    it(`Deleting test descriptor with params [${[...arguments]?.join(',')}]`, function (done) {
        let api = `/api/testDescriptor/${id}`;
        agent.delete(api)
            .then(function (res) {
                res.should.have.status(expectedHTTPStatus);
                if (errorMessage) {
                    res.body.should.equal(errorMessage);
                }
                done();
            })
            .catch(err => done(err));
    });
}

function newSKU(expectedHTTPStatus, desc, weight, volume, notes, price, qty, errorMessage) {
    it(`Adding a new sku with params [${[...arguments]?.join(',')}]`, function (done) {
        let sku = { description: desc, weight: weight, volume: volume, notes: notes, price: price, availableQuantity: qty };
        agent.post('/api/sku')
            .send(sku)
            .then(function (res) {
                res.should.have.status(expectedHTTPStatus);
                if (errorMessage) {
                    res.body.should.equal(errorMessage);
                }
                done();
            })
            .catch(err => done(err));
    });
}

function deleteSku(expectedHTTPStatus, id, errorMessage) {
    it(`Deleting sku with params [${[...arguments]?.join(',')}]`, function (done) {
        let api = `/api/skus/${id}`;
        agent.delete(api)
            .then(function (res) {
                res.should.have.status(expectedHTTPStatus);
                if (errorMessage) {
                    res.body.should.equal(errorMessage);
                }
                done();
            })
            .catch(err => done(err));
    });
}