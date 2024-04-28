import 'bootstrap/dist/css/bootstrap.min.css';
import {Question} from "./QAModels.mjs";
import NavHeader from "./NavHeader";
import { Container } from 'react-bootstrap';
import QuestionDescription from './QuestionDescription';
import Answers from './Answers';



const fakeQuestion = new Question(1, 'Is JavaScript better than python?', 'luigi.derussis@polito.it', '2024-02-07');
fakeQuestion.init();


function App() {
  return (
    <>
      <NavHeader questionNum={fakeQuestion.id} />
      <Container fluid className='mt-3'>
        <QuestionDescription question={fakeQuestion} />
        <Answers answers={fakeQuestion.getAnswers()}></Answers>
      </Container>
    </>
  )
}

export default App;
