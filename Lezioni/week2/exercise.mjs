import dayjs from 'dayjs';


/*Se non volessi passare score, posso risolvere mettendo il parametro score in fondo*/
function Answer(text, username, date, score = 0){ //per score ho un valore di default = 0
    this.text = text;
    this.username = username;
    this.score = score;
    this.date = dayjs(date); //faccio che convertire in automatico quello che ricevo come data in modo da uniformare

    this.toString = () => {
        return `${this.username} replied ${this.text} on ${this.date.format('YYYY-MM-DD')} and got a score of ${this.score}`;
    }
}

function Question(text, username, date){
    this.text = text;
    this.username = username;
    this.date = dayjs(date);
    this.answers = [];

    this.add = (answer) => { //prima funzione
        this.answers.push(answer)
    }

    this.find = (username) => {

        /*
        const foundAns = [];

        for(const ans of this.answers){
            if(ans.username === username)
                foundAns.push(ans);
        }

        return foundAns;
        */

        return this.answers.filter(ans => ans.username === username);

    }

    this.afterDate = (date) => {

        return this.answers.filter(ans => ans.date.isAfter(dayjs(date)));
    }

    this.listByDate = () => {

        //uso lo spread operator per creare una copia dell'array answers altrimenti mi va ad ordinare quello
        return [...this.answers].sort((a, b) => (a.date.isAfter(b.date) ? 1 : -1)); 
    }

    this.listByScore = () => {

        //non ho bisgono di usare ?, : etc dato che sto lavorando con numeri
        return [...this.answers].sort((a, b) => b.score - a.score); //dato che è in ordine decrescente
    }

}

const question = new Question("Is JS better than py?", "Ale Scavo", "2024-02-12");

const firstAns = new Answer("Yes", "Andrea", "2024-02-13", -10);
const secondAns = new Answer("No", "Luca", "2024-02-13", 10);
const thirdAns = new Answer("Maybe", "Matteo", "2024-02-12", 5);
const fourthAns = new Answer("I don't know", "Andrea", "2024-02-10", -5);

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


