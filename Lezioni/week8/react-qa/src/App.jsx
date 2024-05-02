import 'bootstrap/dist/css/bootstrap.min.css';
import { Question, Answer } from "./QAModels.mjs";
import NavHeader from "./components/NavHeader";
import { Container } from 'react-bootstrap';
import QuestionDescription from './components/QuestionDescription';
import Answers from './components/AnswerComponents';
import {useState} from 'react';

const fakeQuestion = new Question(1, 'Is JavaScript better than Python?', 'luigi.derussis@polito.it', '2024-02-07');
fakeQuestion.init();

const fakeAnswers = fakeQuestion.getAnswers();

function App() {

  const [question, setQuestion] = useState(fakeQuestion);
  const [answers, setAnswers] = useState(fakeAnswers);

  const voteUp = (answerId) => {
    setAnswers(oldAnswers => {
      return oldAnswers.map(answer => {
        if(answer.id === answerId)
          return new Answer(answer.id, answer.text, answer.email, answer.date, answer.score+1); //ritorno una nuova risposta con lo score aggiornato
        else
          return answer;
      });
    });
  }

  return (
    <>
      <NavHeader questionNum={question.id} />
      <Container fluid className='mt-3'>
        <QuestionDescription question={question} />
        <Answers answers={answers} voteUp={voteUp}></Answers>
      </Container>
    </>
  )

}

export default App;
