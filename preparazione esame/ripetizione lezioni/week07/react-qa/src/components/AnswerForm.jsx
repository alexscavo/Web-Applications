import {Form, Button} from 'react-bootstrap';
import {useState} from 'react';
import dayjs from 'dayjs';

function AnswerForm(props) {

    const [text, setText] = useState('');
    const [email, setEmail] = useState('');
    const [date, setDate] = useState(dayjs().format('YYYY-MM-DD'));

    const handleSubmit = (event) => {
        event.preventDefault();     // serve a prevenire il comportamento di default

        // creare una nuova risposta
        const answer = {text, email, date}

        // todo: aggiungere delle validazioni su questi campi
        
        //aggiungere la risposta allo stato
        props.addAnswer(answer);
    }

    return(
        <>
            <Form className='my-3' onSubmit={handleSubmit}>
                <Form.Group className='mb-3'>
                    <Form.Label>Text</Form.Label>
                    <Form.Control type='text' required={true} minLength={2} value={text} onChange={(event) => setText(event.target.value)}></Form.Control>
                </Form.Group>
                <Form.Group className='mb-3'>
                    <Form.Label>email</Form.Label>
                    <Form.Control type='email' required={true} value={email} onChange={(event) => setEmail(event.target.value)}></Form.Control>
                </Form.Group>
                <Form.Group className='mb-3'>
                    <Form.Label>Date</Form.Label>
                    <Form.Control type='date' value={date} onChange={(event) => setDate(event.target.value)}></Form.Control>
                </Form.Group>
                <Button variant='success' type='submit'>Add</Button>
                <Button variant='danger' className='ms-1' onClick={props.cancel}>Cancel</Button>
            </Form>
        </>
    )
}

export default AnswerForm;