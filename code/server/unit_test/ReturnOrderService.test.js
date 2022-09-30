const ReturnOrderService = require('../services/returnOrderService');
const ReturnOrderDataLayer = require('../datalayers/returnOrderDataLayer');
const RestockOrderDataLayer = require('../datalayers/restockOrderDataLayer');
const SKUItemDataLayer = require('../datalayers/SKUItemDataLayer');
const SKUDataLayer = require('../datalayers/SKUDataLayer');
const DBManager = require('../database/dbManager');
const { purgeAllTables } = require('./mocks/purgeUtils');
const ReturnOrder = require('../dtos/returnOrderDTO');

const dbManager = new DBManager("TEST");
const restockOrderDataLayer = new RestockOrderDataLayer(dbManager);
const returnOrderDataLayer = new ReturnOrderDataLayer(dbManager);
const skuItemDataLayer = new SKUItemDataLayer(dbManager);
const skuDataLayer = new SKUDataLayer(dbManager);

const returnOrderWithPersistence = new ReturnOrderService(returnOrderDataLayer, restockOrderDataLayer);

describe('Restock Order Service Integration Tests', () => {

    beforeEach(async () => {
        dbManager.openConnection();
        await purgeAllTables(dbManager);

        await skuDataLayer.insertSku('ciao', 10, 100, 'red', 9.99, 20);
        await skuDataLayer.insertSku('ciao 2', 10, 100, 'blue', 9.99, 20);
        await skuItemDataLayer.insertSkuItem('12345678123456781234567812345678', 1, 1, '2020/05/18');
        await skuItemDataLayer.insertSkuItem('12345678901234567890123456789017', 12, 1, '2020/05/18');
        await skuItemDataLayer.insertSkuItem('12345678901234567890123456789016', 12, 1, '2020/05/18');
        await skuItemDataLayer.insertSkuItem('12345678123456781234567412345678', 2, 1, '2020/05/18');
        await restockOrderDataLayer.addRestockOrder("2021/11/29 09:33", 1);
        await restockOrderDataLayer.addProducts(1, 1, 10);
        await restockOrderDataLayer.updateRestockOrderTransportNote(1, "2021/12/29");
        await restockOrderDataLayer.updateRestockOrderSkuItems("12345678123456781234567812345678", 1, 1);
        await restockOrderDataLayer.addRestockOrder("2022/11/29 09:33", 2);
        await restockOrderDataLayer.addProducts(2, 2, 10);
        await returnOrderDataLayer.insertReturnOrder("2022/11/29 09:33", 1);
        await returnOrderDataLayer.insertReturnOrder("2021/11/29 09:33", 2);
    });

    afterEach(async () => {
        try {
            await purgeAllTables(dbManager);
            dbManager.closeConnection();
        }
        catch {/*foo*/ }
    });

    test('Constructor throws if data layer null', () => {
        expect(() => new ReturnOrderService())
            .toThrow('Return Order data layer must be defined for Return Order service!');

        expect(() => new ReturnOrderService(new ReturnOrderDataLayer(dbManager)))
            .toThrow('Restock Order data layer must be defined for Return Order service!');
    });

    test('Get all Return Orders', async () => {
        let res = await returnOrderWithPersistence.getAllReturnOrders();
        expect(res).toEqual(
            [
                new ReturnOrder(1, "2022/11/29 09:33", [], 1),
                new ReturnOrder(2, "2021/11/29 09:33", [], 2),
            ]
        );
        dbManager.closeConnection();
        await expect(returnOrderWithPersistence.getAllReturnOrders()).rejects.toThrow();
    });

    test('Get Return Order', async () => {
        await expect(returnOrderWithPersistence.getReturnOrder('a')).rejects.toEqual({
                    returnCode: 22,
                    message: 'validation of id failed'
                });
        await expect(returnOrderWithPersistence.getReturnOrder(100)).rejects.toEqual({
            returnCode: 4,
            message: 'no return order associated to id'
        });
        let res = await returnOrderWithPersistence.getReturnOrder(1);
        expect(res).toEqual(
            new ReturnOrder(1, "2022/11/29 09:33", [], 1),
        );

        dbManager.closeConnection();
        await expect(returnOrderWithPersistence.getReturnOrder(1)).rejects.toThrow();
    });

    

    test('add return Order', async () => {
        await expect(returnOrderWithPersistence.addReturnOrder("2021/19/29 09:33",  [{"RFID": '12345678123456781234567812345678', "SKUId": 1}] ,1)).rejects.toEqual({
            returnCode: 22,
            message: 'validation of request body failed'
        });
        await expect(returnOrderWithPersistence.addReturnOrder("2021/10/29 09:33",  [{"RFID": '12345678123456781234567812345678', "SKUId": 1}] ,100)).rejects.toEqual({
            returnCode: 4,
            message: 'no restock order associated to restockOrderId'
        });
        await expect(returnOrderWithPersistence.addReturnOrder("2021/10/29 09:33",  [{"RFID": '1234567812345678123456781234567', "SKUId": 1}] ,1)).rejects.toEqual({
            returnCode: 22,
            message: 'validation of request body failed'
        });

        let ro = new ReturnOrder(3, "2021/10/29 09:33", [], 1);
        await returnOrderWithPersistence.addReturnOrder("2021/10/29 09:33",  [{"RFID": '12345678123456781234567812345678', "SKUId": 1}] ,1)
        await expect(returnOrderWithPersistence.getReturnOrder(3)).resolves.toEqual(ro);

        dbManager.closeConnection();
        await expect(returnOrderWithPersistence.addReturnOrder("2021/10/29 09:33",  [{"RFID": '12345678123456781234567812345678', "SKUId": 1}] ,1)).rejects.toThrow();

    });

    test('Delete return order', async () => {
        let ro = new ReturnOrder(1, "2022/11/29 09:33", [], 1);
        await expect(returnOrderWithPersistence.getReturnOrder(1)).resolves.toEqual(ro);
        await returnOrderWithPersistence.deleteReturnOrder(1);
        await expect(returnOrderDataLayer.getReturnOrder(1)).resolves.toBeUndefined();

        await expect(returnOrderWithPersistence.deleteReturnOrder(-1)).rejects.toEqual({
            returnCode: 22,
            message: 'validation of id failed'
        });

        dbManager.closeConnection();
        await expect(returnOrderWithPersistence.deleteReturnOrder(1)).rejects.toThrow();
    });
})

