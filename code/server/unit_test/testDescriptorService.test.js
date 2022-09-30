const TestDescriptorService = require('../services/testDescriptorService');
const TestDescriptorDataLayer = require('../datalayers/testDescriptorDataLayer');
const SKUDataLayer = require('../datalayers/SKUDataLayer');
const TestDescriptor = require('../dtos/testDescriptorDTO');
const DBManager = require('../database/dbManager');
const { purgeAllTables } = require('./mocks/purgeUtils');

const dbManager = new DBManager("TEST");
const testDescriptorDataLayer = new TestDescriptorDataLayer(dbManager);
const skuDataLayer = new SKUDataLayer(dbManager);
const testDescriptorServiceWithPersistence = new TestDescriptorService(testDescriptorDataLayer, skuDataLayer);

describe('Test Descriptor Service Integration Tests', () => {
    beforeEach(async () => {
        dbManager.openConnection();
        await purgeAllTables(dbManager);

        await skuDataLayer.insertSku('ciao', 10, 100, 'red', 9.99, 20);
        await skuDataLayer.insertSku('ciao 2', 10, 100, 'blue', 9.99, 20);
        await testDescriptorDataLayer.insertTestDescriptor('test 1', 'test desc 1', 1);
        await testDescriptorDataLayer.insertTestDescriptor('test 2', 'test desc 2', 1);
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
        expect(() => new TestDescriptorService())
            .toThrow('Test Descriptor data layer must be defined for Test descriptor service!');

        expect(() => new TestDescriptorService(new TestDescriptorDataLayer(dbManager)))
            .toThrow('SKU data layer must be defined for Test descriptor service!');
    });

    test('Get all testDescriptors', async () => {
        let res = await testDescriptorServiceWithPersistence.getAllTestDescriptors();
        expect(res).toEqual(
            [
                new TestDescriptor(1, 'test 1', 'test desc 1', 1),
                new TestDescriptor(2, 'test 2', 'test desc 2', 1)
            ]
        );

        dbManager.closeConnection();
        await expect(testDescriptorServiceWithPersistence.getAllTestDescriptors()).rejects.toThrow();
    });

    test('Get testDescriptor by id', async () => {
        let res = await testDescriptorServiceWithPersistence.getTestDescriptor(2);
        expect(res).toEqual(new TestDescriptor(2, 'test 2', 'test desc 2', 1));

        await expect(testDescriptorServiceWithPersistence.getTestDescriptor('a')).rejects.toEqual({
            returnCode: 22,
            message: 'validation of id failed'
        });

        await expect(testDescriptorServiceWithPersistence.getTestDescriptor(5)).rejects.toEqual({
            returnCode: 4,
            message: 'no test descriptor associated id'
        });
    });

    test('Insert testDescriptor', async () => {
        let testDescriptor = new TestDescriptor(3, 'test 3', 'test desc 3', 2);
        await testDescriptorServiceWithPersistence.addTestDescriptor('test 3', 'test desc 3', 2);
        await expect(testDescriptorServiceWithPersistence.getTestDescriptor(3)).resolves.toEqual(testDescriptor);

        await expect(testDescriptorServiceWithPersistence.addTestDescriptor(null, 'test desc 3', 2)).rejects.toEqual({
            returnCode: 22,
            message: 'validation of request body failed'
        });
        await expect(testDescriptorServiceWithPersistence.addTestDescriptor('test 3', null, 2)).rejects.toEqual({
            returnCode: 22,
            message: 'validation of request body failed'
        });
        await expect(testDescriptorServiceWithPersistence.addTestDescriptor('test 3', 'test desc 3', -1)).rejects.toEqual({
            returnCode: 22,
            message: 'validation of request body failed'
        });

        await expect(testDescriptorServiceWithPersistence.addTestDescriptor('test 3', 'test desc 3', 5)).rejects.toEqual({
            returnCode: 4,
            message: 'no sku associated idSKU'
        });
    });

    test('Update testDescriptor', async () => {
        let testDescriptor = new TestDescriptor(2, 'test 2.1', 'test desc 2.1', 2);
        await testDescriptorServiceWithPersistence.updateTestDescriptor(2, 'test 2.1', 'test desc 2.1', 2);
        await expect(testDescriptorServiceWithPersistence.getTestDescriptor(2)).resolves.toEqual(testDescriptor);

        await expect(testDescriptorServiceWithPersistence.updateTestDescriptor(-5, 'test 2.1', 'test desc 2.1', 2)).rejects.toEqual({
            returnCode: 22,
            message: 'validation of request body or of id failed'
        });
        await expect(testDescriptorServiceWithPersistence.updateTestDescriptor(2, null, 'test desc 2.1', 2)).rejects.toEqual({
            returnCode: 22,
            message: 'validation of request body or of id failed'
        });
        await expect(testDescriptorServiceWithPersistence.updateTestDescriptor(2, 'test 2.1', null, 2)).rejects.toEqual({
            returnCode: 22,
            message: 'validation of request body or of id failed'
        });
        await expect(testDescriptorServiceWithPersistence.updateTestDescriptor(2, 'test 2.1', 'test desc 2.1', 'a')).rejects.toEqual({
            returnCode: 22,
            message: 'validation of request body or of id failed'
        });

        await expect(testDescriptorServiceWithPersistence.updateTestDescriptor(8, 'test 2.1', 'test desc 2.1', 2)).rejects.toEqual({
            returnCode: 4,
            message: 'no test descriptor associated id or no sku associated to IDSku'
        });
        await expect(testDescriptorServiceWithPersistence.updateTestDescriptor(2, 'test 2.1', 'test desc 2.1', 5)).rejects.toEqual({
            returnCode: 4,
            message: 'no test descriptor associated id or no sku associated to IDSku'
        });
    });

    test('Delete testDescriptor', async () => {
        let testDescriptor = new TestDescriptor(2, 'test 2', 'test desc 2', 1);
        await expect(testDescriptorServiceWithPersistence.getTestDescriptor(2)).resolves.toEqual(testDescriptor);
        await testDescriptorServiceWithPersistence.deleteTestDescriptor(2);
        await expect(testDescriptorDataLayer.getTestDescriptor(2)).resolves.toBeUndefined();

        await expect(testDescriptorServiceWithPersistence.deleteTestDescriptor(-1)).rejects.toEqual({
            returnCode: 22,
            message: 'validation of id failed'
        });
    });
});