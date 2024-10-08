/* eslint-disable no-unused-vars */
import 'bootstrap/dist/css/bootstrap.min.css';
import { useEffect, useState } from 'react';
import { Container } from 'react-bootstrap';
import { Routes, Route, Outlet } from 'react-router-dom';
import { Answer, Question } from "./QAModels.mjs";
import NavHeader from "./components/NavHeader";
import {QuestionLayout, AddEditQuestionLayout} from './components/QuestionComponent';
import NotFound from './components/NotFoundComponent.jsx';
import { QuestionsLayout } from './components/QuestionListComponent';
import API from './API';

const fakeQuestions = [new Question(1, 'Is JavaScript better than Python?', 'luigi.derussis@polito.it', '2024-02-07')];
fakeQuestions[0].init();
const fakeAnswers = fakeQuestions[0].getAnswers();

function App() {
    const [questions, setQuestions] = useState([]);


    useEffect(() => {
        // recuperiamo tutte le domande dal server
        const getQuestions = async () => {
            const questions = await API.getQuestions();
            setQuestions(questions);
        }

        getQuestions();
    }, []);
 

  return (
    <Routes>
      <Route element={<>
        <NavHeader />
        <Container fluid className='mt-3'>
          <Outlet/>
        </Container>
        </>
      }>
        <Route index element={
          <QuestionsLayout questions={questions} />
        } />
        <Route path="/questions/:questionId" element={
          <QuestionLayout questions={questions} />
        }/>
        <Route path="/questions/:questionId/addAnswer" element={
          <AddEditQuestionLayout questions={questions} mode="add" />
        }/>
        <Route path="/questions/:questionId/editAnswer/:answerId" element={
          <AddEditQuestionLayout questions={questions} mode="edit" />
        }/>
        <Route path="*" element={ <NotFound/> } />
      </Route>
    </Routes>
  );

}

export default App;