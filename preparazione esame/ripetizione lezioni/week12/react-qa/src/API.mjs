import {Question, Answer} from './QAModels.mjs';

const SERVER_URL = 'http://localhost:3001';

const getQuestions = async () => {
  const response = await fetch(SERVER_URL + '/api/questions');
  if(response.ok) {
    const questionsJson = await response.json();
    return questionsJson.map(q => new Question(q.id, q.text, q.email, q.date));
  }
  else
    throw new Error('Internal server error');
}

const getAnswers = async (questionId) => {
  const response = await fetch(`${SERVER_URL}/api/questions/${questionId}/answers`);
  if(response.ok) {
    const answersJson = await response.json();
    return answersJson.map(ans => new Answer(ans.id, ans.text, ans.email, ans.date, ans.score));
  }
  else
    throw new Error('Internal server error');
}

const vote = async (answerId) => {
    const response = await fetch(`${SERVER_URL}/api/answers/${answerId}/vote`, { //ci servono dato che stiamo facendo una richiesta
        method: 'POST',
        headers: {'Content-type': 'application/json'},
        body: JSON.stringify({vote: 'upvote'}),
    });

    if(!response.ok) {
        const errMessage = await response.json();
        throw errMessage;
    }
    else
      return null;

    //TODO: migliorare gestione errori risposte
}

const addAnswer = async (answer, questionId) => {

    const response = await fetch(`${SERVER_URL}/api/questions/${questionId}/answers`, { //ci servono dato che stiamo facendo una richiesta
            method: 'POST',
            headers: {'Content-type': 'application/json'},
            body: JSON.stringify({
                text: answer.text,
                email: answer.email,
                score: 0,  // dato che è una nuova risposta 
                date: answer.date
        }),
  });

  if(!response.ok) {
      const errMessage = await response.json();
      throw errMessage;
  }
  else
    return null;

  //TODO: migliorare gestione errori risposte
}


const updateAnswer = async (answer) => {

    const response = await fetch(`${SERVER_URL}/api/answers/${answer.id}`, { //ci servono dato che stiamo facendo una richiesta
            method: 'PUT',
            headers: {'Content-type': 'application/json'},
            body: JSON.stringify({
                text: answer.text,
                email: answer.email,
                score: answer.score,  // dato che è una nuova risposta 
                date: answer.date
        }),
  });

  if(!response.ok) {
      const errMessage = await response.json();
      throw errMessage;
  }
  else
    return null;

  //TODO: migliorare gestione errori risposte
}

const API = {getAnswers, getQuestions, vote, addAnswer, updateAnswer};
export default API;