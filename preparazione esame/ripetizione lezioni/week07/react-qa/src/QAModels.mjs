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
            new Answer(1, 'Yes', 'Luca Mannella', '2024-04-28', -10),
            new Answer(2, 'No', 'Miriam Luchetti', '2024-04-28', 5),
            new Answer(3, 'Maybe', 'Andrea Gnani', '2024-04-28', 1),
            new Answer(4, 'Do not know', 'Luca Marenti', '2024-04-28', 0)
        ];
    }
}

export { Question, Answer }