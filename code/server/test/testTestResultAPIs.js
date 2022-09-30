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

describe('Test Test Result APIs', () => {

    purgeAllExcept(dbManager, 'USERS');
    newSKU(201, 'sku 1', 100, 100, 'no notes', 5.99, 3);
    newTestDescriptor(201, 'test 1', 'test 1 desc', 1);
    newSKUItem(201, '12345678123456781234567812345678', 1, '2022/05/18');

    newTestResult(201, '12345678123456781234567812345678', 1, '2022/05/20', true);
    newTestResult(404, '12345678123456781234567812345658', 1, '2022/05/20', true, 'no sku item associated to rfid or no test descriptor associated to idTestDescriptor');
    newTestResult(404, '12345678123456781234567812345678', 22, '2022/05/20', true, 'no sku item associated to rfid or no test descriptor associated to idTestDescriptor');
    newTestResult(422, '1234567812345678123456781234567855', 1, '2022/05/20', true, 'validation of request body or of rfid failed');
    newTestResult(422, '12345678123456781234567812345678', -1, '2022/05/20', true, 'validation of request body or of rfid failed');
    newTestResult(422, '12345678123456781234567812345678', 1, '30/02/2022', true, 'validation of request body or of rfid failed');
    newTestResult(422, '12345678123456781234567812345678', 1, '2022/05/20', -3, 'validation of request body or of rfid failed');
    updateTestResult(200, '12345678123456781234567812345678', 1, 1, '2022/05/21', false);
    updateTestResult(404, '12345678123456781234567812745678', 1, 1, '2022/05/21', false, 'no sku item associated to rfid or no test descriptor associated to newIdTestDescriptor or no test result associated to id');
    updateTestResult(404, '12345678123456781234567812345678', 3, 1, '2022/05/21', false, 'no sku item associated to rfid or no test descriptor associated to newIdTestDescriptor or no test result associated to id');
    updateTestResult(404, '12345678123456781234567812345678', 1, 5, '2022/05/21', false, 'no sku item associated to rfid or no test descriptor associated to newIdTestDescriptor or no test result associated to id');
    updateTestResult(422, '1234567812345678123456781234678', 1, 1, '2022/05/21', false, 'validation of request body, of id or of rfid failed');
    updateTestResult(422, '12345678123456781234567812345678', 0, 1, '2022/05/21', false, 'validation of request body, of id or of rfid failed');
    updateTestResult(422, '12345678123456781234567812345678', 1, '5c', '2022/05/21', false, 'validation of request body, of id or of rfid failed');
    updateTestResult(422, '12345678123456781234567812345678', 1, 1, '21/05/2021', false, 'validation of request body, of id or of rfid failed');
    updateTestResult(422, '12345678123456781234567812345678', 1, 1, '2022/05/21', -1, 'validation of request body, of id or of rfid failed');
    getTestResult(200, '12345678123456781234567812345678', 1);
    getTestResult(404, '12345678123456781234567812345678', 10, 'no test result associated to id or no sku item associated to rfid');
    getTestResult(404, '12345678123456781234567812345679', 1, 'no test result associated to id or no sku item associated to rfid');
    getTestResult(422, '1234567812345678123456781234567', 1, 'validation of id or of rfid failed');
    getTestResult(422, '12345678123456781234567812345678', 'f', 'validation of id or of rfid failed');
    getAllTestResults(200, '12345678123456781234567812345678');
    getAllTestResults(404, '12345678123456781234567812345679', 'no sku item associated to rfid');
    getAllTestResults(422, 'wrong', 'validation of rfid failed');
    deleteTestResult(204, '12345678123456781234567812345678', 1);
    deleteTestResult(422, '1234567812345678123456781234578', 1, 'validation of id or of rfid failed');
    deleteTestResult(422, '12345678123456781234567812345678', 'p', 'validation of id or of rfid failed');

    deleteSkuItem(204, '12345678123456781234567812345678');
    deleteTestDescriptor(204, 1);
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

function getAllTestResults(expectedHTTPStatus, rfid, errorMessage) {
    it(`Getting test results with params [${[...arguments]?.join(',')}]`, function (done) {
        let api = `/api/skuitems/${rfid}/testResults`;
        agent.get(api)
            .then(function (res) {
                res.should.have.status(expectedHTTPStatus);
                if (errorMessage) {
                    res.body.should.equal(errorMessage);
                }
                else {
                    res.body.forEach(t => {
                        expect(t.id).not.to.be.undefined;
                        expect(t.idTestDescriptor).not.to.be.undefined;
                        expect(t.Date).not.to.be.undefined;
                        expect(t.Result).not.to.be.undefined;
                    });
                }
                done();
            })
            .catch(err => done(err));
    });
}

function getTestResult(expectedHTTPStatus, rfid, id, errorMessage) {
    it(`Getting test result with params [${[...arguments]?.join(',')}]`, function (done) {
        let api = `/api/skuitems/${rfid}/testResults/${id}`;
        agent.get(api)
            .then(function (res) {
                res.should.have.status(expectedHTTPStatus);
                if (errorMessage) {
                    res.body.should.equal(errorMessage);
                }
                else {
                    expect(res.body.id).not.to.be.undefined;
                    expect(res.body.idTestDescriptor).not.to.be.undefined;
                    expect(res.body.Date).not.to.be.undefined;
                    expect(res.body.Result).not.to.be.undefined;
                }
                done();
            })
            .catch(err => done(err));
    });
}

function newTestResult(expectedHTTPStatus, rfid, idTestDescriptor, date, result, errorMessage) {
    it(`Adding a new test result with params [${[...arguments]?.join(',')}]`, function (done) {
        let tr = { rfid: rfid, idTestDescriptor: idTestDescriptor, Date: date, Result: result };
        agent.post('/api/skuitems/testResult')
            .send(tr)
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


function updateTestResult(expectedHTTPStatus, rfid, id, idTestDescriptor, date, result, errorMessage) {
    it(`Updating a test result with params [${[...arguments]?.join(',')}]`, function (done) {
        let tr = { newIdTestDescriptor: idTestDescriptor, newDate: date, newResult: result };
        let api = `/api/skuitems/${rfid}/testResult/${id}`;
        agent.put(api)
            .send(tr)
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

function deleteTestResult(expectedHTTPStatus, rfid, id, errorMessage) {
    it(`Deleting test result with params [${[...arguments]?.join(',')}]`, function (done) {
        let api = `/api/skuitems/${rfid}/testResult/${id}`;
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

function newSKUItem(expectedHTTPStatus, rfid, skuid, stockDate, errorMessage) {
    it(`Adding a new sku item with params [${[...arguments]?.join(',')}]`, function (done) {
        let skuItem = { RFID: rfid, SKUId: skuid, DateOfStock: stockDate };
        agent.post('/api/skuitem')
            .send(skuItem)
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

function deleteSkuItem(expectedHTTPStatus, rfid, errorMessage) {
    it(`Deleting sku item with params [${[...arguments]?.join(',')}]`, function (done) {
        let api = `/api/skuitems/${rfid}`;
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