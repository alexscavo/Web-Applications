/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { Col, Row } from 'react-bootstrap';
import { Link, useParams, useLocation } from 'react-router-dom';
import {useState, useEffect} from 'react';
import API from '../API.mjs';
import {Answer, Question} from '../QAModels.mjs';

import Answers from './AnswerComponent';
import AnswerForm from './AnswerForm';

export function QuestionLayout(props) {

    const [answers, setAnswers] = useState([]);

    const params = useParams();
    const question = props.questions[params.questionId - 1];

    const getAnswers = async () => {
        const answers = await API.getAnswers(params.questionId);
        setAnswers(answers);
    }

    useEffect(() => {
        getAnswers();
    }, []);  // TODO: aggiungere dipendenza da answers

    
    const voteUp = (answerId) => {
        // aggiornamento temporaneo dello stato sul client
        setAnswers(oldAnswers => {
          return oldAnswers.map(ans => {
            if(ans.id === answerId){
              // ritorno una nuova, aggiornata, risposta
              const answer = new Answer(ans.id, ans.text, ans.email, ans.date, ans.score +1);
              answer.voted = true;  // gli aggiungo una proprietà di visualizzazione 
              return answer;
            }
            else
              return ans;
          });
        });

        // aggiornamento server
        API.vote(answerId)
        .then(() => getAnswers())  // richiedo tutte le risposte
        .catch(err => console.log(err));
      }
        
    return(
        <>
        {/* The check on "question" is needed to intercept errors due to invalid URLs (e.g., /questions/5 when you have two questions only) */}
        {question ? <>
        <QuestionDescription question={question} />
        <Answers answers={answers} voteUp={voteUp}></Answers></> :
        <p className='lead'>The selected question does not exist!</p>
        } 
        </>
    );
}

export function AddEditQuestionLayout(props) {
  const { questionId } = useParams();
  const question = props.questions[questionId-1];
    
  let editableAnswer = undefined;
  if(props.mode === 'edit') {
    const location = useLocation();
    editableAnswer = location.state;
  }
  
  return(
    <> { question ? <>
      <QuestionDescription question={question} />
      <Row>
        <Col md={6} as='p'>
          <strong>Answer:</strong>
        </Col>
      </Row>
      { 
      props.mode === 'edit' && !editableAnswer ?
        <Row>
          <Col md={6}>
            <p>Answer not found!</p>
            <Link className='btn btn-danger' to={`/questions/${question.id}`}>Go back</Link>
          </Col>
        </Row>
        : <AnswerForm mode={props.mode} answer={editableAnswer} addAnswer={props.addAnswer} updateAnswer={props.updateAnswer}/>
      }</>: "Question doesn't exist" }
    </>
    );
}

function QuestionDescription (props) {
  return(
    <>
      <Row>
        <Col md={6} as='p'>
          <strong>Question #{props.question.id}:</strong>
        </Col>
        <Col md={6} as='p' className='text-end'>
          Asked by <span className='badge rounded-pill text-bg-secondary'>{props.question.email}</span>
        </Col>
      </Row>
      <Row>
        <Col as='p' className='lead'>{props.question.text}</Col>
      </Row>
    </>
  );
}