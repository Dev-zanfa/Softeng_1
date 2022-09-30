const TestResultDataLayer = require('../datalayers/testResultDataLayer');
const TestDescriptorDataLayer = require('../datalayers/testDescriptorDataLayer');
const SKUDataLayer = require('../datalayers/SKUDataLayer');
const SKUItemDataLayer = require('../datalayers/SKUItemDataLayer');
const TestResult = require('../dtos/testResultDTO');
const DBManager = require('../database/dbManager');
const { purgeAllTables, purgeTable } = require('./mocks/purgeUtils');

const dbManager = new DBManager("TEST");
const testResultDataLayer = new TestResultDataLayer(dbManager);
const testDescriptorDataLayer = new TestDescriptorDataLayer(dbManager);
const sKUDataLayer = new SKUDataLayer(dbManager);
const sKUItemDataLayer = new SKUItemDataLayer(dbManager);


describe('TestResult Data Layer Unit Tests', () => {
    beforeEach(async () => {
        dbManager.openConnection();
        await purgeAllTables(dbManager);

        let id = await sKUDataLayer.insertSku('ciao1', 100, 200, 'boh', 2.55, 10);
        await testDescriptorDataLayer.insertTestDescriptor('test1', 'test1 desc', id);
        id = await sKUDataLayer.insertSku('ciao2', 100, 200, 'boh', 2.55, 10);
        await testDescriptorDataLayer.insertTestDescriptor('test2', 'test2 desc', id);
        await testDescriptorDataLayer.insertTestDescriptor('test3', 'test3 desc', id);
        await sKUItemDataLayer.insertSkuItem('aaaaaaaabbbbbbbbccccccccdddddddd', 1, 1, '18/05/2022');
        await sKUItemDataLayer.insertSkuItem('aaaaaaaabbbbbbbbccccccccddddddd2', 2, 1, '18/05/2022');
        await testResultDataLayer.insertTestResult(1, '20/05/2022', '1', 'aaaaaaaabbbbbbbbccccccccdddddddd');
        await testResultDataLayer.insertTestResult(1, '21/05/2022', '0', 'aaaaaaaabbbbbbbbccccccccdddddddd');
        await testResultDataLayer.insertTestResult(2, '19/05/2022', '1', 'aaaaaaaabbbbbbbbccccccccddddddd2');
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

    test('TestResult Data Layer: Constructor test', () => {
        let dl = new TestResultDataLayer(dbManager);
        expect(dl).not.toBeNull();

        expect(() => new TestResultDataLayer(null)).toThrow('DbManager must be defined for test result data layer!');
    });

    test('TestResult Data Layer: Get all test results by rfid test', async () => {
        let res = await testResultDataLayer.getAllTestResults('aaaaaaaabbbbbbbbccccccccdddddddd');
        expect(res).toEqual(
            [
                new TestResult(1, 1, '20/05/2022', '1'),
                new TestResult(2, 1, '21/05/2022', '0')
            ]
        );

        res = await testResultDataLayer.getAllTestResults('wrong');
        expect(res).toEqual([]);

        dbManager.closeConnection();
        await expect(testResultDataLayer.getAllTestResults('throws')).rejects.toThrow();
    });

    test('TestResult Data Layer: Get test result by id test', async () => {
        let res = await testResultDataLayer.getTestResult('aaaaaaaabbbbbbbbccccccccdddddddd', 2);
        expect(res).toEqual(new TestResult(2, 1, '21/05/2022', '0'));

        res = await testResultDataLayer.getTestResult('wrong', 4);
        expect(res).toBeUndefined();

        dbManager.closeConnection();
        await expect(testResultDataLayer.getTestResult('throws', 'anyway')).rejects.toThrow();
    });

    test('TestResult Data Layer: Insert test result test', async () => {
        let res = await testResultDataLayer.getTestResult('aaaaaaaabbbbbbbbccccccccdddddddd', 4);
        expect(res).toBeUndefined();

        let id = await testResultDataLayer.insertTestResult(1, '23/05/2022', '0', 'aaaaaaaabbbbbbbbccccccccdddddddd');
        expect(id).toEqual(4);

        let testRes = await testResultDataLayer.getTestResult('aaaaaaaabbbbbbbbccccccccdddddddd', 4);
        expect(testRes).toEqual(new TestResult(4, 1, '23/05/2022', '0', ));

        dbManager.closeConnection();
        await expect(testResultDataLayer.insertTestResult('it', 'throws', 'anyway', '!')).rejects.toThrow();
    });

    test('TestResult Data Layer: Update test result test', async () => {
        let res = await testResultDataLayer.getTestResult('aaaaaaaabbbbbbbbccccccccdddddddd', 2);
        expect(res).toEqual(new TestResult(2, 1, '21/05/2022', '0'));

        await testResultDataLayer.updateTestResult(1, '24/05/2022', '1', 'aaaaaaaabbbbbbbbccccccccdddddddd', 2);

        let testRes = await testResultDataLayer.getTestResult('aaaaaaaabbbbbbbbccccccccdddddddd', 2);
        expect(testRes).toEqual(new TestResult(2, 1, '24/05/2022', '1'));

        dbManager.closeConnection();
        await expect(testResultDataLayer.updateTestResult('it', 'throws', 'anyway', 'whichever', 'input')).rejects.toThrow();
    });

    test('TestResult Data Layer: Delete test result test', async () => {
        let res = await testResultDataLayer.getTestResult('aaaaaaaabbbbbbbbccccccccdddddddd', 2);
        expect(res).toEqual(new TestResult(2, 1, '21/05/2022', '0'));

        await testResultDataLayer.deleteTestResult('aaaaaaaabbbbbbbbccccccccdddddddd', 2);

        let testRes = await testResultDataLayer.getTestResult('aaaaaaaabbbbbbbbccccccccdddddddd', 2);
        expect(testRes).toBeUndefined();

        dbManager.closeConnection();
        await expect(testResultDataLayer.deleteTestResult('it', 'throws')).rejects.toThrow();
    });
});