import React, { useState } from 'react';
import { Card, Button, Container, Row, Col } from 'react-bootstrap';


const Results = (props) => {    

    return (
        <>
        <Card className="text-center mx-auto" style={{ width: '30rem' }}>
            <Card.Body>
                {props.wonPoints === -1 ? (
                <h1 style={{ fontSize: '3rem', color: '#F97300' }}>🎲</h1>
                ) : props.wonPoints === 0 ? (
                <h1 style={{ fontSize: '3rem', color: '#D9534F' }}>😞</h1>
                ) : props.wonPoints === props.playedPoints * 2 ? (
                <h1 style={{ fontSize: '3rem', color: '#D9534F' }}>🤑</h1>
                ) : 
                <h1 style={{ fontSize: '3rem', color: '#D9534F' }}>💰</h1>
                }

                {/* messaggio (titolo) */}
                <Card.Title style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
                {props.wonPoints === -1 ? 'Gioca!' : props.wonPoints === 0 ? 'Hai Perso!' : 'Hai Vinto!'}
                </Card.Title>

                {/* messaggio ("body") */}
                {props.wonPoints > 0 && props.wonPoints !== props.playedPoints * 2 && (
                <Card.Text style={{ fontSize: '1.25rem', color: '#021526' }}>
                    Hai guadagnato {props.wonPoints} punti!
                </Card.Text>
                )}

                {props.wonPoints > 0 && props.wonPoints === props.playedPoints * 2 && (
                <Card.Text style={{ fontSize: '1.25rem', color: '#021526' }}>
                    🎉 Hai indovinato tutti i numeri giocati! 🎉 <br />
                    Hai guadagnato {props.wonPoints} punti!
                </Card.Text>
                )}

                {props.wonPoints === 0 && (
                <Card.Text style={{ fontSize: '1.25rem', color: '#021526' }}>
                    Avrai piu' fortuna la prossima volta!
                </Card.Text>
                )}

                {props.wonPoints === -1 && (
                <Card.Text style={{ fontSize: '1.25rem', color: '#021526' }}>
                    Seleziona al massimo 3 numeri che vuoi giocare!
                </Card.Text>
                )}

            </Card.Body>
            </Card>
        </>
    );
}


export default Results;
