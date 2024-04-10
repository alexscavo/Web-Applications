/* Same of week 03, but without any internal methods */
//Dato che ce li fornirà il server
import dayjs from 'dayjs';

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
}

export { Question, Answer };