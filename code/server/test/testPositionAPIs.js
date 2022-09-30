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


describe('Test Position APIs', () => {
    purgeAllExcept(dbManager, 'USERS');

    getPositions(200);

    newPosition(201, 800234543412, 8002, 3454,3412, 1000,1000);
    newPosition(201, 800234543413, 8002, 3454,3413, 1000,1000);
    newPosition(201, 800234543414, 8002, 3454,3414, 1000,1000);
    newPosition(201, 800234543410, 8002, 3454,3410, 1000,1);
    newPosition(201, 800234543411, 8002, 3454,3411, 1,1000);

    newPosition(422, 80023454341, 8002, 3454,3412, 1000,1000,'validation of request body failed');
    newPosition(422, 800234543413, 8002, 3454,3414, 1000,1000,'validation of request body failed');
    newPosition(422, 800234543414, 802, 345,414, 1000,1000,'validation of request body failed');
    newPosition(422, 800234543410, 8022, 3654,1111, 1000,1,'validation of request body failed');
    newPosition(422, 800234543411, "aa02", "a454","two2", 1,1000,'validation of request body failed');

    getPositions(200);

    updatePosition(200,800234543412,1111,1111,1111,1200,600,200,100);
    updatePosition(200,800234543413,1112,1112,1112,1200,600,200,100);
    updatePosition(200,800234543414,1113,1114,1115,400,600,122,100);

    updatePosition(422,80023454341,1113,1114,1115,400,600,122,100,'validation of request body or of positionID failed');
    updatePosition(422,800234543414,1113,1114,111,400,600,122,100,'validation of request body or of positionID failed');
    updatePosition(422,800234543414,-1113,1111,1115,400,600,122,100,'validation of request body or of positionID failed');
    updatePosition(422,800234543414,1113,1114,1115,-400,-600,122,100,'validation of request body or of positionID failed');
    updatePosition(422,800234543414,1113,1114,1115,400,600,-122,100,'validation of request body or of positionID failed');
    updatePosition(422,800234543414,1113,1114,1115,400,600,122,-100,'validation of request body or of positionID failed');

    updatePosition(404, 800234543419,8002,3454,3419,400,600,111,111,'no position associated to positionID');
    updatePosition(404, 200234543419,2002,3454,3419,400,600,111,111,'no position associated to positionID');

    updatePositionID(200,111111111111,111234543412);
    updatePositionID(200,111211121112,111034543412);

    updatePositionID(404,111211121112,101034543412,'no position associated to positionID');
    updatePositionID(404,800234543412,103034543412,'no position associated to positionID');

    updatePositionID(422,80023454341,00003454341,'validation of request body or of positionID failed');
    updatePositionID(422,"a00a3454341a",00003454341,'validation of request body or of positionID failed');
    
    deletePosition(204, 111234543412);
    deletePosition(204, 111034543412);
    
    deletePosition(422,11123454341,'validation of positionID failed');
    deletePosition(422,"a11a345a3a14",'validation of positionID failed');


    purgeAllExcept(dbManager, 'USERS');
});


function purgeAllExcept(db, ...excepts) {
    it(`Purging all except with params with params [${[...arguments]?.join(',')}]`, async function () {
        dbManager.openConnection();
        await purgeAllTablesExcept(db, excepts);
        dbManager.closeConnection();
    });
}


function getPositions(expectedHTTPStatus){
    it(`Getting positions with params [${[...arguments]?.join(',')}]`, function (done) {
        let api=`/api/positions`;
        agent.get(api)
            .then(function (res) {
                res.should.have.status(expectedHTTPStatus);
                res.body.forEach(t => {
                    expect(t.positionID).not.to.be.undefined;
                    expect(t.aisleID).not.to.be.undefined;
                    expect(t.row).not.to.be.undefined;
                    expect(t.col).not.to.be.undefined;
                    expect(t.maxWeight).not.to.be.undefined;
                    expect(t.maxVolume).not.to.be.undefined;
                    expect(t.occupiedWeight).not.to.be.undefined;
                    expect(t.occupiedVolume).not.to.be.undefined;
                });
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


function updatePosition(expectedHTTPStatus, positionID, newAisleID, newRow, newCol,newMaxWeight, newMaxVolume, newOccupiedWeight, newOccupiedVolume, errorMessage) {
    it(`Updating position with params [${[...arguments]?.join(',')}]`, function (done) {
        let position = { newAisleID: newAisleID, newRow: newRow, newCol: newCol, newMaxWeight: newMaxWeight, newMaxVolume: newMaxVolume, newOccupiedWeight: newOccupiedWeight, newOccupiedVolume: newOccupiedVolume };
        let api = `/api/position/${positionID}`;
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

function updatePositionID(expectedHTTPStatus, positionID, newPositionID, errorMessage) {
    it(`Updating positionID with params [${[...arguments]?.join(',')}]`, function (done) {
        let api = `/api/position/${positionID}/changeID`;
        let position={newPositionID: newPositionID};
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



function deletePosition(expectedHTTPStatus, id, errorMessage) {
    it(`Deleting position with params [${[...arguments]?.join(',')}]`, function (done) {
        let api = `/api/position/${id}`;
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
