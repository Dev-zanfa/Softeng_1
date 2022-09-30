const RestockOrderService = require('../services/restockOrderService');
const RestockOrderDataLayer = require('../datalayers/restockOrderDataLayer');
const ItemDataLayer = require('../datalayers/itemDataLayer');
const SKUItemDataLayer = require('../datalayers/SKUItemDataLayer');
const SKUDataLayer = require('../datalayers/SKUDataLayer');
const TestResultDataLayer = require('../datalayers/testResultDataLayer');
const TestDescriptorDataLayer = require('../datalayers/testDescriptorDataLayer');
const RestockOrder = require('../dtos/restockOrderDTO');
const DBManager = require('../database/dbManager');
const { purgeAllTables } = require('./mocks/purgeUtils');

const dbManager = new DBManager("TEST");
const restockOrderDataLayer = new RestockOrderDataLayer(dbManager);
const itemDataLayer = new ItemDataLayer(dbManager);
const skuItemDataLayer = new SKUItemDataLayer(dbManager);
const skuDataLayer = new SKUDataLayer(dbManager);
const testResultDataLayer = new TestResultDataLayer(dbManager);
const testDescriptorDataLayer = new TestDescriptorDataLayer(dbManager);
const restockOrderWithPersistence = new RestockOrderService(restockOrderDataLayer, testResultDataLayer);

describe('Restock Order Service Integration Tests', () => {

    beforeEach(async () => {
        dbManager.openConnection();
        await purgeAllTables(dbManager);

        await skuDataLayer.insertSku('ciao', 10, 100, 'red', 9.99, 20);
        await skuDataLayer.insertSku('ciao 2', 10, 100, 'blue', 9.99, 20);
        await testDescriptorDataLayer.insertTestDescriptor('test 1', 'test desc 1', 1);
        await testDescriptorDataLayer.insertTestDescriptor('test 2', 'test desc 2', 2);
        await skuItemDataLayer.insertSkuItem('12345678123456781234567812345678', 1, 1, '2020/05/18');
        await skuItemDataLayer.insertSkuItem('12345678901234567890123456789017', 12, 1, '2020/05/18');
        await skuItemDataLayer.insertSkuItem('12345678901234567890123456789016', 12, 1, '2020/05/18');
        await skuItemDataLayer.insertSkuItem('12345678123456781234567412345678', 1, 1, '2020/05/18');
        await testResultDataLayer.insertTestResult(1, '2020/05/19', false, '12345678123456781234567812345678');
        await testResultDataLayer.insertTestResult(2, '2020/05/19', true, '12345678123456781234567412345678');
        await itemDataLayer.insertItem(1, "item one", 10, 1, 1);
        await itemDataLayer.insertItem(2, "item two", 10, 2, 1);
        await restockOrderDataLayer.addRestockOrder("2021/11/29 09:33", 1);
        await restockOrderDataLayer.addProducts(1, 1, 10);
        await restockOrderDataLayer.updateRestockOrderTransportNote(1, "2021/12/29");
        await restockOrderDataLayer.updateRestockOrderSkuItems("12345678123456781234567812345678", 1, 1);
        await restockOrderDataLayer.addRestockOrder("2022/11/29 09:33", 2);
        await restockOrderDataLayer.addProducts(2, 2, 10);
    });

    afterEach(async () => {
        try {
            await purgeAllTables(dbManager);
            dbManager.closeConnection();
        }
        catch {/*foo*/ }
    });

    test('Constructor throws if data layer null', () => {
        expect(() => new RestockOrderService())
            .toThrow('Restock Order data layer must be defined for Restock Order service!');

        expect(() => new RestockOrderService(new RestockOrderDataLayer(dbManager)))
            .toThrow('Test result data layer must be defined for Restock Order service!');
    });

    test('Get all Restock Orders', async () => {
        let res = await restockOrderWithPersistence.getAllRestockOrders();
        expect(res).toEqual(
            [
                new RestockOrder(1, "2021/11/29 09:33", "ISSUED", [{ "SKUId": 1, "description": "item one", "price": 10, "qty": 10, },], 1, { "deliveryDate": "2021/12/29" }, [{ "SKUId": 1, "rfid": "12345678123456781234567812345678", },]),
                new RestockOrder(2, "2022/11/29 09:33", "ISSUED", [], 2, "", []),
            ]
        );
        dbManager.closeConnection();
        await expect(restockOrderWithPersistence.getAllRestockOrders()).rejects.toThrow();
    });

    test('Get all restock Orders by state', async () => {
        let res = await restockOrderWithPersistence.getAllRestockOrdersByState("ISSUED")
        expect(res).toEqual(
            [
                new RestockOrder(1, "2021/11/29 09:33", "ISSUED", [{ "SKUId": 1, "description": "item one", "price": 10, "qty": 10, },], 1, { "deliveryDate": "2021/12/29" }, [{ "SKUId": 1, "rfid": "12345678123456781234567812345678", },]),
                new RestockOrder(2, "2022/11/29 09:33", "ISSUED", [], 2, "", []),
            ]
        );

        dbManager.closeConnection();
        await expect(restockOrderWithPersistence.getAllRestockOrdersByState("ISSUED")).rejects.toThrow();
    });

    test('Get Restock Order by id', async () => {
        let res = await restockOrderWithPersistence.getRestockOrder(1);
        expect(res).toEqual(
            new RestockOrder(1, "2021/11/29 09:33", "ISSUED", [{ "SKUId": 1, "description": "item one", "price": 10, "qty": 10, },], 1, { "deliveryDate": "2021/12/29" }, [{ "SKUId": 1, "rfid": "12345678123456781234567812345678", },])
        );

        await expect(restockOrderWithPersistence.getRestockOrder('a')).rejects.toEqual({
            returnCode: 22,
            message: 'validation of id failed'
        });

        await expect(restockOrderWithPersistence.getRestockOrder(100)).rejects.toEqual({
            returnCode: 4,
            message: 'no restock order associated to id'
        });
        dbManager.closeConnection();
        await expect(restockOrderWithPersistence.getRestockOrder(1)).rejects.toThrow();

    });

    test('Get restock Orders SKUItems to return', async () => {
        await expect(restockOrderWithPersistence.getRestockOrderSKUItemsToReturn('a')).rejects.toEqual({
            returnCode: 22,
            message: 'validation of id failed or restock order state != COMPLETEDRETURN'
        });
        await expect(restockOrderWithPersistence.getRestockOrderSKUItemsToReturn(1)).rejects.toEqual({
            returnCode: 22,
            message: 'validation of id failed or restock order state != COMPLETEDRETURN'
        });

        await expect(restockOrderWithPersistence.getRestockOrderSKUItemsToReturn(100)).rejects.toEqual({
            returnCode: 4,
            message: 'no restock order associated to id'
        });

        await restockOrderDataLayer.updateRestockOrderSkuItems("12345678123456781234567412345678", 1, 1);
        await restockOrderWithPersistence.updateRestockOrder(1, "COMPLETEDRETURN");
        let res = await restockOrderWithPersistence.getRestockOrderSKUItemsToReturn(1);
        expect(res).toEqual(
            [{ "SKUId": 1, "rfid": "12345678123456781234567812345678" }]
        );
        dbManager.closeConnection();
        await expect(restockOrderWithPersistence.updateRestockOrder(1, "COMPLETEDRETURN")).rejects.toThrow();

    });

    test('add restock Order', async () => {
        await expect(restockOrderWithPersistence.addRestockOrder(null, [{ "SKUId": 12, "description": "a product", "price": 10.99, "qty": 30 }, { "SKUId": 180, "description": "another product", "price": 11.99, "qty": 20 }], 1)).rejects.toEqual({
            returnCode: 22,
            message: 'validation of request body failed'
        });
        await expect(restockOrderWithPersistence.addRestockOrder("2021/15/29 09:33", [{ "SKUId": 12, "description": "a product", "price": 10.99, "qty": 30 }, { "SKUId": 180, "description": "another product", "price": 11.99, "qty": 20 }], 1)).rejects.toEqual({
            returnCode: 22,
            message: 'validation of request body failed'
        });
        await expect(restockOrderWithPersistence.addRestockOrder("2021/11/29 09:33", [{ "SKUId": 12, "description": "a product", "price": -1, "qty": 30 }, { "SKUId": 180, "description": "another product", "price": 11.99, "qty": 20 }], 1)).rejects.toEqual({
            returnCode: 22,
            message: 'validation of request body failed'
        });

        let ro = new RestockOrder(3, "2021/11/29 09:33", "ISSUED", [], 1, "", []);
        await expect(restockOrderWithPersistence.addRestockOrder("2021/11/29 09:33", [{ "SKUId": 12, "description": "a product", "price": 10.99, "qty": 30 }, { "SKUId": 180, "description": "another product", "price": 11.99, "qty": 20 }], 1));
        let res = await restockOrderWithPersistence.getRestockOrder(3);
        await expect(restockOrderWithPersistence.getRestockOrder(3)).resolves.toEqual(ro);

        dbManager.closeConnection();
        await expect(restockOrderWithPersistence.addRestockOrder("2021/11/29 09:33", [{ "SKUId": 12, "description": "a product", "price": 10.99, "qty": 30 }, { "SKUId": 180, "description": "another product", "price": 11.99, "qty": 20 }], 1)).rejects.toThrow();

    });

    test('update restock order', async () => {
        await expect(restockOrderWithPersistence.updateRestockOrder("aa", "DELIVERED")).rejects.toEqual({
            returnCode: 22,
            message: 'validation of request body or of id failed'
        });
        await expect(restockOrderWithPersistence.updateRestockOrder(1, "DELERED")).rejects.toEqual({
            returnCode: 22,
            message: 'validation of request body or of id failed'
        });
        await expect(restockOrderWithPersistence.updateRestockOrder(100, "DELIVERED")).rejects.toEqual({
            returnCode: 4,
            message: 'no restock order associated to id'
        });

        let ro = new RestockOrder(2, "2022/11/29 09:33", "DELIVERED", [], 2, "", []);
        await restockOrderWithPersistence.updateRestockOrder(2, "DELIVERED");
        await expect(restockOrderWithPersistence.getRestockOrder(2)).resolves.toEqual(ro);
        dbManager.closeConnection();
        await expect(restockOrderWithPersistence.updateRestockOrder(100, "DELIVERED")).rejects.toThrow();
    });

    test('add non empty list of skuItems to a restock order', async () => {
        await expect(restockOrderWithPersistence.updateRestockOrderSkuItems(1, [{ "SKUId": 12, "rfid": "12345678901234567890123456789016" }, { "SKUId": 12, "rfid": "12345678901234567890123456789017" }])).rejects.toEqual({
            returnCode: 22,
            message: 'validation of request body or of id failed or order state != DELIVERED'
        });
        await expect(restockOrderWithPersistence.updateRestockOrderSkuItems("aa", [{ "SKUId": 12, "rfid": "12345678901234567890123456789016" }, { "SKUId": 12, "rfid": "12345678901234567890123456789017" }])).rejects.toEqual({
            returnCode: 22,
            message: 'validation of request body or of id failed or order state != DELIVERED'
        });
        await expect(restockOrderWithPersistence.updateRestockOrderSkuItems(1, [{ "SKUId": null, "rfid": "12345678901234567890123456789016" }, { "SKUId": 12, "rfid": "12345678901234567890123456789017" }])).rejects.toEqual({
            returnCode: 22,
            message: 'validation of request body or of id failed or order state != DELIVERED'
        });
        await expect(restockOrderWithPersistence.updateRestockOrderSkuItems(100, [{ "SKUId": null, "rfid": "12345678901234567890123456789016" }, { "SKUId": 12, "rfid": "12345678901234567890123456789017" }])).rejects.toEqual({
            returnCode: 4,
            message: 'no restock order associated to id'
        });
        await restockOrderWithPersistence.updateRestockOrder(1, "DELIVERED");
        await expect(restockOrderWithPersistence.updateRestockOrderSkuItems(1, [{ "SKUId": null, "rfid": "1234567890123456789012345678901" }, { "SKUId": 12, "rfid": "12345678901234567890123456789017" }])).rejects.toEqual({
            returnCode: 22,
            message: 'validation of request body or of id failed or order state != DELIVERED'
        });
        let ro = new RestockOrder(1, "2021/11/29 09:33", "DELIVERED", [{ "SKUId": 1, "description": "item one", "price": 10, "qty": 10 }], 1, { "deliveryDate": "2021/12/29" }, [{ "SKUId": 1, "rfid":"12345678123456781234567812345678"  }, { "SKUId": 12, "rfid": "12345678901234567890123456789017" }, { "SKUId": 12, "rfid": "12345678901234567890123456789016" }]);
        await restockOrderWithPersistence.updateRestockOrderSkuItems(1, [{ "SKUId": 12, "rfid": "12345678901234567890123456789016" }, { "SKUId": 12, "rfid": "12345678901234567890123456789017" }]);
        await expect(restockOrderWithPersistence.getRestockOrder(1)).resolves.toEqual(ro);
        dbManager.closeConnection();
        await expect(restockOrderWithPersistence.updateRestockOrderSkuItems(100, [{ "SKUId": null, "rfid": "12345678901234567890123456789016" }, { "SKUId": 12, "rfid": "12345678901234567890123456789017" }])).rejects.toThrow();
    });

    test('add transport note to a restock order', async () => {
        await expect(restockOrderWithPersistence.updateRestockOrderTransportNote("aa", {"deliveryDate": "2021/12/29"})).rejects.toEqual({
            returnCode: 22,
            message: 'validation of request body or of id failed or order state != DELIVERY or deliveryDate is before issueDate'
        });
        await expect(restockOrderWithPersistence.updateRestockOrderTransportNote(1, {"deliveryDate": "2021/12/29"})).rejects.toEqual({
            returnCode: 22,
            message: 'validation of request body or of id failed or order state != DELIVERY or deliveryDate is before issueDate'
        });
        await expect(restockOrderWithPersistence.updateRestockOrderTransportNote(1, {"deliveryDate": "2021/12/29"})).rejects.toEqual({
            returnCode: 22,
            message: 'validation of request body or of id failed or order state != DELIVERY or deliveryDate is before issueDate'
        });
        await expect(restockOrderWithPersistence.updateRestockOrderTransportNote(1, {"deliveryDate": "1999/12/30"})).rejects.toEqual({
            returnCode: 22,
            message: 'validation of request body or of id failed or order state != DELIVERY or deliveryDate is before issueDate'
        });
        await expect(restockOrderWithPersistence.updateRestockOrderTransportNote(100, {"deliveryDate": "2021/12/30"})).rejects.toEqual({
            returnCode: 4,
            message: 'no restock order associated to id'
        });
        await expect(restockOrderWithPersistence.updateRestockOrderTransportNote(100, {"deliveryDate": "2022/15/28"})).rejects.toEqual({
            returnCode: 22,
            message: 'validation of request body or of id failed or order state != DELIVERY or deliveryDate is before issueDate'
        });

        await restockOrderWithPersistence.updateRestockOrder(1, "DELIVERY");
        await restockOrderWithPersistence.updateRestockOrderTransportNote(1, {"deliveryDate": "2021/12/30"});
        let ro = new RestockOrder(1, "2021/11/29 09:33", "DELIVERY", [{ "SKUId": 1, "description": "item one", "price": 10, "qty": 10 }], 1, { "deliveryDate": "2021/12/30" }, [{ "SKUId": 1, "rfid":"12345678123456781234567812345678"  }]);
        await expect(restockOrderWithPersistence.getRestockOrder(1)).resolves.toEqual(ro);
        dbManager.closeConnection();
        await expect(restockOrderWithPersistence.updateRestockOrderSkuItems(1, "DELIVERY")).rejects.toThrow();
    });

    test('Delete restock order', async () => {
        let ro = new RestockOrder(1, "2021/11/29 09:33", "ISSUED", [{ "SKUId": 1, "description": "item one", "price": 10, "qty": 10 }], 1, {"deliveryDate":  "2021/12/29"}, [{ "SKUId": 1, "rfid":"12345678123456781234567812345678"  }]);
        await expect(restockOrderWithPersistence.getRestockOrder(1)).resolves.toEqual(ro);
        await restockOrderWithPersistence.deleteRestockOrder(1);
        await expect(restockOrderDataLayer.getRestockOrder(1)).resolves.toBeUndefined();

        await expect(restockOrderWithPersistence.deleteRestockOrder(-1)).rejects.toEqual({
            returnCode: 22,
            message: 'validation of id failed'
        });
        
        dbManager.closeConnection();
        await expect(restockOrderWithPersistence.deleteRestockOrder(1)).rejects.toThrow();
    });
})

