const Position = require('../dtos/positionDTO');
const DBManager = require('../database/dbManager');
const PositionDataLayer = require('../datalayers/positionDataLayer');
const { purgeTable } = require('./mocks/purgeUtils');

const dbManager = new DBManager("TEST");
const positionDataLayer = new PositionDataLayer(dbManager);

describe('Position Data Layer Unit Tests', () => {
    beforeAll(() => { dbManager.openConnection(); });
    beforeEach(async () => {
        dbManager.openConnection();
        await purgeTable(dbManager, 'POSITIONS');
        await positionDataLayer.insertPosition("800234543412", "8002", "3454", "3412", 1000, 1000, 100, 100);
        await positionDataLayer.insertPosition("800234543413", "8002", "3454", "3413", 800, 800, 700, 700);
        await positionDataLayer.insertPosition("800234543414", "8002", "3454", "3414", 100, 100, 50, 50);
    });

    afterEach(async () => {
        try {
            await purgeAllTables(dbManager);
            dbManager.closeConnection();
        } catch {/*foo*/ }
    });

    test('Constructor test', () => {
        expect(() => new PositionDataLayer())
            .toThrow('DbManager must be defined for position data layer!');
    });

    test('Get all Positions', async () => {
        let res = await positionDataLayer.getAllPositions();
        expect(res).toEqual(
            [
                new Position(800234543412, 8002, 3454, 3412, 1000, 1000, 100, 100),
                new Position(800234543413, 8002, 3454, 3413, 800, 800, 700, 700),
                new Position(800234543414, 8002, 3454, 3414, 100, 100, 50, 50),
            ]
        );
        await positionDataLayer.deletePosition(800234543412);
        await positionDataLayer.deletePosition(800234543413);
        res = await positionDataLayer.getAllPositions();
        expect(res).toEqual([
            new Position(800234543414, 8002, 3454, 3414, 100, 100, 50, 50),]
        );

        dbManager.closeConnection();
        await expect(positionDataLayer.getAllPositions()).rejects.toThrow();
    });

    test('Get Position by ID', async () => { //not in API
        let res = await positionDataLayer.getPosition(800234543412);
        expect(res).toEqual(
            new Position(800234543412, 8002, 3454, 3412, 1000, 1000, 100, 100)
        );

        dbManager.closeConnection();
        await expect(positionDataLayer.getPosition()).rejects.toThrow();
    });

    test('Add a new position', async () => {
        let pos = new Position(800134543412, 8001, 3454, 3412, 1000, 1000, 50, 50);
        let id = await positionDataLayer.insertPosition("800134543412", "8001", "3454", "3412", 1000, 1000, 50, 50);
        expect(pos).toEqual(await positionDataLayer.getPosition(800134543412));
        dbManager.closeConnection();
        await expect(positionDataLayer.insertPosition()).rejects.toThrow();
    });


    UpdatePosition(800234543412, 800134543412, "8001", "3454", "3412", 1000, 1000, 10, 10);
    function UpdatePosition(oldPositionID, newPositionID, newAisleID, newRow, newCol, newMaxWeight, newMaxVolume, newOccupiedWeight, newOccupiedVolume) {
        test('Update position', async () => {
            let pos = new Position(800134543412, 8001, 3454, 3412, 1000, 1000, 10, 10);
            await positionDataLayer.updatePosition(oldPositionID, newPositionID, newAisleID, newRow, newCol, newMaxWeight, newMaxVolume, newOccupiedWeight, newOccupiedVolume);
            expect(pos).toEqual(await positionDataLayer.getPosition(800134543412));

            dbManager.closeConnection();
            await expect(positionDataLayer.updatePosition()).rejects.toThrow();
        });
    }

    test('Update position ID', async () => {
        let pos = new Position(800134543413, 8001, 3454, 3413, 1000, 1000, 100, 100);
        await positionDataLayer.updatePositionID(800234543412, 800134543413, "8001", "3454", "3413");
        expect(pos).toEqual(await positionDataLayer.getPosition(800134543413));

        dbManager.closeConnection();
        await expect(positionDataLayer.updatePositionID()).rejects.toThrow();
    });

    test('Delete position', async () => {
        let pos = new Position(800234543412, 8002, 3454, 3412, 1000, 1000, 100, 100);
        expect(pos).toEqual(await positionDataLayer.getPosition(800234543412));
        await positionDataLayer.deletePosition(800234543412);
        expect(undefined).toEqual(await positionDataLayer.getPosition(800234543412));

        dbManager.closeConnection();
        await expect(positionDataLayer.deletePosition()).rejects.toThrow();
    });

})