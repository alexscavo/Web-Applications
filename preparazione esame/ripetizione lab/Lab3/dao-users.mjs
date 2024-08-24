import db from "./db.mjs";

export default function UserDAO() {

    this.getUser = (id) => {
        return new Promise((res, rej) => {
            const sql = 'SELECT * FROM users WHERE id = ?';

            db.get(sql, [id], (err, row) => {
                if(err)
                    rej(err);

                if(row === undefined)
                    res({err: 'User not found'});
                res(row);
            })
        });
    }
}