import sqlite from 'sqlite3';

const db = new sqlite.Database('questions.sqlite', (err) => {
    if (err) throw err;
});

let sql = 'SELECT * FROM answer';
let results = [];
db.all(sql, [], (err, rows) => {
    
    if(err) throw err;

    for(let row of rows)
        results.push(row);
});

for(let r of results)   //viene eseguito prima di db.all dato che è asincrona
    console.log(r);     //se volessi che venga eseguito dopo la db.all dovrei metterla
                        //all'interno dell'arrow function di db.all