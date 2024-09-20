import db from "./db.mjs";
import crypto from "crypto";

export default function UserDAO() {

    /**
     * Function to retrieve a user given his id
     * @param {number} id id of the user to retrieve
     * @returns {Promise<Object>} Promise that resolves with the user object if found, an error object if the user is not found or rejects with an error
     */
    this.getUserById = (id) => {
        return(new Promise((resolve, reject) => {
            const sql = 'SELECT * FROM users WHERE id = ?';

            db.get(sql, [id], (err, row) => {
                if(err)
                    reject(err);
                if(row === undefined) {
                    resolve({error: 'User not found.'});
                }
                else {
                    resolve(row);
                }
            });
        }));
    }

    /**
     * Function that retrieve the user given its credentials
     * @param {*} email email of the user
     * @param {*} password password of the user (hashed)
     * @returns {Promise<Object|boolean>} Promise that resolves with the user if the email exists in the database and the password is correct, with 'false' in the other case or rejects with an error
     */
    this.getUserByCredentials = (email, password) => {
        return new Promise((resolve, reject) => {

            const sql = 'SELECT * FROM users WHERE email=?';
            db.get(sql, [email], (err, row) => {
                if (err) {
                    reject(err);
                } else if (row === undefined) {
                    resolve(false);
                }
                else {
                    const user = { id: row.id, email: row.email, name: row.name };

                    crypto.scrypt(password, row.salt, 32, function (err, hashedPassword) {  

                        if (err) reject(err);
                        if (!crypto.timingSafeEqual(Buffer.from(row.password, 'hex'), hashedPassword))
                            resolve(false);
                        else
                            resolve(user);
                    });
                }
            });
        });
    }

    /**
     * Function to retrieve the points of a user given its id
     * @param {number} id id of the user
     * @returns {Promise<number|Object>} Promise that resolves with the points retrieved if the id is found, with an Object containing a message in the other case, or rejects with an error
     */
    this.getUserPoints = (id) => {
        return(new Promise((resolve, reject) => {
            const sql = 'SELECT * FROM users WHERE id = ?';

            db.get(sql, [id], (err, row) => {
                if(err)
                    reject(err);
                if(row === undefined) {
                    resolve({error: 'User not found.'});
                }
                else {
                    resolve(row.points);
                }
            });
        }));
    }

    /**
     * Function to update the points of a user given his id
     * @param {number} id id of the user
     * @param {number} points new points of the user
     * @returns {Promise<void>} Promise that resolves or rejects with an error
     */
    this.updateUserPoints = (id, points) => {
        return(new Promise((resolve, reject) => {

            const sql = 'UPDATE users SET points = ? WHERE id = ?';

            db.run(sql, [points, id], function(err) {
                if(err) {
                    reject(err);
                }
                resolve();
            });
        }));
    }

    /**
     * Function to add the score of an extraction of a user to his points
     * @param {number} id id of the user
     * @param {number} score score obtained for that extraction by the user
     * @returns {Promise<void>} Promise that resolves or rejects with an error
     */
    this.addScoreToPoints = (id, score) => {
        return(new Promise((resolve, reject) => {

            const sql = 'UPDATE users SET points = points + ? WHERE id = ?';

            db.run(sql, [score, id], function(err) {
                if(err) {
                    reject(err);
                }
                resolve();
            });
        }));
    }

    /**
     * Function to retrieve the top 3 users by points
     * @returns {Promise<Object[]>} Promise that resolves with an array of Objects representing the users, with an empty array if there aren't any users in the database or rejects with an error
     */
    this.getTop3Users = () => {
        return(new Promise((resolve, reject) => {

            const sql = 'SELECT email, points FROM users ORDER BY points DESC LIMIT 3';

            db.all(sql, [], (err, rows) => {
                if(err){
                    reject(err);
                }
                else {
                    const users = rows.map(row => ({email: row.email, points: row.points}));
                    resolve(users);
                }                
                
            });
        }));
    }
}