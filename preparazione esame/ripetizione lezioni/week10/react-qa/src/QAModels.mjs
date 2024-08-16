import dayjs from 'dayjs';

function Answer(id, text, email, date, score = 0) {
    this.id = id;
    this.text = text;
    this.email = email;
    this.date = dayjs(date);
    this.score = score;
}

function Question(id, text, email, date) {
    this.id = id;
    this.text = text;
    this.email = email;
    this.date = dayjs(date);
    this.answers = [];

    this.addAnswer = (answer) => {
        this.answers.push(answer);
    }

    this.getAnswers = () => {
        return [...this.answers];
    }

    this.init = () => {
        this.answers = [
            new Answer(1, 'Yes', 'luca.mannella@gmail.it', '2024-04-28', -10),
            new Answer(2, 'No', 'miriam.luchetti19@gmail.com', '2024-04-28', 5),
            new Answer(3, 'Maybe', 'andrea.gnani@gmail.com', '2024-04-28', 1),
            new Answer(4, 'Do not know', 'luca.manenti@gmail.com', '2024-04-28', 0)
        ];
    }
}

export { Question, Answer }