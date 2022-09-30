'use strict';

const dayjs = require('dayjs');
var customParseFormat = require('dayjs/plugin/customParseFormat')
dayjs.extend(customParseFormat);

class TestResultService {

    constructor(testResDL, testDescDL, skuItemDL) {
        if (!testResDL)
            throw 'Test result data layer must be defined for Test result service!';

        if (!testDescDL)
            throw 'Test Descriptor data layer must be defined for Test result service!';

        if (!skuItemDL)
            throw 'SKU Item data layer must be defined for Test result service!';

        this.testResDL = testResDL;
        this.testDescDL = testDescDL;
        this.skuItemDL = skuItemDL;
    }

    async getAllTestResults(rfid) {
        try {
            if (!rfid || Number.isNaN(rfid) || Number.isNaN(Number.parseInt(rfid, 10)) || String(rfid).length != 32 ||rfid <= 0) {
                throw {
                    returnCode: 22,
                    message: 'validation of rfid failed'
                };
            }

            const associatedSkuItem = await this.skuItemDL.getSkuItem(rfid);

            if (!associatedSkuItem) {
                throw {
                    returnCode: 4,
                    message: 'no sku item associated to rfid'
                };
            }

            const response = await this.testResDL.getAllTestResults(rfid);

            return response;
        }
        catch (err) {
            throw err;
        }
    }

    async getTestResult(rfid, id) {
        try {
            if (!id || Number.isNaN(id) || Number.isNaN(Number.parseInt(id, 10)) || !Number.isInteger(Number(id)) || id <= 0 || !rfid ||
             Number.isNaN(rfid) || Number.isNaN(Number.parseInt(rfid, 10)) || String(rfid).length != 32 || rfid <= 0) {
                throw {
                    returnCode: 22,
                    message: 'validation of id or of rfid failed'
                };
            }

            const associatedSkuItem = await this.skuItemDL.getSkuItem(rfid);
            const testResult = await this.testResDL.getTestResult(rfid, id);

            if (!associatedSkuItem || !testResult) {

                throw {
                    returnCode: 4,
                    message: 'no test result associated to id or no sku item associated to rfid'
                };
            }

            return testResult;
        }
        catch (err) {
            throw err;
        }
    }

    async addTestResult(rfid, idTestDescriptor, date, result) {
        try {
            if (!date || !dayjs(date, ["YYYY/MM/DD HH:mm", "YYYY/MM/DD"], true).isValid() || result == null || typeof result != 'boolean' || !idTestDescriptor || Number.isNaN(idTestDescriptor) ||
             Number.isNaN(Number.parseInt(idTestDescriptor, 10)) || !Number.isInteger(Number(idTestDescriptor)) || idTestDescriptor <= 0 || !rfid || Number.isNaN(rfid) ||
              Number.isNaN(Number.parseInt(rfid, 10)) || rfid.length != 32 || rfid <= 0) {
                throw {
                    returnCode: 22,
                    message: 'validation of request body or of rfid failed'
                };
            }

            const associatedSkuItem = await this.skuItemDL.getSkuItem(rfid);
            const associatedTestDesc = await this.testDescDL.getTestDescriptor(idTestDescriptor);

            if (!associatedSkuItem || !associatedTestDesc) {

                throw {
                    returnCode: 4,
                    message: 'no sku item associated to rfid or no test descriptor associated to idTestDescriptor'
                };
            }

            const response = await this.testResDL.insertTestResult(idTestDescriptor, date, result, rfid);

            return response;
        }
        catch (err) {
            throw err;
        }
    }

    async updateTestResult(rfid, id, newidTestDescriptor, newDate, newResult) {
        try {
            if (!newDate || !dayjs(newDate).isValid() || newResult == null || (typeof newResult) != 'boolean'  || !newidTestDescriptor || Number.isNaN(newidTestDescriptor) ||
             Number.isNaN(Number.parseInt(newidTestDescriptor, 10)) || !Number.isInteger(Number(newidTestDescriptor)) || newidTestDescriptor <= 0  || !id || Number.isNaN(id) || 
             !Number.isInteger(Number(id)) || Number.isNaN(Number.parseInt(id, 10)) || id <= 0 || !rfid || Number.isNaN(rfid) || 
             Number.isNaN(Number.parseInt(rfid, 10)) || String(rfid).length != 32 || rfid <= 0) {
                throw {
                    returnCode: 22,
                    message: 'validation of request body, of id or of rfid failed'
                };
            }

            const associatedSkuItem = await this.skuItemDL.getSkuItem(rfid);
            const associatedTestDesc = await this.testDescDL.getTestDescriptor(newidTestDescriptor);
            const associatedTestResult = await this.testResDL.getTestResult(rfid, id);

            if (!associatedSkuItem || !associatedTestDesc || !associatedTestResult) {

                throw {
                    returnCode: 4,
                    message: 'no sku item associated to rfid or no test descriptor associated to newIdTestDescriptor or no test result associated to id'
                };
            }

            const response = await this.testResDL.updateTestResult(newidTestDescriptor, newDate, newResult, rfid, id);
            return response;
        }
        catch (err) {
            throw err;
        }
    }

    async deleteTestResult(rfid, id) {
        try {
            if (!id || Number.isNaN(id) || Number.isNaN(Number.parseInt(id, 10)) || !Number.isInteger(Number(id)) || id <= 0 || !rfid || Number.isNaN(rfid)
             || Number.isNaN(Number.parseInt(rfid, 10)) || String(rfid).length != 32 || rfid <= 0) {
                throw {
                    returnCode: 22,
                    message: 'validation of id or of rfid failed'
                };
            }

            const response = await this.testResDL.deleteTestResult(rfid, id);

            return response;
        }
        catch (err) {
            throw err;
        }
    }
}

module.exports = TestResultService;