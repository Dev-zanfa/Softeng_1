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

describe('Test Item APIs', () => {
    purgeAllExcept(dbManager, 'USERS');
    newSKU(201, 'sku 1', 100, 100, 'no notes', 5.99, 3);
    newSKU(201, 'sku 2', 100, 100, 'no notes', 5.99, 3);
    newSKU(201, 'sku 3', 100, 100, 'no notes', 5.99, 3);
    newItem(201, 12, "a new item", 10.99, 1, 2);
    newItem(201, 15, "a particular item", 13.99, 2, 4);
    newItem(201, 6, "a special item", 14.99, 3, 5);

    newItem(422, 12, "", 10.99, 1, 2, "validation of request body failed or this supplier already sells an item with the same SKUId or supplier already sells an Item with the same ID");
    newItem(422, 12, "a new item", 10.99, -1, 2, "validation of request body failed or this supplier already sells an item with the same SKUId or supplier already sells an Item with the same ID");
    newItem(422, 10, "a new item", 10.99, 1, 2, "validation of request body failed or this supplier already sells an item with the same SKUId or supplier already sells an Item with the same ID");
    newItem(422, 15, "a new item", 10.99, 5, 4, "validation of request body failed or this supplier already sells an item with the same SKUId or supplier already sells an Item with the same ID");
    newItem(422, -3, "a new item", 10.99, 1, 2, "validation of request body failed or this supplier already sells an item with the same SKUId or supplier already sells an Item with the same ID");
    newItem(422, 12, "a new item", 10.99, 1, "gkdnge", "validation of request body failed or this supplier already sells an item with the same SKUId or supplier already sells an Item with the same ID");

    getAllItems(200);
    getItem(200, 15);
    getItem(404, 200, "no item associated to id");
    getItem(422, -2, "validation of id failed");
    modifyItem(200, 12, "new description", 35.99);

    modifyItem(404, 500, "new description", 35.99, "Item not existing");
    modifyItem(422, 6, "description", "grev", "validation of request body failed");

    deleteItem(204, 15);
    deleteItem(422, -3);
    purgeAllExcept(dbManager, 'USERS');
})

function purgeAllExcept(db, ...excepts) {
    it(`Purging all except with params with params [${[...arguments]?.join(',')}]`, async function () {
        dbManager.openConnection();
        await purgeAllTablesExcept(db, excepts);
        dbManager.closeConnection();
    });
}

function getAllItems(expectedHTTPStatus) {
    it(`Getting Items with params [${[...arguments]?.join(',')}]`, function (done) {
        agent.get(`/api/items`)
            .then(function (res) {
                res.should.have.status(expectedHTTPStatus);
                res.body.forEach(i => {

                    expect(i.id).not.to.be.undefined;
                    expect(i.description).not.to.be.undefined;
                    expect(i.price).not.to.be.undefined;
                    expect(i.SKUId).not.to.be.undefined;
                    expect(i.supplierId).not.to.be.undefined;
                })
                done();
            })
            .catch(err => done(err));
    });
}

function getItem(expectedHTTPStatus, id, errorMessage) {
    it(`Getting Item with params [${[...arguments]?.join(',')}]`, function (done) {
        let api = `/api/items/${id}`;
        agent.get(api)
            .then(function (res) {
                res.should.have.status(expectedHTTPStatus);
                if (errorMessage) {
                    res.body.should.equal(errorMessage);
                } else {
                    expect(res.body.id).not.to.be.undefined;
                    expect(res.body.description).not.to.be.undefined;
                    expect(res.body.price).not.to.be.undefined;
                    expect(res.body.SKUId).not.to.be.undefined;
                    expect(res.body.supplierId).not.to.be.undefined;
                }
                done();
            })
            .catch(err => done(err));
    });
}

function newItem(expectedHTTPStatus, id, description, price, SKUId, supplierId, errorMessage) {
    it(`Adding a new item with params [${[...arguments]?.join(',')}]`, function (done) {
        let ro = { id: id, description: description, price: price, SKUId: SKUId, supplierId: supplierId };
        agent.post('/api/item')
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

function modifyItem(expectedHTTPStatus, id, newDescription, newPrice, errorMessage) {
    it(`Modify description and price of an item with params [${[...arguments]?.join(',')}]`, function (done) {
        let api = `/api/item/${id}`;
        let i = { newDescription: newDescription, newPrice: newPrice};
        agent.put(api).send(i)
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

function deleteItem(expectedHTTPStatus, id, errorMessage) {
    it(`Deleting Item with params [${[...arguments]?.join(',')}]`, function (done) {
        let api = `/api/items/${id}`;
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