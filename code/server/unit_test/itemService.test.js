const ItemService = require('../services/itemService');
const ItemDataLayer = require('../datalayers/itemDataLayer');
const SKUDataLayer = require('../datalayers/SKUDataLayer');
const Item = require('../dtos/itemDTO');
const DBManager = require('../database/dbManager');
const { purgeAllTables } = require('./mocks/purgeUtils');

const dbManager = new DBManager("TEST");
const itemDataLayer = new ItemDataLayer(dbManager);
const skuDataLayer = new SKUDataLayer(dbManager);
const itemServiceWithPersistence = new ItemService(itemDataLayer, skuDataLayer);

describe('Item Service Integration Tests', () => {
    beforeEach(async () => {
        dbManager.openConnection();
        await purgeAllTables(dbManager);

        await skuDataLayer.insertSku('sku 1', 10, 100, 'red', 9.99, 20);
        await skuDataLayer.insertSku('sku 2', 10, 100, 'blue', 9.99, 20);
        await skuDataLayer.insertSku('sku 3', 20, 300, 'green', 9.99, 20);
        await itemDataLayer.insertItem(1, 'item 1', 10.99, 1, 1);
        await itemDataLayer.insertItem(2, 'item 2', 150.99, 2, 3);
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
        expect(() => new ItemService())
            .toThrow('Item data layer must be defined for Item service!');

        expect(() => new ItemService(new ItemDataLayer(dbManager)))
            .toThrow('SKU data layer must be defined for Item service!');
    });

    test('Get all items', async () => {
        let res = await itemServiceWithPersistence.getAllItems();
        expect(res).toEqual(
            [
                new Item(1, 'item 1', 10.99, 1, 1),
                new Item(2, 'item 2', 150.99, 2, 3)
            ]
        );

        dbManager.closeConnection();
        await expect(itemServiceWithPersistence.getAllItems()).rejects.toThrow();
    });

    test('Get item by id', async () => {
        let res = await itemServiceWithPersistence.getItem(2);
        expect(res).toEqual(new Item(2, 'item 2', 150.99, 2, 3));

        await expect(itemServiceWithPersistence.getItem('a')).rejects.toEqual({
            returnCode: 22,
            message: 'validation of id failed'
        });

        await expect(itemServiceWithPersistence.getItem(5)).rejects.toEqual({
            returnCode: 4,
            message: 'no item associated to id'
        });
    });

    test('Insert item', async () => {
        let item = new Item(3, 'item 3', 150.99, 3, 5);
        await itemServiceWithPersistence.addItem(3, 'item 3', 150.99, 3, 5);
        await expect(itemServiceWithPersistence.getItem(3)).resolves.toEqual(item);

        await expect(itemServiceWithPersistence.addItem(null, 'item 3', 150.99, 3, 5)).rejects.toEqual({
            returnCode: 22,
            message: 'validation of request body failed or this supplier already sells an item with the same SKUId or supplier already sells an Item with the same ID'
        });
        await expect(itemServiceWithPersistence.addItem(3, '', 150.99, 3, 5)).rejects.toEqual({
            returnCode: 22,
            message: 'validation of request body failed or this supplier already sells an item with the same SKUId or supplier already sells an Item with the same ID'
        });
        await expect(itemServiceWithPersistence.addItem(3, 'item 3', -0.99, 3, 5)).rejects.toEqual({
            returnCode: 22,
            message: 'validation of request body failed or this supplier already sells an item with the same SKUId or supplier already sells an Item with the same ID'
        });
        await expect(itemServiceWithPersistence.addItem(3, 'item 3', 150.99, -1, 5)).rejects.toEqual({
            returnCode: 22,
            message: 'validation of request body failed or this supplier already sells an item with the same SKUId or supplier already sells an Item with the same ID'
        });
        await expect(itemServiceWithPersistence.addItem(3, 'item 3', 150.99, 3, -5)).rejects.toEqual({
            returnCode: 22,
            message: 'validation of request body failed or this supplier already sells an item with the same SKUId or supplier already sells an Item with the same ID'
        });
        await expect(itemServiceWithPersistence.addItem(3, 'item 3', 150.99, 2, 5)).rejects.toEqual({
            returnCode: 22,
            message: 'validation of request body failed or this supplier already sells an item with the same SKUId or supplier already sells an Item with the same ID'
        });
        await expect(itemServiceWithPersistence.addItem(4, 'item 3', 150.99, 3, 5)).rejects.toEqual({
            returnCode: 22,
            message: 'validation of request body failed or this supplier already sells an item with the same SKUId or supplier already sells an Item with the same ID'
        });
        await expect(itemServiceWithPersistence.addItem(4, 'item 3', 150.99, 7, 5)).rejects.toEqual({
            returnCode: 4,
            message: 'Sku not found'
        });
    });

    test('Update item', async () => {
        let item = new Item(2, 'new description', 40.99, 2, 3);
        await itemServiceWithPersistence.updateItem(2, 'new description', 40.99);
        await expect(itemServiceWithPersistence.getItem(2)).resolves.toEqual(item);

        await expect(itemServiceWithPersistence.updateItem(-5, 'new description', 40.99)).rejects.toEqual({
            returnCode: 22,
            message: 'validation of request body failed'
        });
        await expect(itemServiceWithPersistence.updateItem(2, '', 40.99)).rejects.toEqual({
            returnCode: 22,
            message: 'validation of request body failed'
        });
        await expect(itemServiceWithPersistence.updateItem(2, 'new description', -1)).rejects.toEqual({
            returnCode: 22,
            message: 'validation of request body failed'
        });
        await expect(itemServiceWithPersistence.updateItem(100, 'new description', 40.99)).rejects.toEqual({
            returnCode: 4,
            message: 'Item not existing'
        });
    });

    test('Delete item', async () => {
        let item = new Item(1, 'item 1', 10.99, 1, 1);
        await expect(itemServiceWithPersistence.getItem(1)).resolves.toEqual(item);
        await itemServiceWithPersistence.deleteItem(1);
        await expect(itemDataLayer.getItem(1)).resolves.toBeUndefined();

        await expect(itemServiceWithPersistence.deleteItem(-1)).rejects.toEqual({
            returnCode: 22,
            message: 'validation of id failed'
        });
    });
});