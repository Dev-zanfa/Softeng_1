const InternalOrderDataLayer = require('../datalayers/internalOrderDataLayer');
const SKUDataLayer = require('../datalayers/SKUDataLayer');
const SKUItemDataLayer = require('../datalayers/SKUItemDataLayer');
const UserDataLayer = require('../datalayers/userDataLayer');
const InternalOrder = require('../dtos/internalOrderDTO');
const DBManager = require('../database/dbManager');
const { purgeAllTables, purgeTable } = require('./mocks/purgeUtils');

const dbManager = new DBManager("TEST");
const internalOrderDataLayer = new InternalOrderDataLayer(dbManager);
const sKUDataLayer = new SKUDataLayer(dbManager);
const sKUItemDataLayer = new SKUItemDataLayer(dbManager);
const userDataLayer = new UserDataLayer(dbManager);


describe('InternalOrder Data Layer Unit Tests', () => {
    beforeEach(async () => {
        dbManager.openConnection();
        await purgeAllTables(dbManager);

        await userDataLayer.insertUser('customer1@ezwh.com', 'Qua', 'De Paperis', 'testpassword', 'customer');
        await userDataLayer.insertUser('customer2@ezwh.com', 'Quo', 'De Paperis', 'testpassword', 'customer');
        await sKUDataLayer.insertSku('ciao1', 100, 200, 'boh', 2.55, 10);
        await sKUDataLayer.insertSku('ciao2', 100, 200, 'boh', 2.55, 10);
        await sKUDataLayer.insertSku('ciao3', 100, 200, 'boh', 2.55, 10);
        await sKUItemDataLayer.insertSkuItem('1', 3, 1, '22/07/2020');
        await sKUItemDataLayer.insertSkuItem('2', 3, 1, '22/07/2020');
        await internalOrderDataLayer.insertInternalOrder('20/05/2022', 1, 'ISSUED');    
        await internalOrderDataLayer.AddProduct(1, 1, 'desc1', 3.00, 3);  
        await internalOrderDataLayer.AddProduct(2, 1, 'desc2', 2.99, 4);  
        await internalOrderDataLayer.insertInternalOrder('20/05/2022', 2, 'COMPLETED');
        await internalOrderDataLayer.AddProduct(3, 2, 'desc3', 4.99, 6);  
        await internalOrderDataLayer.UpdateProduct(3, 2, '1');
    });

    afterEach(async () => {
        try {
            await purgeAllTables(dbManager);
            dbManager.closeConnection();
        }
        catch {
            //Do nothing, avoid crashes if already closed
        }
    });

    test('InternalOrder Data Layer: Constructor test', () => {
        let dl = new InternalOrderDataLayer(dbManager);
        expect(dl).not.toBeNull();

        expect(() => new InternalOrderDataLayer(null)).toThrow('DbManager must be defined for internal order data layer!');
    });

    test('InternalOrder Data Layer: Get all internal orders test', async () => {
        let res = await internalOrderDataLayer.getAllInternalOrders();
        expect(res).toEqual(
            [
                new InternalOrder(1, '20/05/2022', 'ISSUED', [], 1),
                new InternalOrder(2, '20/05/2022', 'COMPLETED', [], 2)
            ]
        );

        await purgeTable(dbManager, 'INTERNAL_ORDERS');

        res = await internalOrderDataLayer.getAllInternalOrders();
        expect(res).toEqual([]);

        dbManager.closeConnection();
        await expect(internalOrderDataLayer.getAllInternalOrders()).rejects.toThrow();
    });

    test('InternalOrder Data Layer: Get all internal orders by state test', async () => {
        let res = await internalOrderDataLayer.getAllInternalOrdersByState('ISSUED');
        expect(res).toEqual(
            [
                new InternalOrder(1, '20/05/2022', 'ISSUED', [], 1)
            ]
        );

        res = await internalOrderDataLayer.getAllInternalOrdersByState('ACCEPTED');
        expect(res).toEqual([]);

        dbManager.closeConnection();
        await expect(internalOrderDataLayer.getAllInternalOrdersByState('throws')).rejects.toThrow();
    });

    test('InternalOrder Data Layer: Get internal order by id test', async () => {
        let res = await internalOrderDataLayer.getInternalOrder(1);
        expect(res).toEqual(new InternalOrder(1, '20/05/2022', 'ISSUED', [], 1));

        res = await internalOrderDataLayer.getInternalOrder(4);
        expect(res).toBeUndefined();

        dbManager.closeConnection();
        await expect(internalOrderDataLayer.getInternalOrder(1)).rejects.toThrow();
    });

    test('InternalOrder Data Layer: Insert internal order test', async () => {
        let res = await internalOrderDataLayer.getInternalOrder(3);
        expect(res).toBeUndefined();

        let id = await internalOrderDataLayer.insertInternalOrder('20/05/2022', 2, 'ACCEPTED');
        expect(id).toEqual(3);

        let io = await internalOrderDataLayer.getInternalOrder(3);
        expect(io).toEqual(new InternalOrder(3, '20/05/2022', 'ACCEPTED', [], 2));

        dbManager.closeConnection();
        await expect(internalOrderDataLayer.insertInternalOrder('it', 'throws', 'anyway')).rejects.toThrow();
    });

    test('InternalOrder Data Layer: Update internal order test', async () => {
        let res = await internalOrderDataLayer.getInternalOrder(1);
        expect(res).toEqual(new InternalOrder(1, '20/05/2022', 'ISSUED', [], 1));

        let id = await internalOrderDataLayer.updateInternalOrder(1, 'ACCEPTED');
        expect(id).toEqual(3);

        let io = await internalOrderDataLayer.getInternalOrder(1);
        expect(io).toEqual(new InternalOrder(1, '20/05/2022', 'ACCEPTED', [], 1));

        dbManager.closeConnection();
        await expect(internalOrderDataLayer.updateInternalOrder('it', 'throws')).rejects.toThrow();
    });

    test('InternalOrder Data Layer: Delete internal order test', async () => {
        let res = await internalOrderDataLayer.getInternalOrder(1);
        expect(res).toEqual(new InternalOrder(1, '20/05/2022', 'ISSUED', [], 1));

        await internalOrderDataLayer.deleteInternalOrder(1);

        let io = await internalOrderDataLayer.getInternalOrder(1);
        expect(io).toBeUndefined();

        dbManager.closeConnection();
        await expect(internalOrderDataLayer.deleteInternalOrder('throws')).rejects.toThrow();
    });

    test('InternalOrder Data Layer: Get products by internal order test', async () => {
        let res = await internalOrderDataLayer.getProductsByInternalOrder(1);
        expect(res).toEqual([
            {
                SKUId: 1, 
                description: 'desc1',
                price: 3.00,
                qty: 3
            },
            {
                SKUId: 2, 
                description: 'desc2',
                price: 2.99,
                qty: 4
            }
        ]);

        await purgeTable(dbManager, 'IO_PRODUCTS');

        let io = await internalOrderDataLayer.getProductsByInternalOrder(1);
        expect(io).toEqual([]);

        dbManager.closeConnection();
        await expect(internalOrderDataLayer.getProductsByInternalOrder('throws')).rejects.toThrow();
    });

    test('InternalOrder Data Layer: Get products by completed internal order test', async () => {
        let res = await internalOrderDataLayer.getProductsByCompletedInternalOrder(2);
        expect(res).toEqual([
            {
                SKUId: 3,
                description: 'desc3',
                price: 4.99,
                RFID: '1'
            }
        ]);

        await internalOrderDataLayer.getProductsByCompletedInternalOrder(1);

        dbManager.closeConnection();
        await expect(internalOrderDataLayer.getProductsByCompletedInternalOrder('throws')).rejects.toThrow();
    });

    test('InternalOrder Data Layer: Add product to internal order test', async () => {
        let res = await internalOrderDataLayer.getProductsByInternalOrder(1);
        expect(res).toEqual([
            {
                SKUId: 1, 
                description: 'desc1',
                price: 3.00,
                qty: 3
            },
            {
                SKUId: 2, 
                description: 'desc2',
                price: 2.99,
                qty: 4
            }
        ]);

        await internalOrderDataLayer.AddProduct(3, 1, 'desc3', 4.99, 6);  

        let prods = await internalOrderDataLayer.getProductsByInternalOrder(1);
        expect(prods).toEqual([
            {
                SKUId: 1, 
                description: 'desc1',
                price: 3.00,
                qty: 3
            },
            {
                SKUId: 2, 
                description: 'desc2',
                price: 2.99,
                qty: 4
            },
            {
                SKUId: 3, 
                description: 'desc3',
                price: 4.99,
                qty: 6
            }
        ]);

        dbManager.closeConnection();
        await expect(internalOrderDataLayer.AddProduct('it', 'throws', 'anyway', 'whichever', 'input')).rejects.toThrow();
    });

    test('InternalOrder Data Layer: Update product of an internal order test', async () => {
        let res = await internalOrderDataLayer.getProductsByCompletedInternalOrder(2);
        expect(res).toEqual([
            {
                SKUId: 3,
                description: 'desc3',
                price: 4.99,
                RFID: '1'
            }
        ]);

        await internalOrderDataLayer.UpdateProduct(3, 2, '2');

        let prods = await internalOrderDataLayer.getProductsByCompletedInternalOrder(2);
        expect(prods).toEqual([
            {
                SKUId: 3,
                description: 'desc3',
                price: 4.99,
                RFID: '1'
            },
            {
                SKUId: 3,
                description: 'desc3',
                price: 4.99,
                RFID: '2'
            }
        ]);

        dbManager.closeConnection();
        await expect(internalOrderDataLayer.UpdateProduct('it', 'throws', 'anyway')).rejects.toThrow();
    });
});