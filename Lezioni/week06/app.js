'use strict';

let sortingOrder = "asc";

function Answer(id, text, username, date, score = 0){ //per score ho un valore di default = 0
    this.id = id;
    this.text = text;
    this.username = username;
    this.score = score;
    this.date = dayjs(date); //faccio che convertire in automatico quello che ricevo come data in modo da uniformare

    this.toString = () => {
        return `${this.username} replied ${this.text} on ${this.date.format('YYYY-MM-DD')} and got a score of ${this.score}`;
    }
}

function Question(id, text, email, date){
    this.id = id;
    this.text = text;
    this.email = email;
    this.date = dayjs(date);
    this.answers = [];

    this.add = (answer) => { //prima funzione
        this.answers.push(answer)
    }

    this.getAnswers = () => {
        return [...this.answers];   // per non mandare un puntatore all'esterno che poi potrebbe essere usato per modificarlo
    }

    this.init = () => {
        this.answers = [
            new Answer(1, 'Yes', 'Luca Mannella', '2024-02-28', -10),
            new Answer(2, 'Not in a million year', 'Guido van Rossum', '2024-03-01', 5),
            new Answer(3, 'No', 'Albert Einstein', '2024-03-11'),
            new Answer(4, 'Then, I don\'t know', 'Luca Mannella', '2024-03-10')
        ]
    }
}

function createAnswerRow(answer) {
    
    const tr = document.createElement('tr');    // gli dico cosa voglio creare

    tr.setAttribute('id', `answer-${answer.id}`);


    const tdDate = document.createElement('td');
    tdDate.innerText = answer.date.format("YYYY-MM-DD");
    tr.appendChild(tdDate);
    
    const tdText = document.createElement('td');
    tdText.innerText = answer.text
    tr.appendChild(tdText);

    const tdAuthor = document.createElement('td');
    tdAuthor.innerText = answer.username
    tr.appendChild(tdAuthor);

    const tdScore = document.createElement('td');
    tdScore.innerText = answer.score
    tr.appendChild(tdScore);

    

    const tdAction = document.createElement('td');
        const buttonVote = document.createElement('button');
        buttonVote.classList.add('btn', 'btn-warning');
        buttonVote.innerHTML = "<i class = 'bi bi-arrow-up'></i>"
        tdAction.appendChild(buttonVote);

        buttonVote.addEventListener('click', event => {
            tdScore.innerText = Number(tdScore.innerText) + 1;
        });

        const buttonEdit = document.createElement('button');
        buttonEdit.classList.add('btn', 'btn-primary', 'mx-1');
        buttonEdit.innerHTML = "<i class = 'bi bi-pencil-square'></i>"
        tdAction.appendChild(buttonEdit);

        const buttonDelete = document.createElement('button');
        buttonDelete.classList.add('btn', 'btn-danger');
        buttonDelete.innerHTML = "<i class = 'bi bi-trash'></i>"
        tdAction.appendChild(buttonDelete);

        buttonDelete.addEventListener('click', event => {
            console.log(event.currentTarget.parentElement.parentElement.id);
            tr.remove();
        });

    tr.appendChild(tdAction);
    

    return tr;

}   


function addSortListener(answers) {
    const sortScoreIcon = document.getElementById('sort-score');

    sortScoreIcon.addEventListener('click', event => {
        const sortedAnswers = [...answers];

        if(sortingOrder === "asc"){
            sortedAnswers.sort((a, b) => a.score - b.score);
            sortingOrder = "dsc";
        }
        else{
            sortedAnswers.sort((a, b) => b.score - a.score);
            sortingOrder = "asc";
        }
        fillAnswersTable(sortedAnswers);
    });
}


function fillAnswersTable(answers) {

    const answerTable = document.getElementById('answers-table');
    //const answerTable = document.querySelector('#answer-table');
    
    answerTable.innerHTML = "";

    for(const answer of answers) {
        const trAnswer = createAnswerRow(answer);
        answerTable.prepend(trAnswer);
    }
}


function main() {
    const question = new Question("Is JS better than py?", "Ale Scavo", "2024-02-12");

    question.init();

    const answers = question.getAnswers();

    fillAnswersTable(answers);

    addSortListener(answers);

    //console.log(answers)
}

main();