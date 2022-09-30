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


describe('Test restock Orders APIs', () => {
    purgeAllExcept(dbManager, 'USERS');

    newRestockOrder(201, "2021/11/29 09:33",
        [{ "SKUId": 12, "description": "a product", "price": 10.99, "qty": 30 },
        { "SKUId": 180, "description": "another product", "price": 11.99, "qty": 20 }], 1);
    newRestockOrder(201, "2021/11/29 09:33",
        [{ "SKUId": 12, "description": "a product", "price": 10.99, "qty": 30 },
        { "SKUId": 180, "description": "another product", "price": 11.99, "qty": 20 }], 1);
    getAllRestockOrders(200);
    getRestockOrder(200, 1);
    getRestockOrderIssued(200);
    getRestockOrder(404, 200, 'no restock order associated to id');
    getRestockOrder(422, 'aaa', 'validation of id failed');
    restockOrderItemstoReturn(404, 100, 'no restock order associated to id');
    restockOrderItemstoReturn(422, 'aaa', 'validation of id failed or restock order state != COMPLETEDRETURN');
    restockOrderItemstoReturn(422, 1, 'validation of id failed or restock order state != COMPLETEDRETURN');
    modifyState(200, 1, "COMPLETEDRETURN");
    modifyState(422, 'aaa', "COMPLETEDRETURN", 'validation of request body or of id failed');
    modifyState(422, 'aaa', "COMPLERETURN", 'validation of request body or of id failed');
    modifyState(404, 100, "ISSUED", 'no restock order associated to id');
    restockOrderItemstoReturn(200, 1);

    addItemsToRestockOrder(404, 100, [{"SKUId":12,"rfid":"12345678901234567890123456789016"},{"SKUId":12,"rfid":"12345678901234567890123456789017"},], 'no restock order associated to id');
    addItemsToRestockOrder(422, 'aaa', [{"SKUId":12,"rfid":"12345678901234567890123456789016"},{"SKUId":12,"rfid":"12345678901234567890123456789017"},],'validation of request body or of id failed or order state != DELIVERED');
    addItemsToRestockOrder(422, 1, [{"SKUId":12,"rfid":"12345678901234567890123456789016"},{"SKUId":12,"rfid":"12345678901234567890123456789017"},], 'validation of request body or of id failed or order state != DELIVERED');
    modifyState(200, 1, "DELIVERED");
    addItemsToRestockOrder(200, 1, [{"SKUId":12,"rfid":"12345678901234567890123456789016"},{"SKUId":12,"rfid":"12345678901234567890123456789017"},]);
    
    addTransportNoteToRestockOrder(404, 100, {"deliveryDate":"2021/12/29"}, 'no restock order associated to id');
    addTransportNoteToRestockOrder(422, 'aaa',{"deliveryDate":"2021/12/29"},'validation of request body or of id failed or order state != DELIVERY or deliveryDate is before issueDate');
    addTransportNoteToRestockOrder(422, 1, {"deliveryDate":"2021/12/29"}, 'validation of request body or of id failed or order state != DELIVERY or deliveryDate is before issueDate');
    modifyState(200, 1, "DELIVERY");
    addTransportNoteToRestockOrder(200, 1, {"deliveryDate":"2021/12/29"});

    deleteRestockOrder(204, 1);
});

function purgeAllExcept(db, ...excepts) {
    it(`Purging all except with params with params [${[...arguments]?.join(',')}]`, async function () {
        dbManager.openConnection();
        await purgeAllTablesExcept(db, excepts);
        dbManager.closeConnection();
    });
}

function getAllRestockOrders(expectedHTTPStatus) {
    it(`Getting restock Orders with params [${[...arguments]?.join(',')}]`, function (done) {
        agent.get(`/api/restockOrders`)
            .then(function (res) {
                res.should.have.status(expectedHTTPStatus);
                res.body.forEach(r => {

                    expect(r.id).not.to.be.undefined;
                    expect(r.issueDate).not.to.be.undefined;
                    expect(r.state).not.to.be.undefined;
                    r.products.forEach(p => {
                        expect(p.SKUId).not.to.be.undefined;
                        expect(p.description).not.to.be.undefined;
                        expect(p.price).not.to.be.undefined;
                        expect(p.qty).not.to.be.undefined;
                    });
                    expect(r.supplierId).not.to.be.undefined;
                    expect(r.transportNote).not.to.be.undefined;
                    r.skuItems.forEach(p => {
                        expect(p.SKUId).not.to.be.undefined;
                        expect(p.rfid).not.to.be.undefined;
                    });
                })
                done();
            })
            .catch(err => done(err));
    });
}

function getRestockOrder(expectedHTTPStatus, id, errorMessage) {
    it(`Getting restock Order with params [${[...arguments]?.join(',')}]`, function (done) {
        let api = `/api/restockOrders/${id}`;
        agent.get(api)
            .then(function (res) {
                res.should.have.status(expectedHTTPStatus);
                if (errorMessage) {
                    res.body.should.equal(errorMessage);
                } else {
                    expect(res.body.id).not.to.be.undefined;
                    expect(res.body.issueDate).not.to.be.undefined;
                    expect(res.body.state).not.to.be.undefined;
                    res.body.products.forEach(p => {
                        expect(p.SKUId).not.to.be.undefined;
                        expect(p.description).not.to.be.undefined;
                        expect(p.price).not.to.be.undefined;
                        expect(p.qty).not.to.be.undefined;
                    });
                    expect(res.body.supplierId).not.to.be.undefined;
                    expect(res.body.transportNote).not.to.be.undefined;
                    res.body.skuItems.forEach(p => {
                        expect(p.SKUId).not.to.be.undefined;
                        expect(p.rfid).not.to.be.undefined;
                    });
                }
                done();
            })
            .catch(err => done(err));
    });
}

function getRestockOrderIssued(expectedHTTPStatus, errorMessage) {
    it(`Getting restock Order in state issued with params [${[...arguments]?.join(',')}]`, function (done) {
        let api = `/api/restockOrdersIssued`;
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
                    expect(r.supplierId).not.to.be.undefined;
                    expect(r.transportNote).not.to.be.undefined;
                    r.skuItems.forEach(p => {
                        expect(p.SKUId).not.to.be.undefined;
                        expect(p.rfid).not.to.be.undefined;
                    });
                })
                done();
            })
            .catch(err => done(err));
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

function addItemsToRestockOrder(expectedHTTPStatus, id, skuItems, errorMessage) {
    it(`Adding restock order Items with params [${[...arguments]?.join(',')}]`, function (done) {
        let ro = { skuItems: skuItems };
        agent.put(`/api/restockOrder/${id}/skuItems`)
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

function addTransportNoteToRestockOrder(expectedHTTPStatus, id, transportNote, errorMessage) {
    it(`Adding restock order TransportNote with params [${[...arguments]?.join(',')}]`, function (done) {
        let ro = { transportNote: transportNote };
        agent.put(`/api/restockOrder/${id}/transportNote`)
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


function restockOrderItemstoReturn(expectedHTTPStatus, id, errorMessage) {
    it(`Getting sku items to be returned of a restock order, given its id, with params [${[...arguments]?.join(',')}]`, function (done) {
        let api = `/api/restockOrders/${id}/returnItems`;
        agent.get(api)
            .then(function (res) {
                res.should.have.status(expectedHTTPStatus);
                if (errorMessage) {
                    res.body.should.equal(errorMessage);
                } else {
                    res.body.forEach(r => {
                        expect(r.SKUId).not.to.be.undefined;
                        expect(r.rfid).not.to.be.undefined;
                    })
                }
                done();
            })
            .catch(err => done(err));
    });
}




function modifyState(expectedHTTPStatus, id, newState, errorMessage) {
    it(`Modify state of a restock order with params [${[...arguments]?.join(',')}]`, function (done) {
        let api = `/api/restockOrder/${id}`;
        let ro = { newState: newState };
        agent.put(api).send(ro)
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

function deleteRestockOrder(expectedHTTPStatus, id, errorMessage) {
    it(`Deleting Restock Order with params [${[...arguments]?.join(',')}]`, function (done) {
        let api = `/api/restockOrder/${id}`;
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