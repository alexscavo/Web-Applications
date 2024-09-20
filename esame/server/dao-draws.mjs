import dayjs from 'dayjs';
import db from './db.mjs';
import Draw from './Draw.mjs';


export default function DrawDAO() {

    /**
     * Function to add a new Draw
     * @param {Draw} draw Draw to be added
     * @returns {Promise<Draw>} Promise that resolves the draw with its Id or rejects with an error
     */
    this.addDraw = (draw) => {
        return(new Promise((resolve, reject) => {

            const sql = 'INSERT INTO draws(n1, n2, n3, n4, n5, timeStamp) VALUES (?, ?, ?, ?, ?, ?)';
            const timeStamp = draw.timeStamp.format('YYYY-MM-DD,HH:mm:ss');

            db.run(sql, [draw.n1, draw.n2, draw.n3, draw.n4, draw.n5, timeStamp], function(err) {
                if(err) {
                    reject(err);
                }
                draw.id = this.lastID;
                resolve(draw);  
            });
        }));
    }

    /**
     * Function to get a draw given its Id
     * @param {number} id Draw Id 
     * @returns {Promise<Draw>} Promise that resolves to the draw corresponding to id, to undefined if there isn't a draw with that id, or rejects with an error
     */
    this.getDraw = (id) => {
        return(new Promise((resolve, reject) => {
            const sql = 'SELECT * FROM draws WHERE id = ?';

            db.get(sql, [id], (err, row) => {
                if(err)
                    reject(err);
                if(row === undefined)
                    resolve(undefined);
                else {
                    const draw = new Draw(row.n1, row.n2, row.n3, row.n4, row.n5, row.timeStamp, row.id);
                    resolve(draw);
                }
            });
        }));
    }

    /**
     * Function to get the last draw given its Id
     * @returns {Promise<Draw>} Promise that resolves to the last Draw if any, to undefined if the database is empty or rejects 
     */
    this.getLastDraw = () => {
        return(new Promise((resolve, reject) => {
            const sql = 'SELECT MAX(id) AS id FROM draws';

            const sql1 = 'SELECT * FROM draws WHERE id = (SELECT MAX(id) AS id FROM draws)';

            db.get(sql1, [], (err, row) => {
                if(err)
                    reject(err);
                if(row === undefined)
                    resolve(undefined);
                else {
                    const draw = new Draw(row.n1, row.n2, row.n3, row.n4, row.n5, row.timeStamp, row.id);
                    resolve(draw);
                }
            });
        }));
    }
}