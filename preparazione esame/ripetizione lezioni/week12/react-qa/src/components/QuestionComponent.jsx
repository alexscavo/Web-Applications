/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import {Row, Col} from 'react-bootstrap';
import {Link, useLocation} from 'react-router-dom';
import Answers from './Answers.jsx';
import AnswerForm from './AnswerForm.jsx';

export function QuestionLayout(props) {
    return(
        <>
        <QuestionDescription question={props.question} />
        <Answers answers={props.answers} voteUp={props.voteUp} sortAnswers={props.sortAnswers} addAnswer={props.addAnswer} updateAnswer={props.updateAnswer} deleteAns={props.deleteAns} />
        </>
    );
}

export function AddEditQuestionLayout(props) {

    const location = useLocation();
    const editableAnswer = location.state;

    if(props.mode === 'edit' && !editableAnswer){
        return(
            <>
            <p className='lead'>Error: edit mode not available! Please go back to the answer you want to edit and try again</p>
            <Link className='btn btn-danger' to={'../..'} relative='path'>Back to the question</Link>
            </>
        );
    }

    return(
        <>
        <QuestionDescription question={props.question} />
        <AnswerForm mode={props.mode} addAnswer={props.addAnswer} updateAnswer={props.updateAnswer} answer={editableAnswer}/>
        </>
    );
}
 
function QuestionDescription(props) {
    return(
        <>
            <Row>
                <Col md={6} as='p'>
                <strong>Question #{props.question.id}:</strong>
                </Col>
                <Col md={6} as='p' className='text-end'>
                Asked by: <span className='badge rounded-pill text-bg-secondary'>{props.question.email}</span>
                </Col>
            </Row>
            <Row>
                <Col as='p' className='lead'>{props.question.text}</Col>
            </Row>
        </>
    )
}