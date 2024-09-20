import {Container, Row, Col, Button} from 'react-bootstrap';
import { useState, useEffect } from 'react';

export default function NumbersGrid(props) {
    const rows = Array.from({ length: 9 }, (_, i) => i + 1); // creo un array di 9 elementi numerati da 1 a 9
  
    return (
        <>
        <Row>
        <Container className='mt-5 fluid' id='container-esterno'>
            <Row>
                <Container className="numbers-grid-container py-2 px-auto my-4">
                    <Row className="justify-content-md-center">
                        {rows.map((_, index) => (
                        <GridRow key={index} start={index * 10 + 1} selectedNumbers={props.selectedNumbers} handleSelectedNumbers={props.handleSelectedNumbers} />
                        ))}
                    </Row>
                </Container>
            </Row>
            <Row className='mb-4' id='play-button-row'>
                <Col sm><Container className={`mb-4 px-0 fw-bold ${props.availablePoints >= 0 ? 'text-success' : 'text-danger'}`} id='bet-points'>Punti giocata: {props.betPoints}</Container></Col>
                <Col sm className='mt-5' id='play-button-col'><ConfirmButton handleRegisterBet={props.handleRegisterBet} betPoints={props.betPoints} totalPoints={props.totalPoints} availablePoints={props.availablePoints} /></Col>
                <Col sm></Col>
            </Row>
        </Container>
        </Row>
        </>
    );
}
  
function GridRow(props) {
    const numbers = Array.from({ length: 10 }, (_, i) => props.start + i);

    return (
        <Row className='my-1 justify-content-md-center mx-0'>
        {numbers.map((number) => (
            <Col xs={1} className="justify-content-center px-0" key={number} id='col-grid'>
                <Circle number={number} selectedNumbers={props.selectedNumbers} handleSelectedNumbers={props.handleSelectedNumbers} />
            </Col>
        ))}
        </Row>
    );
}

function Circle(props) {
    const [selected, setSelected] = useState(false);        

    useEffect(() => {
        setSelected(props.selectedNumbers.includes(props.number));
    }, [props.selectedNumbers, props.number]); // aggiornato quando viene inserito/rimosso qualcosa da selectedNumbers e quando viene 
                                               // definito il numero contenuto al suo interno (nel pallino)

    const handleClick = () => {
        // se sono arrivato a 3 numeri selezionati, gli unici click validi sono quelli per deselezionare un numero gia' selezionato
        if(props.selectedNumbers.length < 3 || props.selectedNumbers.includes(props.number)) {  
            
            setSelected(!selected);
            props.handleSelectedNumbers(props.number);
        }
    };

    return (
        <div className={`circle ${selected ? 'selected' : ''}`} onClick={handleClick} >{props.number}</div>
    );
}

function ConfirmButton(props) {

    return(
    <>
    <Col className='d-flex justify-content-md-center'>
        <Button className='play-button' onClick={() => {props.handleRegisterBet()}} disabled={props.availablePoints < 0}>Conferma</Button>
    </Col>
    </>
    );
}