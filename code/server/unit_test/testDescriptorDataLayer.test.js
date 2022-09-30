const TestDescriptorDataLayer = require('../datalayers/testDescriptorDataLayer');
const SKUDataLayer = require('../datalayers/SKUDataLayer');
const TestDescriptor = require('../dtos/testDescriptorDTO');
const DBManager = require('../database/dbManager');
const { purgeAllTables, purgeTable } = require('./mocks/purgeUtils');

const dbManager = new DBManager("TEST");
const testDescriptorDataLayer = new TestDescriptorDataLayer(dbManager);
const sKUDataLayer = new SKUDataLayer(dbManager);


describe('TestDescriptor Data Layer Unit Tests', () => {
    beforeEach(async () => {
        dbManager.openConnection();
        await purgeAllTables(dbManager);

        let id = await sKUDataLayer.insertSku('ciao1', 100, 200, 'boh', 2.55, 10);
        await testDescriptorDataLayer.insertTestDescriptor('test1', 'test1 desc', id);
        id = await sKUDataLayer.insertSku('ciao2', 100, 200, 'boh', 2.55, 10);
        await testDescriptorDataLayer.insertTestDescriptor('test2', 'test2 desc', id);
        await testDescriptorDataLayer.insertTestDescriptor('test3', 'test3 desc', id);
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

    test('TestDescriptor Data Layer: Constructor test', () => {
        let dl = new TestDescriptorDataLayer(dbManager);
        expect(dl).not.toBeNull();

        expect(() => new TestDescriptorDataLayer(null)).toThrow('DbManager must be defined for test descriptor data layer!');
    });

    test('TestDescriptor Data Layer: Get all test descriptors test', async () => {
        let res = await testDescriptorDataLayer.getAllTestDescriptors();
        expect(res).toEqual(
            [
                new TestDescriptor(1, 'test1', 'test1 desc', 1),
                new TestDescriptor(2, 'test2', 'test2 desc', 2),
                new TestDescriptor(3, 'test3', 'test3 desc', 2)
            ]
        );

        await purgeTable(dbManager, 'TEST_DESCRIPTORS');

        res = await testDescriptorDataLayer.getAllTestDescriptors();
        expect(res).toEqual([]);

        dbManager.closeConnection();
        await expect(testDescriptorDataLayer.getAllTestDescriptors()).rejects.toThrow();
    });

    test('TestDescriptor Data Layer: Get test descriptor by id test', async () => {
        let res = await testDescriptorDataLayer.getTestDescriptor(2);
        expect(res).toEqual(new TestDescriptor(2, 'test2', 'test2 desc', 2));

        res = await testDescriptorDataLayer.getTestDescriptor(4);
        expect(res).toBeUndefined();

        dbManager.closeConnection();
        await expect(testDescriptorDataLayer.getTestDescriptor(1)).rejects.toThrow();
    });

    test('TestDescriptor Data Layer: Insert test descriptor test', async () => {
        let res = await testDescriptorDataLayer.getTestDescriptor(4);
        expect(res).toBeUndefined();

        let id = await testDescriptorDataLayer.insertTestDescriptor('test4', 'test4 desc', 1);
        expect(id).toEqual(4);

        let testDesc = await testDescriptorDataLayer.getTestDescriptor(4);
        expect(testDesc).toEqual(new TestDescriptor(4, 'test4', 'test4 desc', 1));

        dbManager.closeConnection();
        await expect(testDescriptorDataLayer.insertTestDescriptor('it', 'throws', 'anyway')).rejects.toThrow();
    });

    test('TestDescriptor Data Layer: Update test descriptor test', async () => {
        let res = await testDescriptorDataLayer.getTestDescriptor(1);
        expect(res).toEqual(new TestDescriptor(1, 'test1', 'test1 desc', 1));

        await testDescriptorDataLayer.updateTestDescriptor(1, 'test1.1', 'test1.1', 2);

        let testDesc = await testDescriptorDataLayer.getTestDescriptor(1);
        expect(testDesc).toEqual(new TestDescriptor(1, 'test1.1', 'test1.1', 2));

        dbManager.closeConnection();
        await expect(testDescriptorDataLayer.updateTestDescriptor('it', 'throws', 'anyway', 'whichever')).rejects.toThrow();
    });

    test('TestDescriptor Data Layer: Delete test descriptor test', async () => {
        let res = await testDescriptorDataLayer.getTestDescriptor(1);
        expect(res).toEqual(new TestDescriptor(1, 'test1', 'test1 desc', 1));

        await testDescriptorDataLayer.deleteTestDescriptor(1);

        let testDesc = await testDescriptorDataLayer.getTestDescriptor(1);
        expect(testDesc).toBeUndefined();

        dbManager.closeConnection();
        await expect(testDescriptorDataLayer.deleteTestDescriptor('throws')).rejects.toThrow();
    });
});