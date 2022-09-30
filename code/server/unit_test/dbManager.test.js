const DBManager = require('../database/dbManager');

describe('DbManager Unit Tests', () => {
    test('DbManager constructor test', () => {
        expect(new DBManager('TEST')).not.toBeNull();
        expect(() => new DBManager('WRONG')).toThrow("The database WRONG was not found!");
    });

    test('DbManager open connection test', () => {
        const dbManager = new DBManager('TEST');
        expect(() => dbManager.openConnection()).not.toThrow();
    });

    test('DbManager close connection test', () => {
        const dbManager = new DBManager('TEST');
        expect(() => dbManager.closeConnection()).toThrow();
        expect(() => {
            dbManager.openConnection();
            dbManager.closeConnection();
        }).not.toThrow();
    });

    test('DbManager get test', async () => {
        const dbManager = new DBManager('TEST');
        dbManager.openConnection();

        await expect(dbManager.get('SELECT * FROM USERS', [])).resolves.not.toBeNull();
        await expect(dbManager.get('SELECT * FROM WRONG', [])).rejects.toThrow();
        await expect(dbManager.get('SELECT * FROM USERS', [], true)).resolves.not.toBeNull();
        await expect(dbManager.get('SELECT * FROM WRONG', [], true)).rejects.toThrow();

        dbManager.closeConnection();
    });

    test('DbManager query test', async () => {
        const dbManager = new DBManager('TEST');
        dbManager.openConnection();

        await expect(dbManager.query('DELETE FROM USERS', [])).resolves.not.toBeNull();
        await expect(dbManager.get('DELETE FROM WRONG', [])).rejects.toThrow();

        dbManager.closeConnection();
    });
});