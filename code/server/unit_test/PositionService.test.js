const PositionService = require('../services/positionService');
const PositionDataLayer = require('../datalayers/positionDataLayer');
const Position = require('../dtos/positionDTO');
const DBManager = require('../database/dbManager');
const { purgeAllTables } = require('./mocks/purgeUtils');
const { rejects } = require('assert');

const dbManager = new DBManager("TEST");
const positionDataLayer = new PositionDataLayer(dbManager);
const PositionServiceWithPersistence = new PositionService(positionDataLayer);


describe('Position Service Integration Tests', () => {

    beforeEach(async () => {
        dbManager.openConnection();
        await purgeAllTables(dbManager);

        await PositionServiceWithPersistence.addPosition("800234543412", "8002", "3454", "3412", 1000, 1000);
        await PositionServiceWithPersistence.addPosition("800234543413", "8002", "3454", "3413", 800, 800);
        await PositionServiceWithPersistence.addPosition("800234543414", "8002", "3454", "3414", 100, 100);
    });

    afterEach(async () => {
        try {
            await purgeAllTables(dbManager);
            dbManager.closeConnection();
        }
        catch {
            // Do nothing, avoid crashes if already closed
        }
    });

    test('Constructor throws if data layer null', () => {
        expect(() => new PositionService())
            .toThrow('Position data layer must be defined for Position service!');
    });

    test('Get all Positions', async () => {
        let res = await PositionServiceWithPersistence.getAllPositions();
        expect(res).toEqual(
            [
                new Position(800234543412, 8002, 3454, 3412, 1000, 1000, 0, 0),
                new Position(800234543413, 8002, 3454, 3413, 800, 800, 0, 0),
                new Position(800234543414, 8002, 3454, 3414, 100, 100, 0, 0),
            ]
        );

        dbManager.closeConnection();
        await expect(PositionServiceWithPersistence.getAllPositions()).rejects.toThrow();
    });

    test('Add a new position', async () => {
        let pos = new Position(800134543412, 8001, 3454, 3412, 1000, 1000, 0, 0);
        await PositionServiceWithPersistence.addPosition("800134543412", "8001", "3454", "3412", 1000, 1000);
        expect(pos).toEqual(await positionDataLayer.getPosition(800134543412));
    });

    AddPositionFail("800134543413", "8001", "3454", "3412", 1000, 1000);
    AddPositionFail("800134543413", "8001", "345", "3412", 1000, 1000);
    AddPositionFail("800134543413", "8001", "3454", "312", 1000, 1000);
    AddPositionFail("", "8001", "3454", "312", 1000, 1000);

    function AddPositionFail(positionId, aisleID, row, col, maxWeight, maxVolume) {
        test('Add a new position: wrong inputs', async () => {
            expect(() => PositionServiceWithPersistence.addPosition(positionId, aisleID, row, col, maxWeight, maxVolume))
                .rejects
                .toEqual({
                    returnCode: 22,
                    message: 'validation of request body failed'
                });
        });
    }

    UpdatePosition(800234543412, "8001", "3454", "3412", 1000, 1000, 10, 10);
    function UpdatePosition(positionId, newAisleID, newRow, newCol, newMaxWeight, newMaxVolume, newOccupiedWeight, newOccupiedVolume) {
        test('Update position', async () => {
            let pos = new Position(800134543412, 8001, 3454, 3412, 1000, 1000, 10, 10);
            await PositionServiceWithPersistence.updatePosition(positionId, newAisleID, newRow, newCol, newMaxWeight, newMaxVolume, newOccupiedWeight, newOccupiedVolume);
            expect(pos).toEqual(await positionDataLayer.getPosition(800134543412));
        });
    }

    UpdatePositionFail(800234543412, "800", "3454", "3412", 1000, 1000, 10, 10);
    UpdatePositionFail(800234543412, "8001", "345", "3412", 1000, 1000, 10, 10);
    UpdatePositionFail(800234543412, "8001", "3454", "341", 1000, 1000, 10, 10);
    UpdatePositionFail(800234543412, "8001", "3454", "3412", 1000, 1000, 10);
    UpdatePositionFail(800234543412, "8001", "3454", "3412", 1000, 1000, 10, "aaa");
    UpdatePositionFail(800234543412, "8001", "3454", "3412", 1000, 1000, 10, -1);
    UpdatePositionFail(800234543412, "8001", "3454", "3412", -1, 1000, 10, 10);
    UpdatePositionFail(800234543412, "8001", "3454", "3412", 1000, -1, 10, 10);
    UpdatePositionFail(800234543412, "8001", "3454", "3412", 1000, 1000, -10, 10);
    UpdatePositionFail(800234543412, "8001", "3454", "3412", 1000, "one", -10, 10);
    UpdatePositionFail(800234543412, "8001", "3454", "3412", "one", 1000, 10, 10);
    UpdatePositionFail(800234543412, "8001", "3454", "3412", 1000, 1000, "ten", 10);

    function UpdatePositionFail(positionId, newAisleID, newRow, newCol, newMaxWeight, newMaxVolume, newOccupiedWeight, newOccupiedVolume) {
        test('Update a position: wrong inputs', async () => {
            expect(() => PositionServiceWithPersistence.updatePosition(positionId, newAisleID, newRow, newCol, newMaxWeight, newMaxVolume, newOccupiedWeight, newOccupiedVolume))
                .rejects
                .toEqual({
                    returnCode: 22,
                    message: 'validation of request body or of positionID failed'
                });
        });
    }


    test('Update a position: wrong input id', async () => {
        expect(() => PositionServiceWithPersistence.updatePosition(800234543111, "8001", "3454", "3412", 1000, 1000, 10, 10))
            .rejects
            .toEqual({
                returnCode: 4,
                message: 'no position associated to positionID'
            });
    });

    test('Update position ID', async () => {
        let pos = new Position(800134543413, 8001, 3454, 3413, 1000, 1000, 0, 0);
        await PositionServiceWithPersistence.updatePositionID(800234543412, "800134543413");
        expect(pos).toEqual(await positionDataLayer.getPosition(800134543413));
    });

    test('Update position ID: wrong input id', async () => {
        expect(() => PositionServiceWithPersistence.updatePositionID(800234543111, "800134543412"))
            .rejects
            .toEqual({
                returnCode: 4,
                message: 'no position associated to positionID'
            });
    });


    updatePositionIDFail(-12, "80013454341222");
    updatePositionIDFail(80013454341222, "8001345434122");
    updatePositionIDFail(80013454341222, "a");
    updatePositionIDFail(80013454341222, "");
    
    function updatePositionIDFail(oldPosition, newPositionID) {
        test('Update a position: wrong input id', async () => {
            expect(() => PositionServiceWithPersistence.updatePositionID(oldPosition, newPositionID))
                .rejects
                .toEqual({
                    returnCode: 22,
                    message: 'validation of request body or of positionID failed'
                });
        });
    }

    test('Delete position', async () => {
        let pos = new Position(800234543412, 8002, 3454, 3412, 1000, 1000, 0, 0);
        expect(pos).toEqual(await positionDataLayer.getPosition(800234543412));
        await PositionServiceWithPersistence.deletePosition(800234543412);
        expect(undefined).toEqual(await positionDataLayer.getPosition(800234543412));
    });


    test('Delete position: wrong inputs', async () => {
        expect(() => PositionServiceWithPersistence.deletePosition("aaa"))
            .rejects
            .toEqual({
                returnCode: 22,
                message: 'validation of positionID failed'
            });
    });

});

