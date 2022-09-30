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

describe('Test Sku APIs', () => {
    purgeAllExcept(dbManager, 'USERS');
    getSkus(200);

    newSku(201, "description", 10, 100, "notes", 10.99, 1);
    newSku(201, "description2", 100, 50, "notes2", 99, 1);
    newSku(201, "description3", 50, 6, "notes3", 1.90, 1);
    newSku(201, "description4", 17, 15, "notes4", 5.9, 76);
    newSku(201, "description5", 100, 100, "notes5", 5.2, 34);
    newSku(422, "", 100, 100.12, "notes", 10.99, 100,'validation of request body failed');

    getSkus(200);
    
    newSku(422, "description", "aa", 100, "notes", 10.99, 100,'validation of request body failed');
    newSku(422, "description", 100, "100a", "notes", 10.99, 100,'validation of request body failed');
    newSku(422, "description", -100, -100, "notes", 10.99, 100,'validation of request body failed');
    newSku(422, "description", 100, 100, "", 10.99, 100,'validation of request body failed');
    newSku(422, "description", 100, 100, "notes", -10.99, 100,'validation of request body failed');
    newSku(422, "description", 100, 100, "", 10.99, -100,'validation of request body failed');
    
    newSku(422, "description", "10a0", "a100", "notes", "10.99a", "1a00",'validation of request body failed');
    getSkus(200);
    
    getSku(200,1);
    getSku(200,2);
    getSku(404,100000, 'no SKU associated to id');
    getSku(422,"sku", 'validation of id failed');
    getSku(422,"-", 'validation of id failed');
    getSku(422,-1, 'validation of id failed');

    updateSku(200,1,"new description1", 10, 100, "new notes1", 1.99, 1);
    updateSku(200,2,"new description2", 100, 50, "new notes2", 43, 1);
  
    updateSku(404,200,"new description2", 40, 25, "new notes2", 43, 32,'SKU not existing');
    updateSku(404,6,"new description2", 40, 25, "new notes2", 43, 32,'SKU not existing');
    
    getSkus(200);

    updateSku(422,1,"", 10, 100, "new notes2", 43, 32,'validation of request body failed or if with newAvailableQuantity position is not capable enough in weight or in volume');
    updateSku(422,1,"aaaa", "one", "2g5", "new notes2", 43, 32,'validation of request body failed or if with newAvailableQuantity position is not capable enough in weight or in volume');
    updateSku(422,1,"aaaa", 1, 50, "", 43, 32,'validation of request body failed or if with newAvailableQuantity position is not capable enough in weight or in volume');
    updateSku(422,1,"aaaa", 15, 55, "new notes2", "4a3", "32s",'validation of request body failed or if with newAvailableQuantity position is not capable enough in weight or in volume');   
    updateSku(422,1,"aaaa", 15, 55, "new notes2", 4, -32,'validation of request body failed or if with newAvailableQuantity position is not capable enough in weight or in volume'); 
    
    newPosition(201, 800234543412, 8002, 3454,3412, 1000,1000);
    newPosition(201, 800234543413, 8002, 3454,3413, 1000,1000);
    newPosition(201, 800234543414, 8002, 3454,3414, 1000,1000);
    newPosition(201, 800234543410, 8002, 3454,3410, 1000,1);
    newPosition(201, 800234543411, 8002, 3454,3411, 1,1000);

    updateSkuPosition(200,1,800234543412);
    updateSkuPosition(200,2,800234543413);
    updateSkuPosition(200,3,800234543414);

    updateSkuPosition(422,3,800234543412, 'validation of position through the algorithm failed or position isn\'t capable to satisfy volume and weight constraints for available quantity of sku or position is already assigned to a sku');
    updateSkuPosition(422,3,800234543410, 'validation of position through the algorithm failed or position isn\'t capable to satisfy volume and weight constraints for available quantity of sku or position is already assigned to a sku');
    updateSkuPosition(422,1,800234543411, 'validation of position through the algorithm failed or position isn\'t capable to satisfy volume and weight constraints for available quantity of sku or position is already assigned to a sku');

    updateSkuPosition(404,100,800234543410,'Position not existing or SKU not existing');
    updateSkuPosition(404,1,800234543415,'Position not existing or SKU not existing');

    

    deleteSku(204,1);
    deleteSku(204,2);
    deleteSku(204,3);
    deleteSku(422,"a",'validation of id failed');

    
    

    purgeAllExcept(dbManager, 'USERS');
});


function purgeAllExcept(db, ...excepts) {
    it(`Purging all except with params with params [${[...arguments]?.join(',')}]`, async function () {
        dbManager.openConnection();
        await purgeAllTablesExcept(db, excepts);
        dbManager.closeConnection();
    });
}

function getSkus(expectedHTTPStatus){
    it(`Getting skus with params [${[...arguments]?.join(',')}]`, function (done) {
        agent.get('/api/skus')
            .then(function (res) {
                res.should.have.status(expectedHTTPStatus);
                res.body.forEach(t => {
                    expect(t.id).not.to.be.undefined;
                    expect(t.description).not.to.be.undefined;
                    expect(t.weight).not.to.be.undefined;
                    expect(t.volume).not.to.be.undefined;
                    expect(t.notes).not.to.be.undefined;
                    expect(t.position).not.to.be.undefined;
                    expect(t.availableQuantity).not.to.be.undefined;
                    expect(t.price).not.to.be.undefined;
                    expect(t.testDescriptors).not.to.be.undefined;
                });
                done();
            })
            .catch(err => done(err));
    });
}



function getSku(expectedHTTPStatus, id, errorMessage) {
    it(`Getting sku with params [${[...arguments]?.join(',')}]`, function (done) {
        let api = `/api/skus/${id}`;
        agent.get(api)
            .then(function (res) {
                res.should.have.status(expectedHTTPStatus);
                if (errorMessage) {
                    res.body.should.equal(errorMessage);
                }
                else {
                    expect(res.body.description).not.to.be.undefined;
                    expect(res.body.weight).not.to.be.undefined;
                    expect(res.body.volume).not.to.be.undefined;
                    expect(res.body.notes).not.to.be.undefined;
                    expect(res.body.position).not.to.be.undefined;
                    expect(res.body.availableQuantity).not.to.be.undefined;
                    expect(res.body.price).not.to.be.undefined;
                    expect(res.body.testDescriptors).not.to.be.undefined;
                }
                done();
            })
            .catch(err => done(err));
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


function updateSku(expectedHTTPStatus, id, newDescription, newWeight, newVolume,newNotes,newPrice,newAvailableQuantity, errorMessage) {
    it(`Updating sku with params [${[...arguments]?.join(',')}]`, function (done) {
        let sku = { newDescription: newDescription, newWeight: newWeight, newVolume: newVolume, newNotes: newNotes, newPrice: newPrice, newAvailableQuantity: newAvailableQuantity };
        let api = `/api/sku/${id}`;
        agent.put(api)
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

function newPosition(expectedHTTPStatus,positionID, aisleID, row, col, maxWeight, maxVolume,errorMessage){
    it(`Adding a new position with params [${[...arguments]?.join(',')}]`, function (done) {
        let position = { positionID: positionID, aisleID: aisleID, row: row, col: col, maxWeight: maxWeight, maxVolume: maxVolume };
        let api = `/api/position`;
        agent.post(api)
            .send(position)
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


function updateSkuPosition(expectedHTTPStatus, id, newPosition, errorMessage) {
    it(`Updating sku position with params [${[...arguments]?.join(',')}]`, function (done) {
        let position = { position: newPosition };
        let api = `/api/sku/${id}/position`;
        agent.put(api)
            .send(position)
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
