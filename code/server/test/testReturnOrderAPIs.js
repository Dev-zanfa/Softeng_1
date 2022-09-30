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

describe('Test return Orders APIs', () => {
    purgeAllExcept(dbManager, 'USERS');
    newRestockOrder(201, "2021/11/29 09:33",
        [{ "SKUId": 12, "description": "a product", "price": 10.99, "qty": 30 },
        { "SKUId": 180, "description": "another product", "price": 11.99, "qty": 20 }], 1);
    newReturnOrder(201, "2021/11/29 09:33",
        [{ "SKUId": 12, "description": "a product", "price": 10.99, "RFID": "12345678901234567890123456789016" },
        { "SKUId": 180, "description": "another product", "price": 11.99, "RFID": "12345678901234567890123456789038" },], 1);

        
        newReturnOrder(404, "2021/11/29 09:33",
        [{ "SKUId": 12, "description": "a product", "price": 10.99, "RFID": "12345678901234567890123456789016" },
        { "SKUId": 180, "description": "another product", "price": 11.99, "RFID": "12345678901234567890123456789038" },], 100,'no restock order associated to restockOrderId');
        newReturnOrder(422, "2021/11/29 09:33",
        [{ "SKUId": 12, "description": "a product", "price": 10.99, "RFID": "12345678901234567890123456789016" },
        { "SKUId": 180, "description": "another product", "price": 11.99, "RFID": "12345678901234567890123456789038" },], "aaa", 'validation of request body failed');


    getAllReturnOrders(200);
    getReturnOrder(200, 1);
    getReturnOrder(404, 200, 'no return order associated to id');
    getReturnOrder(422, 'aaa', 'validation of id failed');
    deleteReturnOrder(422, 'aa', "validation of id failed");
    deleteReturnOrder(204, 1);

});

function purgeAllExcept(db, ...excepts) {
    it(`Purging all except with params with params [${[...arguments]?.join(',')}]`, async function () {
        dbManager.openConnection();
        await purgeAllTablesExcept(db, excepts);
        dbManager.closeConnection();
    });
}

function newRestockOrder(expectedHTTPStatus, issueDate, products, supplierId, errorMessage) {
    it(`Adding a new restock order with params [${[...arguments]?.join(',')}]`, function (done) {
        let ro = { issueDate: issueDate, products: products, supplierId: supplierId };
        agent.post('/api/restockOrder')
            .send(ro)
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

function getAllReturnOrders(expectedHTTPStatus) {
    it(`Getting return Orders with params [${[...arguments]?.join(',')}]`, function (done) {
        agent.get(`/api/returnOrders`)
            .then(function (res) {
                res.should.have.status(expectedHTTPStatus);
                res.body.forEach(r => {
                    expect(r.id).not.to.be.undefined;
                    expect(r.returnDate).not.to.be.undefined;
                    r.products.forEach(p => {
                        expect(p.SKUId).not.to.be.undefined;
                        expect(p.description).not.to.be.undefined;
                        expect(p.price).not.to.be.undefined;
                        expect(p.RFID).not.to.be.undefined;
                    });
                    expect(r.restockOrderId).not.to.be.undefined;
                })
                done();
            })
            .catch(err => done(err));
    });
}

function getReturnOrder(expectedHTTPStatus, id, errorMessage) {
    it(`Getting return Order with params [${[...arguments]?.join(',')}]`, function (done) {
        let api = `/api/returnOrders/${id}`;
        agent.get(api)
            .then(function (res) {
                res.should.have.status(expectedHTTPStatus);
                if (errorMessage) {
                    res.body.should.equal(errorMessage);
                } else {
                    expect(res.body.id).not.to.be.undefined;
                    expect(res.body.returnDate).not.to.be.undefined;
                    res.body.products.forEach(p => {
                        expect(p.SKUId).not.to.be.undefined;
                        expect(p.description).not.to.be.undefined;
                        expect(p.price).not.to.be.undefined;
                        expect(p.RFID).not.to.be.undefined;
                    });
                    expect(res.body.restockOrderId).not.to.be.undefined;
                }
                done();
            })
            .catch(err => done(err));
    });
}

function newReturnOrder(expectedHTTPStatus, returnDate, products, restockOrderId, errorMessage) {
    it(`Adding a new return order with params [${[...arguments]?.join(',')}]`, function (done) {
        let ro = { returnDate: returnDate, products: products, restockOrderId: restockOrderId };
        agent.post('/api/returnOrder')
            .send(ro)
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

function deleteReturnOrder(expectedHTTPStatus, id, errorMessage) {
    it(`Deleting Return Order with params [${[...arguments]?.join(',')}]`, function (done) {
        let api = `/api/returnOrder/${id}`;
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