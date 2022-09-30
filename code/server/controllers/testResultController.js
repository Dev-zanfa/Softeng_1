'use strict';

const TestResultService = require('../services/testResultService');
const TestResultDataLayer = require('../datalayers/testResultDataLayer');
const TestDescriptorDataLayer = require('../datalayers/testDescriptorDataLayer');
const SKUItemDataLayer = require('../datalayers/SKUItemDataLayer');

class TestResultController {
    constructor(dbManager) {
        const testResDL = new TestResultDataLayer(dbManager);
        const testDescDL = new TestDescriptorDataLayer(dbManager);
        const skuItemDL = new SKUItemDataLayer(dbManager);
        this.service = new TestResultService(testResDL, testDescDL, skuItemDL);
    }

    async getAllTestResults(reqHeader) {
        let response = {};
        try {
            response.body = await this.service.getAllTestResults(reqHeader.rfid);
            response.returnCode = 200;
        }
        catch (err) {
            if (err && err.returnCode) {
                switch (err.returnCode) {
                    case 1:
                        response.returnCode = 401;
                        response.body = err.message;
                        break;
                    case 4:
                        response.returnCode = 404;
                        response.body = err.message;
                        break;
                    case 22:
                        response.returnCode = 422;
                        response.body = err.message;
                        break;
                    default:
                        throw err;
                }
            }
            else {
                throw err;
            }
        }

        return response;
    }

    async getTestResult(reqHeader) {
        let response = {};
        try {
            response.body = await this.service.getTestResult(reqHeader.rfid, reqHeader.id);
            response.returnCode = 200;
        }
        catch (err) {
            if (err && err.returnCode) {
                switch (err.returnCode) {
                    case 1:
                        response.returnCode = 401;
                        response.body = err.message;
                        break;
                    case 4:
                        response.returnCode = 404;
                        response.body = err.message;
                        break;
                    case 22:
                        response.returnCode = 422;
                        response.body = err.message;
                        break;
                    default:
                        throw err;
                }
            }
            else {
                throw err;
            }
        }

        return response;
    }

    async addTestResult(reqBody) {
        let response = {};
        try {
            await this.service.addTestResult(reqBody.rfid, reqBody.idTestDescriptor, reqBody.Date, reqBody.Result);
            response.body = {};
            response.returnCode = 201;
        }
        catch (err) {
            if (err && err.returnCode) {
                switch (err.returnCode) {
                    case 1:
                        response.returnCode = 401;
                        response.body = err.message;
                        break;
                    case 4:
                        response.returnCode = 404;
                        response.body = err.message;
                        break;
                    case 22:
                        response.returnCode = 422;
                        response.body = err.message;
                        break;
                    default:
                        throw err;
                }
            }
            else {
                throw err;
            }
        }

        return response;
    }

    async updateTestResult(reqHeader, reqBody) {
        let response = {};
        try {
            await this.service.updateTestResult(reqHeader.rfid, reqHeader.id, reqBody.newIdTestDescriptor, reqBody.newDate, reqBody.newResult);
            response.body = {};
            response.returnCode = 200;
        }
        catch (err) {
            if (err && err.returnCode) {
                switch (err.returnCode) {
                    case 1:
                        response.returnCode = 401;
                        response.body = err.message;
                        break;
                    case 4:
                        response.returnCode = 404;
                        response.body = err.message;
                        break;
                    case 22:
                        response.returnCode = 422;
                        response.body = err.message;
                        break;
                    default:
                        throw err;
                }
            }
            else {
                throw err;
            }
        }
        return response;
    }

    async deleteTestResult(reqHeader) {
        let response = {};
        try {
            await this.service.deleteTestResult(reqHeader.rfid, reqHeader.id);
            response.body = {};
            response.returnCode = 204;
        }
        catch (err) {
            if (err && err.returnCode) {
                switch (err.returnCode) {
                    case 1:
                        response.returnCode = 401;
                        response.body = err.message;
                        break;
                    case 22:
                        response.returnCode = 422;
                        response.body = err.message;
                        break;
                    default:
                        throw err;
                }
            }
            else {
                throw err;
            }
        }

        return response;
    }
}

module.exports = TestResultController;