import React, { useState, useEffect } from 'react';
import Spinner from 'react-bootstrap/Spinner';
import {Row, Col} from 'react-bootstrap';




const Extraction = (props) => {
    
    return(
        <>
        <Row>
            <Col><SingleExtraction startAnimation={props.startAnimation} numberExtracted={props.extraction[0]} guessed={props.guessedPoints.includes(props.extraction[0])} /></Col>
            <Col><SingleExtraction startAnimation={props.startAnimation} numberExtracted={props.extraction[1]} guessed={props.guessedPoints.includes(props.extraction[1])} /></Col>
            <Col><SingleExtraction startAnimation={props.startAnimation} numberExtracted={props.extraction[2]} guessed={props.guessedPoints.includes(props.extraction[2])} /></Col>
            <Col><SingleExtraction startAnimation={props.startAnimation} numberExtracted={props.extraction[3]} guessed={props.guessedPoints.includes(props.extraction[3])} /></Col>
            <Col><SingleExtraction startAnimation={props.startAnimation} numberExtracted={props.extraction[4]} guessed={props.guessedPoints.includes(props.extraction[4])} /></Col>
        </Row>
        </>
    );
}


function SingleExtraction(props) {
    const [number, setNumber] = useState(generateRandomNumber());

    useEffect(() => {
        if(props.startAnimation === false)
            return;

        const intervalId = setInterval(() => {
            setNumber(generateRandomNumber());
        }, 100); // Cambia numero ogni 0.5 secondi

        const timeoutId = setTimeout(() => {
            clearInterval(intervalId); 
        }, 6000); // fermati dopo 5 secondi (6 secondi per sincronizzazione visiva)

        return () => {
            clearInterval(intervalId); // all'unmount azzerare l'interval
            clearTimeout(timeoutId); // all'anomount azzera il timeout
        };
    }, [props.startAnimation]);

    
    return (
        <>
        <div className={`${props.guessed && !props.startAnimation ? 'green-ball' : 'ball'} mt-5`} id='div-balls'>
            {props.startAnimation ? (
                number
            ) : (
                props.numberExtracted !== undefined ? props.numberExtracted : <Spinner animation="border" id='spinner' />
            )}
        </div>
        </>
    );
};

// produce a random number between 1 and 90
const generateRandomNumber = () => {
    return Math.floor(Math.random() * 90) + 1; 
};

export default Extraction;
