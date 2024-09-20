import { Col, Row, Container, Card, Carousel } from 'react-bootstrap';

export default function Home() {
    return (
        <Container fluid className="mt-5" id='container-home'> 
            <Row className="mx-3">
                <Col className="me-3">
                    <Card id='game-rules'>
                        <Card.Body>
                            <Card.Title><strong>Regole del Gioco del Lotto</strong></Card.Title>
                            <p className="mt-3">
                                Il gioco consiste nell'estrazione periodica di un insieme di numeri e nella possibilità da parte dei giocatori di puntare su alcuni numeri per tentare di vincere.
                            </p>
                            <p className="mt-3">
                                Ogni due minuti viene fatta un'estrazione di 5 numeri (nell'intervallo 1-90). Nell'attesa dell'estrazione, il giocatore può puntare su 1, 2 o 3 numeri. È possibile effettuare una sola puntata per estrazione.
                            </p>
                            <p className="mt-3">
                                Le puntate si effettuano con i punti che si hanno a disposizione. Puntare su un numero costa 5 punti, su due numeri costa 10 e su 3 costa 15. Se non si hanno punti sufficienti per una puntata non è possibile giocare.
                            </p>
                            <p className="mt-3">
                                Se vengono indovinati tutti i numeri giocati si guadagna il doppio dei punti spesi. Se non viene indovinato nessun numero non viene guadagnato alcun punto. Se venissero indovinati solo alcuni numeri, vengono vinti punti in modo proporzionale ai numeri indovinati nella puntata rispetto a quelli giocati.
                            </p>
                        </Card.Body>
                    </Card>                    
                </Col>

                <Col > 
                    <RulesCarousel />
                </Col>
            </Row>
        </Container>
    );
}

function RulesCarousel() {
    return (
        <>
            <Carousel className="custom-carousel">
                <Carousel.Item>
                    <img
                        className="d-block w-100"
                        src="/bet.png"
                        alt="First slide"
                    />
                    <Carousel.Caption>
                        <h3>Effettua le Giocate!</h3>
                        <p>Scegli al massimo 3 numeri da giocare nel round corrente</p>
                    </Carousel.Caption>
                </Carousel.Item>
                <Carousel.Item>
                    <img
                        className="d-block w-100"
                        src="/win-results.png"
                        alt="Second slide"
                    />
                    <Carousel.Caption>
                        <h3>Attendi le Estrazioni!</h3>
                        <p>Visualizza i risultati delle estrazioni e raccogli i punti guadagnati</p>
                    </Carousel.Caption>
                </Carousel.Item>
                <Carousel.Item>
                    <img
                        className="d-block w-100"
                        src="/leaderboard.png"
                        alt="Third slide"
                    />
                    <Carousel.Caption>
                        <h3>Scopri i Migliori Giocatori</h3>
                        <p>Guarda la classifica dei migliori 3 giocatori e vedi chi ha accumulato più punti</p>
                    </Carousel.Caption>
                </Carousel.Item>
            </Carousel>
        </>
    );
}
