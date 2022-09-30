'use strict';

const TestDescriptorService = require('../services/testDescriptorService');
const TestDescriptorDataLayer = require('../datalayers/testDescriptorDataLayer');
const SKUDataLayer = require('../datalayers/SKUDataLayer');

class TestDescriptorController {
    constructor(dbManager) {
        const testDescDL = new TestDescriptorDataLayer(dbManager);
        const skuDL = new SKUDataLayer(dbManager);
        this.service = new TestDescriptorService(testDescDL, skuDL);
    }

    async getAllTestDescriptors() {
        let response = {};
        try {
            response.body = await this.service.getAllTestDescriptors();
            response.returnCode = 200;
        }
        catch (err) {
            if (err && err.returnCode) {
                switch (err.returnCode) {
                    case 1:
                        response.returnCode = 401;
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

    async getTestDescriptor(reqHeader) {
        let response = {};
        try {
            response.body = await this.service.getTestDescriptor(reqHeader.id);
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

    async addTestDescriptor(reqBody) {
        let response = {};
        try {
            await this.service.addTestDescriptor(reqBody.name, reqBody.procedureDescription, reqBody.idSKU);
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

    async updateTestDescriptor(reqHeader, reqBody) {
        let response = {};
        try {
            await this.service.updateTestDescriptor(reqHeader.id, reqBody.newName, reqBody.newProcedureDescription, reqBody.newIdSKU);
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

    async deleteTestDescriptor(reqHeader) {
        let response = {};
        try {
            await this.service.deleteTestDescriptor(reqHeader.id);
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

module.exports = TestDescriptorController;