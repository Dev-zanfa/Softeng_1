const TestResultService = require('../services/testResultService');
const TestResultDataLayer = require('../datalayers/testResultDataLayer');
const SKUDataLayer = require('../datalayers/SKUDataLayer');
const SKUItemDataLayer = require('../datalayers/SKUItemDataLayer');
const TestDescriptorDataLayer = require('../datalayers/testDescriptorDataLayer');
const TestResult = require('../dtos/testResultDTO');
const DBManager = require('../database/dbManager');
const { purgeAllTables } = require('./mocks/purgeUtils');

const dbManager = new DBManager("TEST");
const testResultDataLayer = new TestResultDataLayer(dbManager);
const testDescriptorDataLayer = new TestDescriptorDataLayer(dbManager);
const skuDataLayer = new SKUDataLayer(dbManager);
const skuItemDataLayer = new SKUItemDataLayer(dbManager);
const testResultServiceWithPersistence = new TestResultService(testResultDataLayer, testDescriptorDataLayer, skuItemDataLayer);

describe('Test Result Service Integration Tests', () => {
    beforeEach(async () => {
        dbManager.openConnection();
        await purgeAllTables(dbManager);

        await skuDataLayer.insertSku('ciao', 10, 100, 'red', 9.99, 20);
        await skuDataLayer.insertSku('ciao 2', 10, 100, 'blue', 9.99, 20);
        await testDescriptorDataLayer.insertTestDescriptor('test 1', 'test desc 1', 1);
        await testDescriptorDataLayer.insertTestDescriptor('test 2', 'test desc 2', 2);
        await skuItemDataLayer.insertSkuItem('12345678123456781234567812345678', 1, 1, '2020/05/18');
        await skuItemDataLayer.insertSkuItem('12345678123456781234567412345678', 2, 1, '2020/05/18');
        await testResultDataLayer.insertTestResult(1, '2020/05/19', true, '12345678123456781234567812345678');
        await testResultDataLayer.insertTestResult(2, '2020/05/19', false, '12345678123456781234567412345678');
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
        expect(() => new TestResultService())
            .toThrow('Test result data layer must be defined for Test result service!');

        expect(() => new TestResultService(new TestResultDataLayer(dbManager)))
            .toThrow('Test Descriptor data layer must be defined for Test result service!');

        expect(() => new TestResultService(new TestResultDataLayer(dbManager), new TestDescriptorDataLayer(dbManager)))
            .toThrow('SKU Item data layer must be defined for Test result service!');
    });

    test('Get all testResults by rfid', async () => {
        let res = await testResultServiceWithPersistence.getAllTestResults('12345678123456781234567812345678');
        expect(res).toEqual(
            [
                new TestResult(1, 1, '2020/05/19', true)
            ]
        );

        await expect(testResultServiceWithPersistence.getAllTestResults('a')).rejects.toEqual({
            returnCode: 22,
            message: 'validation of rfid failed'
        });

        await expect(testResultServiceWithPersistence.getAllTestResults('12345678123456781234567812345679')).rejects.toEqual({
            returnCode: 4,
            message: 'no sku item associated to rfid'
        });
    });

    test('Get testResult by rfid and id', async () => {
        let res = await testResultServiceWithPersistence.getTestResult('12345678123456781234567412345678', 2);
        expect(res).toEqual(new TestResult(2, 2, '2020/05/19', false));

        await expect(testResultServiceWithPersistence.getTestResult('1234567812345678123457412345678', 2)).rejects.toEqual({
            returnCode: 22,
            message: 'validation of id or of rfid failed'
        });

        await expect(testResultServiceWithPersistence.getTestResult('1234567812345678123457412345678', 'wrong')).rejects.toEqual({
            returnCode: 22,
            message: 'validation of id or of rfid failed'
        });

        await expect(testResultServiceWithPersistence.getTestResult('12345678123456781234567812345679', 2)).rejects.toEqual({
            returnCode: 4,
            message: 'no test result associated to id or no sku item associated to rfid'
        });

        await expect(testResultServiceWithPersistence.getTestResult('12345678123456781234567812345678', 5)).rejects.toEqual({
            returnCode: 4,
            message: 'no test result associated to id or no sku item associated to rfid'
        });
    });

    test('Insert testResult', async () => {
        let testResult = new TestResult(3, 1, '2020/06/19', false);
        await testResultServiceWithPersistence.addTestResult('12345678123456781234567812345678', 1, '2020/06/19', false);
        await expect(testResultServiceWithPersistence.getTestResult('12345678123456781234567812345678', 3)).resolves.toEqual(testResult);

        await expect(testResultServiceWithPersistence.addTestResult('123456781234567812345672345678', 1, '2020/06/19', false)).rejects.toEqual({
            returnCode: 22,
            message: 'validation of request body or of rfid failed'
        });
        await expect(testResultServiceWithPersistence.addTestResult('12345678123456781234567812345678', '5c', '2020/06/19', false)).rejects.toEqual({
            returnCode: 22,
            message: 'validation of request body or of rfid failed'
        });
        await expect(testResultServiceWithPersistence.addTestResult('12345678123456781234567812345678', 1, '2020/06/31', false)).rejects.toEqual({
            returnCode: 22,
            message: 'validation of request body or of rfid failed'
        });
        await expect(testResultServiceWithPersistence.addTestResult('12345678123456781234567812345678', 1, '2020/06/19', 'miao')).rejects.toEqual({
            returnCode: 22,
            message: 'validation of request body or of rfid failed'
        });

        await expect(testResultServiceWithPersistence.addTestResult('12345678123456781234567812345688', 1, '2020/06/19', false)).rejects.toEqual({
            returnCode: 4,
            message: 'no sku item associated to rfid or no test descriptor associated to idTestDescriptor'
        });
        await expect(testResultServiceWithPersistence.addTestResult('12345678123456781234567812345678', 77, '2020/06/19', false)).rejects.toEqual({
            returnCode: 4,
            message: 'no sku item associated to rfid or no test descriptor associated to idTestDescriptor'
        });
    });

    test('Update testResult', async () => {
        let testResult = new TestResult(2, 2, '2020/05/19', true);
        await testResultServiceWithPersistence.updateTestResult('12345678123456781234567412345678', 2, 2, '2020/05/19', true);
        await expect(testResultServiceWithPersistence.getTestResult('12345678123456781234567412345678', 2)).resolves.toEqual(testResult);

        await expect(testResultServiceWithPersistence.updateTestResult('1234567812345678123567412345678', 2, 2, '2020/05/19', true)).rejects.toEqual({
            returnCode: 22,
            message: 'validation of request body, of id or of rfid failed'
        });
        await expect(testResultServiceWithPersistence.updateTestResult('12345678123456781234567412345678', 'd', 2, '2020/05/19', true)).rejects.toEqual({
            returnCode: 22,
            message: 'validation of request body, of id or of rfid failed'
        });
        await expect(testResultServiceWithPersistence.updateTestResult('12345678123456781234567412345678', 2, true, '2020/05/19', true)).rejects.toEqual({
            returnCode: 22,
            message: 'validation of request body, of id or of rfid failed'
        });
        await expect(testResultServiceWithPersistence.updateTestResult('12345678123456781234567412345678', 2, 2, null, true)).rejects.toEqual({
            returnCode: 22,
            message: 'validation of request body, of id or of rfid failed'
        });
        await expect(testResultServiceWithPersistence.updateTestResult('12345678123456781234567412345678', 2, 2, '2020/05/19', null)).rejects.toEqual({
            returnCode: 22,
            message: 'validation of request body, of id or of rfid failed'
        });        

        await expect(testResultServiceWithPersistence.updateTestResult('12345678123456781234567412345679', 2, 2, '2020/05/19', true)).rejects.toEqual({
            returnCode: 4,
            message: 'no sku item associated to rfid or no test descriptor associated to newIdTestDescriptor or no test result associated to id'
        });
        await expect(testResultServiceWithPersistence.updateTestResult('12345678123456781234567412345678', 8, 2, '2020/05/19', true)).rejects.toEqual({
            returnCode: 4,
            message: 'no sku item associated to rfid or no test descriptor associated to newIdTestDescriptor or no test result associated to id'
        });
        await expect(testResultServiceWithPersistence.updateTestResult('12345678123456781234567412345678', 2, 99, '2020/05/19', true)).rejects.toEqual({
            returnCode: 4,
            message: 'no sku item associated to rfid or no test descriptor associated to newIdTestDescriptor or no test result associated to id'
        });
    });

    test('Delete testResult', async () => {
        let testResult = new TestResult(2, 2, '2020/05/19', false);
        await expect(testResultServiceWithPersistence.getTestResult('12345678123456781234567412345678', 2)).resolves.toEqual(testResult);
        await testResultServiceWithPersistence.deleteTestResult('12345678123456781234567412345678', 2);
        await expect(testResultDataLayer.getTestResult('12345678123456781234567412345678', 2)).resolves.toBeUndefined();

        await expect(testResultServiceWithPersistence.deleteTestResult('123456781234567812567412345678', 2)).rejects.toEqual({
            returnCode: 22,
            message: 'validation of id or of rfid failed'
        });
        await expect(testResultServiceWithPersistence.deleteTestResult('12345678123456781234567412345678', -5)).rejects.toEqual({
            returnCode: 22,
            message: 'validation of id or of rfid failed'
        });
    });
});