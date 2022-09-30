const InternalOrderService = require('../services/internalOrderService');
const InternalOrderDataLayer = require('../datalayers/internalOrderDataLayer');
const SKUDataLayer = require('../datalayers/SKUDataLayer');
const SkuItemsDataLayer = require('../datalayers/SKUItemDataLayer');

const DBManager = require('../database/dbManager');
const { purgeAllTables } = require('./mocks/purgeUtils');
const InternalOrder = require('../dtos/internalOrderDTO');

const dbManager = new DBManager("TEST");
const internalOrderDataLayer = new InternalOrderDataLayer(dbManager);
const SkuDataLayer = new SKUDataLayer(dbManager);
const SKUItemsDataLayer = new SkuItemsDataLayer(dbManager);
const internalOrderServiceWithPersistence = new InternalOrderService(internalOrderDataLayer);

describe('Internal Order Service Integration Tests', () => {
    beforeEach(async () => {
        dbManager.openConnection();
        await purgeAllTables(dbManager);

        await SkuDataLayer.insertSku('sku 1', 10, 100, 'red', 9.99, 20);
        await SkuDataLayer.insertSku('sku 2', 10, 100, 'blue', 9.99, 20);
        await SkuDataLayer.insertSku('sku 3', 20, 300, 'green', 9.99, 20);
        await SkuDataLayer.insertSku('sku 4', 20, 100, 'yellow', 11.99, 20);
        await SKUItemsDataLayer.insertSkuItem('12345678901234567890123456789014', 1, 0, '2021/11/29 12:30')
        await SKUItemsDataLayer.insertSkuItem('12345678901234567890123456789015', 2, 0, '2019/11/29 12:30')
        await internalOrderDataLayer.insertInternalOrder('2021/11/29 09:45', 1, 'ISSUED');
        await internalOrderDataLayer.insertInternalOrder('2021/10/28 11:45', 2, 'ISSUED');
        await internalOrderDataLayer.AddProduct(1,1,'a product', 10.99, 3);
        await internalOrderDataLayer.AddProduct(2,1,'another product', 50.99, 2);
        await internalOrderDataLayer.AddProduct(3,2,'a special product', 150.99, 4);
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
        expect(() => new InternalOrderService())
            .toThrow('Internal order data layer must be defined for Internal order service!');
    });

    test('Get all internal orders', async () => {
        await internalOrderServiceWithPersistence.updateInternalOrder(1, "COMPLETED", [{"SkuID":1,"RFID":"12345678901234567890123456789014"},{"SkuID":2,"RFID":"12345678901234567890123456789015"}]);
        let res = await internalOrderServiceWithPersistence.getAllInternalOrders();
        expect(res).toEqual(
            [
                new InternalOrder(1, "2021/11/29 09:45", "COMPLETED", [{"SKUId":1,"description":"a product","price":10.99,"RFID":"12345678901234567890123456789014"},{"SKUId":2,"description":"another product","price":50.99,"RFID":"12345678901234567890123456789015"}], 1),
                new InternalOrder(2, "2021/10/28 11:45", "ISSUED", [{"SKUId":3,"description":"a special product","price":150.99,"qty":4}], 2)
            ]
        );

        dbManager.closeConnection();
        await expect(internalOrderServiceWithPersistence.getAllInternalOrders()).rejects.toThrow();
    });

    test('Get all issued internal orders', async () => {
        let res = await internalOrderServiceWithPersistence.getAllInternalOrdersByState("ISSUED");
        expect(res).toEqual(
            [
                new InternalOrder(1, "2021/11/29 09:45", "ISSUED", [{"SKUId":1,"description":"a product","price":10.99,"qty":3},{"SKUId":2,"description":"another product","price":50.99,"qty":2}], 1),
                new InternalOrder(2, "2021/10/28 11:45", "ISSUED", [{"SKUId":3,"description":"a special product","price":150.99,"qty":4}], 2)
            ]
        );
        dbManager.closeConnection();
        await expect(internalOrderServiceWithPersistence.getAllInternalOrdersByState("ISSUED")).rejects.toThrow();
    });

    test('Get all accepted internal orders', async () => {
        await internalOrderDataLayer.updateInternalOrder(1, "ACCEPTED");
        let res = await internalOrderServiceWithPersistence.getAllInternalOrdersByState("ACCEPTED");
        expect(res).toEqual(
            [
                new InternalOrder(1, "2021/11/29 09:45", "ACCEPTED", [{"SKUId":1,"description":"a product","price":10.99,"qty":3},{"SKUId":2,"description":"another product","price":50.99,"qty":2}], 1),
            ]
        );
        await expect(internalOrderServiceWithPersistence.getAllInternalOrdersByState('PENDING')).rejects.toEqual({
            returnCode: 22,
            message: 'invalid state [PENDING] for internal order.'
        });

        dbManager.closeConnection();
        await expect(internalOrderServiceWithPersistence.getAllInternalOrdersByState("ACCEPTED")).rejects.toThrow();
    });

    test('Get internal order by id', async () => {
        let res = await internalOrderServiceWithPersistence.getInternalOrder(1);
        expect(res).toEqual(new InternalOrder(1, "2021/11/29 09:45", "ISSUED", [{"SKUId":1,"description":"a product","price":10.99,"qty":3},{"SKUId":2,"description":"another product","price":50.99,"qty":2}], 1));

        await expect(internalOrderServiceWithPersistence.getInternalOrder('a')).rejects.toEqual({
            returnCode: 22,
            message: 'validation of id failed'
        });

        await expect(internalOrderServiceWithPersistence.getInternalOrder(5)).rejects.toEqual({
            returnCode: 4,
            message: 'no internal order associated to id'
        });
    });

    test('Insert internal order', async () => {
        let internalOrder = new InternalOrder(3, "2020/11/15 14:10", "ISSUED", [{"SKUId":4,"description":"a new product","price":10.99,"qty":3}], 4);
        await internalOrderServiceWithPersistence.addInternalOrder("2020/11/15 14:10", [{"SKUId":4,"description":"a new product","price":10.99,"qty":3}], 4);
        await expect(internalOrderServiceWithPersistence.getInternalOrder(3)).resolves.toEqual(internalOrder);

        await expect(internalOrderServiceWithPersistence.addInternalOrder("", [{"SKUId":4,"description":"a new product","price":10.99,"qty":3}], 4)).rejects.toEqual({
            returnCode: 22,
            message: 'validation of request body failed'
        });
        await expect(internalOrderServiceWithPersistence.addInternalOrder("2020/11/15 14:10", [], 4)).rejects.toEqual({
            returnCode: 22,
            message: 'validation of request body failed'
        });
        await expect(internalOrderServiceWithPersistence.addInternalOrder("2020/11/15 14:10", [{"SKUId":4,"description":"a new product","price":10.99,"qty":3}], -1)).rejects.toEqual({
            returnCode: 22,
            message: 'validation of request body failed'
        });
        await expect(internalOrderServiceWithPersistence.addInternalOrder("2020/11/15 14:10", [{"SKUId":-1,"description":"a new product","price":10.99,"qty":3}], 4)).rejects.toEqual({
            returnCode: 22,
            message: 'validation of request body failed'
        });
        await expect(internalOrderServiceWithPersistence.addInternalOrder("2020/11/15 14:10", [{"SKUId":4,"description":"","price":10.99,"qty":3}], 41)).rejects.toEqual({
            returnCode: 22,
            message: 'validation of request body failed'
        });
        await expect(internalOrderServiceWithPersistence.addInternalOrder("2020/11/15 14:10", [{"SKUId":4,"description":"a new product","price":-0.99,"qty":3}], 4)).rejects.toEqual({
            returnCode: 22,
            message: 'validation of request body failed'
        });
        await expect(internalOrderServiceWithPersistence.addInternalOrder("2020/11/15 14:10", [{"SKUId":4,"description":"a new product","price":10.99,"qty":0}], 4)).rejects.toEqual({
            returnCode: 22,
            message: 'validation of request body failed'
        });
    });

    test('Update internal order', async () => {
        let internalOrder = new InternalOrder(2, "2021/10/28 11:45", "ACCEPTED", [{"SKUId":3,"description":"a special product","price":150.99,"qty":4}], 2);
        let internalOrderC = new InternalOrder(1, "2021/11/29 09:45", "COMPLETED", [{"SKUId":1,"description":"a product","price":10.99,"RFID":'12345678901234567890123456789014'},
            {"SKUId":2,"description":"another product","price":50.99,"RFID":'12345678901234567890123456789015'}], 1);
        await internalOrderServiceWithPersistence.updateInternalOrder(2, "ACCEPTED");
        await expect(internalOrderServiceWithPersistence.getInternalOrder(2)).resolves.toEqual(internalOrder);

        await expect(internalOrderServiceWithPersistence.updateInternalOrder(-5, "ACCEPTED")).rejects.toEqual({
            returnCode: 22,
            message: 'validation of request body or of id failed'
        });
        await expect(internalOrderServiceWithPersistence.updateInternalOrder(2, "")).rejects.toEqual({
            returnCode: 22,
            message: 'validation of request body or of id failed'
        });
        await expect(internalOrderServiceWithPersistence.updateInternalOrder(2, "PENDING")).rejects.toEqual({
            returnCode: 22,
            message: 'validation of request body or of id failed'
        });
        await expect(internalOrderServiceWithPersistence.updateInternalOrder(8, "ACCEPTED")).rejects.toEqual({
            returnCode: 4,
            message: 'no internal order associated to id'
        });

        await internalOrderServiceWithPersistence.updateInternalOrder(1, "COMPLETED", [{"SkuID":1,"RFID":"12345678901234567890123456789014"},{"SkuID":2,"RFID":"12345678901234567890123456789015"}]);
        await expect(internalOrderServiceWithPersistence.getInternalOrder(1)).resolves.toEqual(internalOrderC);
        
        let res = await internalOrderServiceWithPersistence.getAllInternalOrdersByState("COMPLETED");
        expect(res).toEqual(
            [internalOrderC]
        );

        await expect(internalOrderServiceWithPersistence.updateInternalOrder(1, "", [{"SkuID":1,"RFID":"12345678901234567890123456789014"},{"SkuID":2,"RFID":"12345678901234567890123456789015"}])).rejects.toEqual({
            returnCode: 22,
            message: 'validation of request body or of id failed'
        });
        await expect(internalOrderServiceWithPersistence.updateInternalOrder(1, "COMPLETED", [{"SkuID":1,"RFID":"1234567890123456789012"},{"SkuID":2,"RFID":"12345678901234567890123456789015"}])).rejects.toEqual({
            returnCode: 22,
            message: 'validation of request body or of id failed'
        });
        await expect(internalOrderServiceWithPersistence.updateInternalOrder(1, "COMPLETED", [{"SkuID":1,"RFID":"12345678901234567890123456789014"},{"SkuID":-3,"RFID":"12345678901234567890123456789015"}])).rejects.toEqual({
            returnCode: 22,
            message: 'validation of request body or of id failed'
        });
        await expect(internalOrderServiceWithPersistence.updateInternalOrder(1, "COMPLETED", [])).rejects.toEqual({
            returnCode: 22,
            message: 'validation of request body or of id failed'
        });
    });

    test('Delete internal order', async () => {
        let internalOrder = new InternalOrder(1, "2021/11/29 09:45", "ISSUED", [{"SKUId":1,"description":"a product","price":10.99,"qty":3},{"SKUId":2,"description":"another product","price":50.99,"qty":2}], 1);
        await expect(internalOrderServiceWithPersistence.getInternalOrder(1)).resolves.toEqual(internalOrder);
        await internalOrderServiceWithPersistence.deleteInternalOrder(1);
        await expect(internalOrderDataLayer.getInternalOrder(1)).resolves.toBeUndefined();

        await expect(internalOrderServiceWithPersistence.deleteInternalOrder(-1)).rejects.toEqual({
            returnCode: 22,
            message: 'validation of id failed'
        });
    });
});