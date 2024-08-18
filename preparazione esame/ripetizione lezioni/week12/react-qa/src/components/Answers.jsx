/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import 'bootstrap-icons/font/bootstrap-icons.css';
import { Button, Row, Table, Col } from 'react-bootstrap';
import React, {useState} from 'react';
import AnswerForm from './AnswerForm';
import {Link} from 'react-router-dom';

function Answers(props) {

    const [mode, setMode] = useState('view');
    const [editableAnswer, setEditableAnswer] = useState('');

    const handleEdit = (answer) => {
        setEditableAnswer(answer);
        setMode('edit');
    }

    return(
    <>
        <Row>
            <Col as='h2'>Answers:</Col>
        </Row>
        <Row>
            <Col lg={10} className = 'mx-auto'>
                <AnswerTable answers={props.answers} voteUp={props.voteUp} sortAnswers={props.sortAnswers} deleteAns={props.deleteAns} handleEdit={handleEdit} />
                <Link className="btn btn-primary" to="add">Add</Link> 
            </Col>
        </Row>
    </>
    );
}

function AnswerTable(props) {

    const [sortOrder, setSortOrder] = useState('desc');

    const sortByScore = () => {
        props.sortAnswers(sortOrder);
        setSortOrder((oldOrder) => oldOrder === 'asc' ? 'desc' : 'asc');
    }

    return(
        <>
            <Table striped>
                <thead>
                    <tr>
                        <th>Date</th>
                        <th>Text</th>
                        <th>Author</th>
                        <th>Score <Button style={{color:'black'}} variant='link' onClick={() => sortByScore()}><i className={sortOrder === 'asc' ? 'bi-sort-numeric-down-alt' : 'bi-sort-numeric-up'}></i></Button></th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    { props.answers.map((ans) => <AnswerRow answer={ans} key={ans.id} voteUp={props.voteUp} deleteAns={props.deleteAns} handleEdit={props.handleEdit} />) }
                </tbody>
            </Table>
        </>
    )
}

function AnswerRow(props) {
    return(
        <>
            <tr><AnswerData answer={props.answer} /><AnswerAction answer={props.answer} voteUp={props.voteUp} deleteAns={props.deleteAns} handleEdit={props.handleEdit} /></tr>
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
                <Button variant='warning' onClick={() => props.voteUp(props.answer.id)}><i className='bi bi-arrow-up'></i></Button>
                <Link className='btn btn-primary mx-1'to={`editAnswer/${props.answer.id}`} state={props.answer.serialize()}><i className='bi bi-pencil-square'></i></Link>
                <Button variant='danger' onClick={() => props.deleteAns(props.answer.id)}><i className='bi bi-trash'></i></Button>
            </td>
        </>
    )
}



export default Answers;