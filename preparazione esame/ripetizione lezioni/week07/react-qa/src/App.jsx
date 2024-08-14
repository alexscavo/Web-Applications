import 'bootstrap/dist/css/bootstrap.min.css';
import React, {useState} from 'react';
import {Container} from 'react-bootstrap';
import { Question, Answer } from './QAModels.mjs';
import NavHeader from './components/NavHeader.jsx';
import QuestionDescription from './components/QuestionDescription.jsx';
import Answers from './components/Answers.jsx';


const fakeQuestion = new Question(1, 'Is Javascript better than Python?', 'alex.scavone@hotmail.it', '2024-02-07');
fakeQuestion.init();

const fakeAnswers = fakeQuestion.getAnswers();

function App() {

    const [answers, setAnswers] = useState(fakeAnswers);
    const [question, setQuestion] = useState(fakeQuestion);

    const voteUp = (answerId) => {
        setAnswers(oldAnswers => {
            
            return oldAnswers.map((ans) => {
                if(ans.id == answerId)
                    return new Answer(ans.id, ans.text, ans.email, ans.date, ans.score + 1);
                else
                    return ans;
            });
        });
    }

    const deleteAns = (answerId) => {
        setAnswers(oldAnswers => {
            return oldAnswers.filter((ans) => ans.id != answerId);
        });
    }

    const addAnswer = (answer) => {
        setAnswers(oldAnswers => {
            const newId = Math.max(...oldAnswers.map(ans => ans.id)) + 1;
            const newAnswer = new Answer(newId, answer.text, answer.email, answer.date, 0);

            return [...oldAnswers, newAnswer];
        });
    }

    return (
        <>
            <NavHeader questionNum = {question.id} />
            <Container fluid className = 'mt-3'>
                <QuestionDescription question={question} />
                <Answers answers={answers} voteUp={voteUp} addAnswer={addAnswer} deleteAns={deleteAns} />
            </Container>
        </>
    )
}

export default App
