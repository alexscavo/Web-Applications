import {useState} from 'react';
import {Alert, Button, Col, Form, Row} from 'react-bootstrap';
import {useNavigate} from 'react-router-dom';


export function LoginForm(props) {
    const [username, setusername] = useState('');
    const [password, setPassword] = useState('');

    const [show, setShow] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const navigate = useNavigate();

    const handleSubmit = (event) => {
        event.preventDefault();
        const credentials = {username, password};

        props.login(credentials)
        .then(() => navigate("/play"))      // redirigo verso la pagina /play
        .catch((err) => {
            if(err.message === "Unauthorized")
                setErrorMessage('Invalid email and/or passowrd');
            else
                setErrorMessage(err.message);
            setShow(true);
        });
    }

    return(
        <>
        <Row className="mt-3 vh-100 justify-content-md-center">
            <Col md={4} >
                <h1 className="pb-3">Login</h1>
                <Form onSubmit={handleSubmit}>
                <Alert
                        dismissible
                        show={show}
                        onClose={() => setShow(false)}
                        variant="danger">
                        {errorMessage}
                </Alert>
                <Form.Group className="mb-3" controlId="username">
                    <Form.Label>email</Form.Label>
                    <Form.Control
                    type="email"
                    value={username} placeholder="Example: john.doe@polito.it"
                    onChange={(ev) => setusername(ev.target.value)}
                    required={true}
                    />
                </Form.Group>
                    <Form.Group className="mb-3" controlId="password">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                    type="password"
                    value={password} placeholder="Enter the password."
                    onChange={(ev) => setPassword(ev.target.value)}
                    required={true} minLength={6}
                    />
                </Form.Group>
                <Button className="mt-3" type="submit" id="login-button-form">Login</Button>
                </Form>
            </Col>
        </Row>
        </>
    );
}


export function LoginButton() {
    
    const navigate = useNavigate();     // dato che voglio che mi porti alla pagina del login

    return(
        <>
        <Button variant='outline-*' id='login-logout-button-navbar' onClick={() => navigate('/login')}>Login</Button>
        </>
    );
}

export function LogoutButton(props) {
    return (
      <Button variant="outline-*" id='login-logout-button-navbar' onClick={props.logout}>Logout</Button>
    )
}
