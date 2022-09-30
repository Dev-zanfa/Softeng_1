const ItemDataLayer = require('../datalayers/itemDataLayer');
const SKUDataLayer = require('../datalayers/SKUDataLayer');
const UserDataLayer = require('../datalayers/userDataLayer');
const Item = require('../dtos/itemDTO');
const DBManager = require('../database/dbManager');
const { purgeAllTables, purgeTable } = require('./mocks/purgeUtils');

const dbManager = new DBManager("TEST");
const itemDataLayer = new ItemDataLayer(dbManager);
const sKUDataLayer = new SKUDataLayer(dbManager);
const userDataLayer = new UserDataLayer(dbManager);


describe('Item Data Layer Unit Tests', () => {
    beforeEach(async () => {
        dbManager.openConnection();
        await purgeAllTables(dbManager);

        await userDataLayer.insertUser('supplier1@ezwh.com', 'Qua', 'De Paperis', 'testpassword', 'supplier');
        await userDataLayer.insertUser('supplier2@ezwh.com', 'Quo', 'De Paperis', 'testpassword', 'supplier');
        let id = await sKUDataLayer.insertSku('ciao1', 100, 200, 'boh', 2.55, 10);
        await itemDataLayer.insertItem(1, 'item1', 2.99, id, 1);
        id = await sKUDataLayer.insertSku('ciao2', 100, 200, 'boh', 2.55, 10);
        await itemDataLayer.insertItem(2, 'item2', 2.99, id, 2);
        id = await sKUDataLayer.insertSku('ciao3', 100, 200, 'boh', 2.55, 10);
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

    test('Item Data Layer: Constructor test', () => {
        let dl = new ItemDataLayer(dbManager);
        expect(dl).not.toBeNull();

        expect(() => new ItemDataLayer(null)).toThrow('DbManager must be defined for item data layer!');
    });

    test('Item Data Layer: Get all items test', async () => {
        let res = await itemDataLayer.getAllItems();
        expect(res).toEqual(
            [
                new Item(1, 'item1', 2.99, 1, 1),
                new Item(2, 'item2', 2.99, 2, 2)
            ]
        );

        await purgeTable(dbManager, 'ITEMS');

        res = await itemDataLayer.getAllItems();
        expect(res).toEqual([]);

        dbManager.closeConnection();
        await expect(itemDataLayer.getAllItems()).rejects.toThrow();
    });

    test('Item Data Layer: Get item by id test', async () => {
        let res = await itemDataLayer.getItem(2, 2);
        expect(res).toEqual(new Item(2, 'item2', 2.99, 2, 2));

        res = await itemDataLayer.getItem(4);
        expect(res).toBeUndefined();

        dbManager.closeConnection();
        await expect(itemDataLayer.getItem(1)).rejects.toThrow();
    });

    test('Item Data Layer: Insert item test', async () => {
        let res = await itemDataLayer.getItem(3, 2);
        expect(res).toBeUndefined();

        let id = await itemDataLayer.insertItem(3, 'item3', 3.99, 3, 2);
        expect(id).toEqual(3);

        let item = await itemDataLayer.getItem(3, 2);
        expect(item).toEqual(new Item(3, 'item3', 3.99, 3, 2));

        dbManager.closeConnection();
        await expect(itemDataLayer.insertItem('it', 'throws', 'anyway', 'whichever', 'input')).rejects.toThrow();
    });

    test('Item Data Layer: Update item test', async () => {
        let res = await itemDataLayer.getItem(2, 2);
        expect(res).toEqual(new Item(2, 'item2', 2.99, 2, 2));

        await itemDataLayer.updateItem(2, 'item 2.1', 4.00);

        let item = await itemDataLayer.getItem(2, 2);
        expect(item).toEqual(new Item(2, 'item 2.1', 4.00, 2, 2));

        dbManager.closeConnection();
        await expect(itemDataLayer.updateItem('it', 'throws', 'anyway')).rejects.toThrow();
    });

    test('Item Data Layer: Delete item test', async () => {
        let res = await itemDataLayer.getItem(2, 2);
        expect(res).toEqual(new Item(2, 'item2', 2.99, 2, 2));

        await itemDataLayer.deleteItem(2);

        let item = await itemDataLayer.getItem(2, 2);
        expect(item).toBeUndefined();

        dbManager.closeConnection();
        await expect(itemDataLayer.deleteItem('throws')).rejects.toThrow();
    });

    test('Item Data Layer: Search item test', async () => {
        let res = await itemDataLayer.searchItem(2, 2);
        expect(res).toEqual(new Item(2, 'item2', 2.99, 2, 2));

        await itemDataLayer.deleteItem(2);

        let item = await itemDataLayer.searchItem(2, 2);
        expect(item).toBeUndefined();

        dbManager.closeConnection();
        await expect(itemDataLayer.searchItem('throws', 'anyway')).rejects.toThrow();
    });
});