import dayjs from 'dayjs';
import sqlite3 from 'sqlite3';

const db = new sqlite3.Database('questions.sqlite', (err) => {
    if (err) throw err;
});

function Answer(id, text, email, date, score = 0) {
    this.id = id;
    this.text = text;
    this.email = email;
    this.score = score;
    this.date = dayjs(date);

    
}


function Question(id, text, email, date) {
    this.id = id;
    this.text = text;
    this.email = email;
    this.date = dayjs(date);

    this.getAnswers = () => {
        return new Promise((resolve, reject) => {
            const sql = 'SELECT answer.id, text, user.email, date, score  FROM answer, user WHERE answer.questionId = ? AND answer.authorId = user.id';

            db.all(sql, [this.id], (err, rows) => {
                if (err)
                    reject(err);
                else {
                    const answers = rows.map((ans) => new Answer(ans.id, ans.text, ans.email, ans.date, ans.score));

                    resolve(answers);
                } 
                    
            });
        });
    }
    
} 

async function main() {
    let fake = new Question(1, '', '', '');
    fake.getAnswers().then(results => console.log(results));
    const results = await fake.getAnswers();
}

main();



