import dayjs from 'dayjs';

function Answer(text, username, date, score = 0) {
    this.text = text;
    this.username = username;
    this.score = score;
    this.date = dayjs(date);

    /*this.toString = () => {
        return `${this.username} answered '${this.text}' on date ${this.date} and got a score of ${this.score}`;
    }*/
}


function Question(text, username, date) {
    this.text = text;
    this.username = username;
    this.date = dayjs(date);
    this.answers = [];  // array vuoto

    this.add = (answer) => {
        this.answers.push(answer);
    }

    this.find = (username) => {
        
        return this.answers.filter(ans => ans.username === username);
    }

    this.afterDate = (date) => {
        return this.answers.filter(ans => ans.date.isAfter(dayjs(date)));
    }

    this.listByDate = () => {
        return [...this.answers].sort((ans1, ans2) => (ans1.date.isAfter(ans2.date) ? 1 : -1))
    }

    this.listByScore = () => {
        return [...this.answers].sort((ans1, ans2) => ans1.score - ans2.score);
    }
} 


const question = new Question('java meglio di python?', 'Scavo', '2024-02-03');

const firstAns = new Answer('yes', 'miriam', '2024-02-04');
const secondAns = new Answer('no', 'andrea', '2024-02-04');
const thirdAns = new Answer('maybe', 'marco', '2024-02-04');
const fourthAns = new Answer('...', 'miriam', '2024-02-07');

question.add(firstAns);
question.add(secondAns);
question.add(thirdAns);
question.add(fourthAns);

const answersByAndrea = question.find('Andrea');
console.log(question);
console.log(''+answersByAndrea);

console.log(question.listByDate());
console.log(question.listByScore());
console.log(question.afterDate("2024-02-12"));

