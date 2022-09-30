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

describe('Test Internal Order APIs', () => {
    purgeAllExcept(dbManager, 'USERS');
    newInternalOrder(201, "2021/11/29 09:33", 
        [{"SKUId":12,"description":"a product","price":10.99,"qty":3},
        {"SKUId":180,"description":"another product","price":11.99,"qty":3}], 1);
    newInternalOrder(201, "2021/10/28 09:35", 
        [{"SKUId":1,"description":"pencilcase","price":10.99,"qty":10},
        {"SKUId":10,"description":"rubber","price":1.99,"qty":4}], 3);
    newInternalOrder(201, "2021/10/19 16:40", 
        [{"SKUId":1,"description":"suitcase","price":101.01,"qty":3},
        {"SKUId":4,"description":"computer","price":500.99,"qty":2},
        {"SKUId":12,"description":"printer","price":350.01,"qty":1}], 3);

    newInternalOrder(422, "", 
        [{"SKUId":1,"description":"pencilcase","price":10.99,"qty":10},
        {"SKUId":10,"description":"rubber","price":1.99,"qty":4}], 3,
        "validation of request body failed");
    newInternalOrder(422, "2011/10/28 10:20", 
        [{"SKUId":1,"description":"pencilcase","price":10.99,"qty":10.1},
        {"SKUId":10,"description":"rubber","price":1.99,"qty":4.8}], 3,
        "validation of request body failed");
    newInternalOrder(422, "2011/10/28 10:20", 
        [{"SKUId":1,"description":"pencilcase","price":10.99,"qty":10},
        {"SKUId":10,"description":"rubber","price":1.99,"qty":4}], -2,
        "validation of request body failed");
    newInternalOrder(422, "2011/10/28 10:20", 
        [{"SKUId":-1,"description":"pencilcase","price":10.99,"qty":10},
        {"SKUId":10,"description":"rubber","price":1.99,"qty":4}], 3,
        "validation of request body failed");
    newInternalOrder(422, "2011/10/28 10:20", 
        [{"SKUId":1,"description":"pencilcase","price":10.99,"qty":10},
        {"SKUId":0,"description":"rubber","price":1.99,"qty":4}], 3,
        "validation of request body failed");
    newInternalOrder(422, "2011/10/28 10:20", 
        [{"SKUId":1,"description":"","price":10.99,"qty":10},
        {"SKUId":0,"description":"rubber","price":1.99,"qty":4}], 3,
        "validation of request body failed");
    newInternalOrder(422, "2011/10/28 10:20", 
        [{"SKUId":1,"description":"pencilcase","price":10.99,"qty":2},
        {"SKUId":0,"description":"rubber","price":1.99,"qty":0}], 3,
        "validation of request body failed");
    getAllInternalOrders(200);
    getInternalOrderIssued(200);
    modifyInternalOrder(200, 2, "ACCEPTED");
    getInternalOrdersAccepted(200);
    getInternalOrder(200, 1);
    getInternalOrder(404, 10, 'no internal order associated to id');
    getInternalOrder(422, -1, "validation of id failed");
    modifyInternalOrder(200,1,"COMPLETED", 
        [{"SkuID":12,"RFID":"12345678901234567890123456789016"},
        {"SkuID":180,"RFID":"12345678901234567890123456789038"}])
    
    modifyInternalOrder(422,1,"", 
        [{"SkuID":12,"RFID":"12345678901234567890123456789016"},
        {"SkuID":180,"RFID":"12345678901234567890123456789038"}], "validation of request body or of id failed")
    modifyInternalOrder(422,1,"COMPLETED", 
        [{"SkuID":12,"RFID":"12345678901234567890123"},
        {"SkuID":180,"RFID":"1234567890123456789012"}], "validation of request body or of id failed")
    modifyInternalOrder(404,10,"COMPLETED", 
        [{"SkuID":12,"RFID":"12345678901234567890123"},
        {"SkuID":180,"RFID":"1234567890123456789012"}], "no internal order associated to id")
    deleteInternalOrder(204, 2);
    purgeAllExcept(dbManager, 'USERS');
})

function purgeAllExcept(db, ...excepts) {
    it(`Purging all except with params with params [${[...arguments]?.join(',')}]`, async function () {
        dbManager.openConnection();
        await purgeAllTablesExcept(db, excepts);
        dbManager.closeConnection();
    });
}

function getAllInternalOrders(expectedHTTPStatus) {
    it(`Getting Internal Orders with params [${[...arguments]?.join(',')}]`, function (done) {
        agent.get(`/api/internalOrders`)
            .then(function (res) {
                res.should.have.status(expectedHTTPStatus);
                res.body.forEach(r => {

                    expect(r.id).not.to.be.undefined;
                    expect(r.issueDate).not.to.be.undefined;
                    expect(r.state).not.to.be.undefined;
                    expect(r.customerId).not.to.be.undefined;
                    if(r.state==="COMPLETED"){
                        r.products.forEach(p => {
                            expect(p.SKUId).not.to.be.undefined;
                            expect(p.description).not.to.be.undefined;
                            expect(p.price).not.to.be.undefined;
                            expect(p.RFID).not.to.be.undefined;
                        })
                    }
                    else{
                        r.products.forEach(p => {
                            expect(p.SKUId).not.to.be.undefined;
                            expect(p.description).not.to.be.undefined;
                            expect(p.price).not.to.be.undefined;
                            expect(p.qty).not.to.be.undefined;
                        })
                    };
                    expect(r.customerId).not.to.be.undefined;
                })
                done();
            })
            .catch(err => done(err));
    });
}

function getInternalOrderIssued(expectedHTTPStatus) {
    it(`Getting Internal Orders in state issued with params [${[...arguments]?.join(',')}]`, function (done) {
        let api = `/api/internalOrdersIssued`;
        agent.get(api)
            .then(function (res) {
                res.should.have.status(expectedHTTPStatus);
                res.body.forEach(r => {

                    expect(r.id).not.to.be.undefined;
                    expect(r.issueDate).not.to.be.undefined;
                    expect(r.state).not.to.be.undefined;
                    expect(r.state).equal("ISSUED");
                    r.products.forEach(p => {
                        expect(p.SKUId).not.to.be.undefined;
                        expect(p.description).not.to.be.undefined;
                        expect(p.price).not.to.be.undefined;
                        expect(p.qty).not.to.be.undefined;
                    });
                    expect(r.customerId).not.to.be.undefined;
                })
                done();
            })
            .catch(err => done(err));
    });
}

function getInternalOrdersAccepted(expectedHTTPStatus) {
    it(`Getting Internal Orders in state accepted with params [${[...arguments]?.join(',')}]`, function (done) {
        let api = `/api/internalOrdersAccepted`;
        agent.get(api)
            .then(function (res) {
                res.should.have.status(expectedHTTPStatus);
                res.body.forEach(r => {

                    expect(r.id).not.to.be.undefined;
                    expect(r.issueDate).not.to.be.undefined;
                    expect(r.state).not.to.be.undefined;
                    expect(r.state).equal("ACCEPTED");
                    r.products.forEach(p => {
                        expect(p.SKUId).not.to.be.undefined;
                        expect(p.description).not.to.be.undefined;
                        expect(p.price).not.to.be.undefined;
                        expect(p.qty).not.to.be.undefined;
                    });
                    expect(r.customerId).not.to.be.undefined;
                })
                done();
            })
            .catch(err => done(err));
    });
}

function getInternalOrder(expectedHTTPStatus, id, errorMessage) {
    it(`Getting Internal Order with params [${[...arguments]?.join(',')}]`, function (done) {
        let api = `/api/internalOrders/${id}`;
        agent.get(api)
            .then(function (res) {
                res.should.have.status(expectedHTTPStatus);
                if (errorMessage) {
                    res.body.should.equal(errorMessage);
                } else {
                    expect(res.body.id).not.to.be.undefined;
                    expect(res.body.issueDate).not.to.be.undefined;
                    expect(res.body.state).not.to.be.undefined;
                    if(res.body.state==="COMPLETED"){
                        res.body.products.forEach(p => {
                            expect(p.SKUId).not.to.be.undefined;
                            expect(p.description).not.to.be.undefined;
                            expect(p.price).not.to.be.undefined;
                            expect(p.RFID).not.to.be.undefined;
                        })
                    }
                    else{
                        res.body.products.forEach(p => {
                            expect(p.SKUId).not.to.be.undefined;
                            expect(p.description).not.to.be.undefined;
                            expect(p.price).not.to.be.undefined;
                            expect(p.qty).not.to.be.undefined;
                        })
                    };
                    expect(res.body.customerId).not.to.be.undefined;
                }
                done();
            })
            .catch(err => done(err));
    });
}

function newInternalOrder(expectedHTTPStatus, issueDate, products, customerId, errorMessage) {
    it(`Adding a new internal order with params [${[...arguments]?.join(',')}]`, function (done) {
        let ro = { issueDate: issueDate, products: products, customerId: customerId };
        agent.post('/api/internalOrders')
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

function modifyInternalOrder(expectedHTTPStatus, id, newState, products, errorMessage) {
    it(`Modify state (and products) of an internal order with params [${[...arguments]?.join(',')}]`, function (done) {
        let api = `/api/internalOrders/${id}`;
        if(newState==="COMPLETED"){
            let ioc = { newState: newState, products: products};
            agent.put(api).send(ioc)
            .then(function (res) {
                res.should.have.status(expectedHTTPStatus);
                if (errorMessage) {
                    res.body.should.equal(errorMessage);
                }
                done();
            })
            .catch(err => done(err));
        }
        else{
            let io = { newState: newState };
            agent.put(api).send(io)
            .then(function (res) {
                res.should.have.status(expectedHTTPStatus);
                if (errorMessage) {
                    res.body.should.equal(errorMessage);
                }
                done();
            })
            .catch(err => done(err));
        }
    });
}

function deleteInternalOrder(expectedHTTPStatus, id, errorMessage) {
    it(`Deleting Internal Orders with params [${[...arguments]?.join(',')}]`, function (done) {
        let api = `/api/internalOrders/${id}`;
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