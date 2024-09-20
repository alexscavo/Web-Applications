import sqlite from 'sqlite3';

const database_path = './';
const db = new sqlite.Database(database_path + 'lotto.db', (err) => {
    if(err)
        throw err
});

export default db;