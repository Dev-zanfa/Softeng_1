'use strict';

module.exports.purgeTable = async function (db, tableName) {
    const queryPurgeTable = `DELETE FROM ${tableName};`;
    const params = [];
    await db.query(queryPurgeTable, params);
}

module.exports.purgeSequences = async function (db) {
    const queryPurgeSeq = `UPDATE sqlite_sequence SET seq = 0;`;
    const params = [];
    
    await db.query(queryPurgeSeq, params);
}

module.exports.purgeSequencesExcept = async function (db, excepts) {
    const queryPurgeSeq = `UPDATE sqlite_sequence SET seq = 0 WHERE name NOT IN ("${excepts.join('","')}");`;
    const params = [];
    
    await db.query(queryPurgeSeq, params);
}

module.exports.restoreSequences = async function (db, table) {
    const queryPurgeSeq = `UPDATE sqlite_sequence SET seq = (SELECT COUNT(*) FROM ${table}) WHERE name = '${table}';`;
    const params = [];

    await db.query(queryPurgeSeq, params);
}

module.exports.purgeAllTables = async function (db) {
    const queryGetTables = 'SELECT tbl_name as t_name FROM sqlite_master WHERE type = "table" and name NOT IN ("sqlite_sequence");';

    const tableNames = (await db.get(queryGetTables, [])).map(t => t.t_name);

    for (let tableName of tableNames) {
        await module.exports.purgeTable(db, tableName);
    }

    await module.exports.purgeSequences(db);
}

module.exports.purgeAllTablesExcept = async function (db, ...excepts) {
    const queryGetTables = `SELECT tbl_name as t_name FROM sqlite_master WHERE type = "table" and name NOT IN ("sqlite_sequence", "USERS");`;

    const tableNames = (await db.get(queryGetTables, [])).map(t => t.t_name);

    for (let tableName of tableNames) {
        await module.exports.purgeTable(db, tableName);
    }

    excepts.forEach(async (e) => await module.exports.restoreSequences(db, e));

    await module.exports.purgeSequencesExcept(db, excepts);
}