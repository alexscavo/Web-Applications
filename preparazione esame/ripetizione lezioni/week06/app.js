'use strict';

let sortingOrd = "asc";

function Answer(id, text, email, date, score = 0) {
    this.id = id;
    this.text = text;
    this.email = email;
    this.score = score;
    this.date = dayjs(date);

    this.toString = () => {
        return `${this.email} answered '${this.text}' on date ${this.date} and got a score of ${this.score}`;
    }
}

function Question(id, text, email, date) {
    this.id = id;
    this.text = text;
    this.email = email;
    this.date = dayjs(date);
    this.answers = [];  // array vuoto

    this.init = () => {
        this.answers = [
            new Answer(1, 'Yes', 'Luca Mannella', '2024-04-28', -10),
            new Answer(2, 'No', 'Miriam Luchetti', '2024-04-28', 5),
            new Answer(3, 'Maybe', 'Andrea Gnani', '2024-04-28', 1)
        ];
    }

    this.getAnswers = () => {
        return [...this.answers];
    }

    
    this.add = (answer) => {
        this.answers.push(answer);
    }

    /*
    this.find = (email) => {
        
        return this.answers.filter(ans => ans.email === email);
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
        */
}


function createAnswerRow(answer) {
    const tr = document.createElement('tr');

    tr.setAttribute('id', `answer-${answer.id}`);

    const tdDate = document.createElement('td');
    tdDate.innerText = answer.date.format('YYYY-MM-DD');
    tr.appendChild(tdDate);

    const tdText = document.createElement('td');
    tdText.innerText = answer.text;
    tr.appendChild(tdText);

    const tdAuthor = document.createElement('td');
    tdAuthor.innerText = answer.email;
    tr.appendChild(tdAuthor);

    const tdScore = document.createElement('td');
    tdScore.innerText = answer.score;
    tr.appendChild(tdScore);

    
    const tdActions = document.createElement('td');
    
    const buttonVote = document.createElement('button');
    buttonVote.classList.add('btn', 'btn-warning');
    buttonVote.innerHTML = "<i class='bi bi-arrow-up'></i>";

    buttonVote.addEventListener('click', (event) => {
        tdScore.innerText = Number(tdScore.innerText) + 1 ;
        answer.score = answer.score + 1;
    });

    const buttonEdit = document.createElement('button');
    buttonEdit.classList.add('btn', 'btn-primary', 'mx-1');
    buttonEdit.innerHTML = "<i class='bi bi-pencil-square'></i>";
   
    const buttonDelete = document.createElement('button');
    buttonDelete.classList.add('btn', 'btn-danger');
    buttonDelete.innerHTML = "<i class='bi bi-trash'></i>";

    buttonDelete.addEventListener('click', (event) => {
        tr.remove();
    });

    tdActions.appendChild(buttonVote);
    tdActions.appendChild(buttonEdit);
    tdActions.appendChild(buttonDelete);

    tr.appendChild(tdActions);

    return tr;
}


function fillAnswersTable(answers) {

    const answersTable = document.getElementById('answers-table');
    answersTable.innerHTML = "";

    for(const answer of answers) {
        const tableRowAnswer = createAnswerRow(answer);
        answersTable.prepend(tableRowAnswer);
    }
}

function addSortListener(answers) {
    const sortScoreIcon = document.getElementById('sort-score');

    sortScoreIcon.addEventListener('click', (event) => {
        const sortedAnswres = [...answers];

        if(sortingOrd == "asc") {
            sortedAnswres.sort((a, b) => a.score - b.score);
            sortingOrd = "desc";
            sortScoreIcon.classList.remove("bi-sort-numeric-down-alt");
            sortScoreIcon.classList.add("bi-sort-numeric-up");
        }
        else {
            sortedAnswres.sort((a, b) => b.score - a.score);
            sortingOrd = "asc";
            sortScoreIcon.classList.remove("bi-sort-numeric-up");
            sortScoreIcon.classList.add("bi-sort-numeric-down-alt");
        }

        
        fillAnswersTable(sortedAnswres);
    });
}


function main() {
    const question = new Question(1, 'Is JS better than Python?', 'alex.scavone@hotmail.it', '2024-02-27');
    question.init();
    const answers = question.getAnswers();
    
    fillAnswersTable(answers);
    addSortListener(answers);
}

main();