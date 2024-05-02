import {Button, Form} from 'react-bootstrap'

function FormAnswer (){
    return(
        <Form>
            <Form.Group className='mb-3'>
                <Form.Label>Text</Form.Label>
                <Form.Control type="text"></Form.Control>
            </Form.Group>
            <Form.Group className='mb-3'>
                <Form.Label>email</Form.Label>
                <Form.Control type="email"></Form.Control>
            </Form.Group>
            <Form.Group className='mb-3'>
                <Form.Label>Date</Form.Label>
                <Form.Control type="date"></Form.Control>
            </Form.Group>
            <Button variant="primary" type='submit'>Add</Button>
            <Button variant="danger" type='submit'>Cancel</Button>
        </Form>
    );
}

export default FormAnswer;