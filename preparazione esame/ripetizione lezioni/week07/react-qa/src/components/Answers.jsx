import 'bootstrap-icons/font/bootstrap-icons.css';
import { Button, Row, Table, Col } from 'react-bootstrap';
import React, {useState} from 'react';
import AnswerForm from './AnswerForm';

function Answers(props) {

    const [mode, setMode] = useState('view');

    return(
    <>
        <Row>
            <Col as='h2'>Answers:</Col>
        </Row>
        <Row>
            <Col lg={10} className = 'mx-auto'>
                <AnswerTable answers={props.answers} voteUp={props.voteUp} deleteAns={props.deleteAns} />
                {mode === 'view' && <Button variant='primary' onClick={() => {setMode('add');}}>Add</Button> }
                {mode === 'add' && <AnswerForm addAnswer={(answer) => {
                    props.addAnswer(answer);
                    setMode('view');
                }} 
                cancel={() => setMode('view')} />}
            </Col>
        </Row>
    </>);
}

function AnswerTable(props) {
    return(
        <>
            <Table striped>
                <thead>
                    <tr>
                        <th>Date</th>
                        <th>Text</th>
                        <th>Author</th>
                        <th>Score</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    { props.answers.map((ans) => <AnswerRow answer={ans} key={ans.id} voteUp={props.voteUp} deleteAns={props.deleteAns} />) }
                </tbody>
            </Table>
        </>
    )
}

function AnswerRow(props) {
    return(
        <>
            <tr><AnswerData answer={props.answer} /><AnswerAction answerId={props.answer.id} voteUp={props.voteUp} deleteAns={props.deleteAns} /></tr>
        </>
    )
}

function AnswerData(props) {
    return(
        <>
            <td>{props.answer.date.format('YYYY-MM-DD')}</td>
            <td>{props.answer.text}</td>
            <td>{props.answer.email}</td>
            <td>{props.answer.score}</td>
        </>
    )
}

function AnswerAction(props) {
    return(
        <>
            <td>
                <Button variant='warning' onClick={() => props.voteUp(props.answerId)}><i className='bi bi-arrow-up'></i></Button>
                <Button variant='primary' className='mx-1'><i className='bi bi-pencil-square'></i></Button>
                <Button variant='danger' onClick={() => props.deleteAns(props.answerId)}><i className='bi bi-trash'></i></Button>
            </td>
        </>
    )
}



export default Answers;