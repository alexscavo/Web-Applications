import dayjs from 'dayjs';
import db from './db.mjs';
import Bet from './Bet.mjs';


export default function BetDAO() {

    /**
     * Function to add a bet to the database
     * @param {Bet} bet Bet to be inserted
     * @returns {Promise<number>} Promise that resolves with the id of the bet or rejects with an error
     */
    this.addBet = (bet) => {
        return(new Promise((resolve, reject) => {

            const sql = 'INSERT INTO bets (userId, drawId, n1, n2, n3, used_points, score) VALUES (?, ?, ?, ?, ?, ?, ?)';
            const wonPoints = bet.wonPoints;

            db.run(sql, [bet.userId, bet.drawId, bet.n1, bet.n2, bet.n3, bet.usedPoints, wonPoints], function(err) {
                if(err){
                    reject(err);
                }
                resolve();
            });
        }));
    }

    /**
     * Function to update a bet given its id
     * @param {number} id Id of the ber
     * @param {number} n1 Number of the bet
     * @param {number} n2 Number of the bet
     * @param {number} n3 Number of the bet
     * @param {number} usedPoints Points used for the bet
     * @returns {Promise<void>} Promise that resolves or rejects with an error
     */
    this.updateBet = (id, n1, n2, n3, usedPoints) => {
        return(new Promise((resolve, reject) => {

            const sql = 'UPDATE bets SET n1 = ?, n2 = ?, n3 = ?, used_points = ? WHERE id = ?';
            db.run(sql, [n1, n2, n3, usedPoints, id], function(err) {
                if(err) {
                    reject(err);
                }
                resolve();
            });
        }));
    }

    /**
     * Function to retrieve the bet given the user and the round
     * @param {number} userId Id of the user
     * @param {number} drawId Id of the draw
     * @returns {Promise<Bet>} Promise that resolves with true if the bet is found, with null if it's not found or rejects with an error 
     */
    this.getBetByUserAndDraw = (userId, drawId) => {
        return(new Promise((resolve, reject) => {

            const sql = 'SELECT * FROM bets WHERE userId = ? AND drawId = ?';

            db.get(sql, [userId, drawId], (err, row) => {
                if(err) {
                    reject(err);
                }

                if(row === undefined){
                    resolve(null);
                }
                else {
                    const bet = new Bet(row.userId, row.drawId, row.n1, row.n2, row.n3, row.used_points, row.score, row.id);
                    resolve(bet);
                }
                
            });
        }));
    }

    /**
     * Function to retrieve the bet given the user and the round
     * @param {number} userId Id of the user
     * @param {number} drawId Id of the draw
     * @returns {Promise<Bet>} Promise that resolves with true if the bet is found, with null if it's not found or rejects with an error 
     */
    this.getBetById = (id) => {
        return(new Promise((resolve, reject) => {

            const sql = 'SELECT * FROM bets WHERE id = ?';

            db.get(sql, [id], (err, row) => {
                if(err) {
                    reject(err);
                }

                if(row === undefined){
                    resolve(null);
                }
                else {
                    const bet = new Bet(row.userId, row.drawId, row.n1, row.n2, row.n3, row.used_points, row.score, row.id);
                    resolve(bet);
                }
                
            });
        }));
    }

    /**
     * Function to retrieve all the bets for the current round
     * @param {number} drawId Id of the draw
     * @returns {Promise<Bet[]>} Promise that resolves with an array of Bet obejcts if any, with null in the other case, or rejects with an error
     */
    this.getBetForRound = (drawId) => {
        return(new Promise((resolve, reject) => {

            const sql = 'SELECT * FROM bets WHERE drawId = ?';

            db.all(sql, [drawId], (err, rows) => {

                if(err) {
                    reject(err);
                }
                else {
                    const bets = rows.map(row => new Bet(row.userId, row.drawId, row.n1, row.n2, row.n3, row.used_points, 0));
                    resolve(bets);
                }
            });
        }));
    }

    /**
     * Function to update the score of a bet given the user and the draw ids
     * @param {*} userId Id of the user
     * @param {*} drawId Id of the draw
     * @param {*} score Score to be saved
     * @returns {Promise<void>} Promise that resolves or rejects with an error
     */
    this.updateScoreBet = (userId, drawId, score) => {
        return(new Promise((resolve, reject) => {

            const sql = 'UPDATE bets SET score = ? WHERE userId = ? AND drawId = ?';

            db.run(sql, [score, userId, drawId], function(err) {
                if(err) {
                    reject(err);
                }
                else {
                    resolve();
                }
            });
        }));
    }
}