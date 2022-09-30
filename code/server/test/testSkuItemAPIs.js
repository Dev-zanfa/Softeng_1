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


describe('Test SkuItem APIs', () => {
    purgeAllExcept(dbManager, 'USERS');

    getAllSkuItems(200);

    newSku(201, "description", 10, 100, "notes", 10.99, 1);
    newSku(201, "description2", 100, 50, "notes2", 99, 1);
    newSku(201, "description3", 50, 6, "notes3", 1.90, 1);
    newSku(201, "description4", 17, 15, "notes4", 5.9, 76);
    newSku(201, "description5", 100, 100, "notes5", 5.2, 34);

    newSKUItem(201,"12345678901234567890123456789010",1,"2021/11/29 12:30");
    newSKUItem(201,"12345678901234567890123456789011",2,"2021/11/29");
    newSKUItem(201,"12345678901234567890123456789012",3,"2021/11/29");
    newSKUItem(201,"12345678901234567890123456789013",4,"2021/11/29 02:30");
    newSKUItem(201,"12345678901234567890123456789014",5,"2021/11/29 11:32");
    newSKUItem(503,"12345678901234567890123456789014",5);

    getSkuItem(200,"12345678901234567890123456789010");
    getSkuItem(200,"12345678901234567890123456789011");
    getSkuItem(200,"12345678901234567890123456789012");
    getSkuItem(200,"12345678901234567890123456789013");
    getSkuItem(200,"12345678901234567890123456789014");
    

    newSKUItem(404,"12345678901234567890123456789015",6,"2021/11/29 12:30",'no SKU associated to SKUId');
    newSKUItem(422,"1234567890123456789012345678901",5,"2021/11/29 12:30",'validation of request body failed');
    newSKUItem(422,"12345678901234567890123456789015",5,"2021/11/ 12:30",'validation of request body failed');
    newSKUItem(422,"12345678901234567890123456789015",5,"2021-11-12 12-30",'validation of request body failed');

    updateSkuItem(200,"12345678901234567890123456789010","12345678901234567890123456789015",1,"2020/01/02 12:30");
    updateSkuItem(200,"12345678901234567890123456789011","12345678901234567890123456789016",1,"2012/01/02 12:30");
    updateSkuItem(200,"12345678901234567890123456789012","12345678901234567890123456789017",1,"2019/01/02 12:30");
    updateSkuItem(200,"12345678901234567890123456789013","12345678901234567890123456789018",1);

    getAllAvailableSkuItems(200,1);
    getAllAvailableSkuItems(422,-1,'validation of id failed');
    getAllAvailableSkuItems(422,"a",'validation of id failed');
    getAllAvailableSkuItems(404,10,'no SKU associated to id');

    getSkuItem(422,1233233,'validation of rfid failed');
    getSkuItem(404,"12345678901234567890123456789022",'no SKU Item associated to rfid');
    

    updateSkuItem(404,"12345678901234567890123456789020","12345678901234567890123456789018",1,"2020/10/12 12:30",'no SKU Item associated to rfid');
    updateSkuItem(422,"1234567890123456789012345678903","12345678901234567890123456789018",1,"2020/10/12 12:30",'validation of request body or of rfid failed');
    updateSkuItem(422,"12345678901234567890123456789013","1234567890123456789012345678901",1,"2020/10/12 12:30",'validation of request body or of rfid failed');
    updateSkuItem(422,"12345678901234567890123456789013","12345678901234567890123456789018",1,"2020/10/12:30",'validation of request body or of rfid failed');


    deleteSkuItem(204,"12345678901234567890123456789015");
    deleteSkuItem(204,"12345678901234567890123456789016");

    
    deleteSkuItem(422,"1234567890123456789012345678901",'validation of rfid failed');
    deleteSkuItem(422,"1267890123456789012345678901",'validation of rfid failed');

    purgeAllExcept(dbManager, 'USERS');
});


function purgeAllExcept(db, ...excepts) {
    it(`Purging all except with params with params [${[...arguments]?.join(',')}]`, async function () {
        dbManager.openConnection();
        await purgeAllTablesExcept(db, excepts);
        dbManager.closeConnection();
    });
}

function newSku(expectedHTTPStatus, description, weight, volume, notes, price, availableQuantity,errorMessage) {
    it(`Adding a new sku with params [${[...arguments]?.join(',')}]`, function (done) {
        let sku = { description: description, weight: weight, volume: volume, notes: notes, price: price, availableQuantity: availableQuantity };
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


function getAllSkuItems(expectedHTTPStatus){
    it(`Getting skuItems with params [${[...arguments]?.join(',')}]`, function (done) {
        agent.get('/api/skuitems')
            .then(function (res) {
                res.should.have.status(expectedHTTPStatus);
                res.body.forEach(t => {
                    expect(t.RFID).not.to.be.undefined;
                    expect(t.SKUId).not.to.be.undefined;
                    expect(t.Available).not.to.be.undefined;
                    expect(t.DateOfStock).not.to.be.undefined;
                });
                done();
            })
            .catch(err => done(err));
    });
}

function getAllAvailableSkuItems(expectedHTTPStatus,id, errorMessage){
    it(`Getting available skuItems with params [${[...arguments]?.join(',')}]`, function (done) {
        let api=`/api/skuitems/sku/${id}`;
        agent.get(api)
            .then(function (res) {
                res.should.have.status(expectedHTTPStatus);
                if (errorMessage) {
                    res.body.should.equal(errorMessage);
                }
                else {
                    res.body.forEach(t => {
                        expect(t.RFID).not.to.be.undefined;
                        expect(t.SKUId).not.to.be.undefined;
                        expect(t.DateOfStock).not.to.be.undefined;
                    });
                }
                done();
            })
            .catch(err => done(err));
    });
}


function getSkuItem(expectedHTTPStatus, rfid, errorMessage){
    it(`Getting skuItems with params [${[...arguments]?.join(',')}]`, function (done) {
        let api=`/api/skuitems/${rfid}`;
        agent.get(api)
            .then(function (res) {
                res.should.have.status(expectedHTTPStatus);
                if (errorMessage) {
                    res.body.should.equal(errorMessage);
                }
                else {
                    expect(res.body.RFID).not.to.be.undefined;
                    expect(res.body.SKUId).not.to.be.undefined;
                    expect(res.body.Available).not.to.be.undefined;
                    expect(res.body.DateOfStock).not.to.be.undefined;
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


function updateSkuItem(expectedHTTPStatus, rfid, newRFID, newAvailable, newDateOfStock, errorMessage) {
    it(`Updating sku with params [${[...arguments]?.join(',')}]`, function (done) {
        let skuItem = { newRFID: newRFID, newAvailable: newAvailable, newDateOfStock: newDateOfStock };
        let api = `/api/skuitems/${rfid}`;
        agent.put(api)
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
