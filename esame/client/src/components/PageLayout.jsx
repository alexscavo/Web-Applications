import {Col,  Row, Container, Table, Button, Modal } from "react-bootstrap";
import { Link } from 'react-router-dom';
import Home from './Home';
import NumbersGrid from "./NumbersGrid";
import { useState, useEffect, useContext } from "react";
import dayjs from 'dayjs';
import Bet from "../models/Bet.mjs";
import Extraction from "./Extraction";
import Results from "./Results";
import Leaderboard from "./Leaderboard";
import FeedbackContext from "../contexts/FeedbackContext";
import API from "../API.mjs";



export function HomePageLayout() {
    return(
        <>
        <Row>
            <Home />
        </Row>
        </>
    );
}


export function PlayPageLayout(props) {

    const [selectedNumbers, setSelectedNumbers] = useState([]);     // vettore contenente i numeri attualmente selezionati
    const [betPoints, setBetPoints] = useState(0);      // mantiene il numero di punti della bet corrente
    const [totalPoints, setTotalPoints] = useState(100);    // numero totale di punti dell'utente
    const [availablePoints, setAvailablePoints] = useState(100);    // punti disponibili per la bet (se negativo non posso effettuare la bet, se 0 invece si')
    const [wonPointsPlayedPoints, setWonPointsPlayedPoints] = useState([-1, -1]);   // vettore contenente in prima posizione i punti vinti e in seonda posizione i punti usati, per 1 draw sola
    const [guessedPoints, setGuessedPoints] = useState([]);     // numeri indovinati
    const [loaded, setLoaded] = useState(false);        // per ridurre il numero di volte che viene chiamata fetchBet
    const [show, setShow] = useState(false);        // stato per mostrare il modale per quando si arriva a 0 punti

    useEffect(() => {

        const fetchUserPoints = async () => {
            try {
                const userPoints = await API.getUserTotalPoints(props.userId); 
                setTotalPoints(userPoints); 
                setAvailablePoints(userPoints);

                const previousBet = await API.getBet(props.userId, props.drawId-1);

                
                setGuessedPoints([]);
                setSelectedNumbers(() => []);
                setBetPoints(0);
                

                if(previousBet !== null) {
                    if(previousBet.wonPoints >= 0){
                        const betNumbers = [previousBet.n1, previousBet.n2, previousBet.n3];
                        setGuessedPoints(() => betNumbers.filter(number => props.extraction.includes(number)));
                    }
                    
                    setWonPointsPlayedPoints([previousBet.wonPoints, previousBet.usedPoints]);                  
                }
                else {
                    
                    setWonPointsPlayedPoints([-1, -1]);
                }
                setLoaded(false);   // dico che selectedNumbers e' stato azzerato dopo un'estrazione


            } catch (error) {
                console.error('Error fetching user points:', error);
                setFeedbackFromError(err);
            }
        };

        
        fetchUserPoints(); 
    }, [props.drawId]);

    // useEffect per caricare la bet dell'utente se ne ha fatta una per questo round
    useEffect(() => {   // eseguita ad ogni render
        const fetchBet = async () => {
            try {
                const currentBet = await API.getBet(props.userId, props.drawId);
                if(currentBet !== null){
    
                    let numbers = [currentBet.n1, currentBet.n2, currentBet.n3].filter(num => num !== 0);  
    
                    setSelectedNumbers(() => numbers);       // carico i numeri giocati
                    setBetPoints(currentBet.usedPoints);    // carico i punti in uso
                } 

                if(totalPoints <= 0 && currentBet === null) {   // sono a 0 punti e non ho effettuato nessuna puntata in questo round
                    setShow(true);  
                }
                else if (totalPoints <= 0 && currentBet.drawId === props.drawId - 1) {  // sono a 0 punti e non sono nel round corrente
                    setShow(true);  
                } else {
                    setShow(false);     
                }

            } catch (error) {
                console.error(`Error fetching user's current bet:`, error);
                setFeedbackFromError(err);
            }
        };
    
        if(loaded === false) {  // chiamata solo se non e' ancora stato caricato selectedNumbers
            fetchBet(); 
            setLoaded(true);
        }
    });


    const handleSelectedNumbers = (number) => {
        
        setSelectedNumbers(prevSelectedNumbers => {
            let updatedSelectedNumbers;
            if (!prevSelectedNumbers.includes(number)) { // se number non e' ancora stato selezionato e non ho ancora selezionato 3 numeri, posso selezionarlo

                if (prevSelectedNumbers.length < 3) {
                    updatedSelectedNumbers = [...prevSelectedNumbers, number];   
                } else {
                    updatedSelectedNumbers = prevSelectedNumbers;
                }
                setAvailablePoints((prevAvailablePoints) => prevAvailablePoints - 5);   // sottraggo 5 ogni volta che seleziono un numero
            } else {    // se gia' selezionato e' possibile solamente deselezionare il numero
                updatedSelectedNumbers = prevSelectedNumbers.filter(n => n !== number); 

                setAvailablePoints((prevAvailablePoints) => prevAvailablePoints + 5);      // aggiungo 5 ogni volta che deseleziono un numero
            }
    
            setBetPoints(updatedSelectedNumbers.length * 5);  

            return updatedSelectedNumbers; 
        });
    };

    const handleRegisterBet = async () => {
        
        const drawId = props.drawId;
        const userId = props.userId;
        const n1 = selectedNumbers[0] ? selectedNumbers[0] : 0;
        const n2 = selectedNumbers[1] ? selectedNumbers[1] : 0;
        const n3 = selectedNumbers[2] ? selectedNumbers[2] : 0;

        
        const bet = new Bet(userId, drawId, n1, n2, n3, betPoints, -1);

        try {
            const existingBet = await API.getBet(userId, drawId); // verifico se sia gia' presente una bet per l'utente nel round corrente
    
            let pointsChange = 0;   // mi dice quanto ho speso di punti
    
            if (existingBet) {
                // se la bet esiste, aggiornala settando i punti a quelli della nuova bet
                await API.updateBet(existingBet.betId, bet);
                pointsChange = existingBet.usedPoints - bet.usedPoints; // ai punti usati per la bet che era registrata tolgo i punti spesi ora, per ottenere la differenza di punti spesi
            } else {
                // se non esiste ancora nessuna bet, creala
                await API.postBet(bet);
                pointsChange = -bet.usedPoints; // tolgo i punti spesi
            }
    
            // aggiorno il front end
            setTotalPoints((prevPoints) => prevPoints + pointsChange);  // aggiungo ai punti che avevo dopo l'ultima bet quelli di adesso
    
            // aggiorno i punti nel database
            const updatedPoints = totalPoints + pointsChange; 
            await API.updateUserPoints(userId, updatedPoints); 
    
        } catch (error) {
            console.error("Error during bet registration:", error);
            setFeedbackFromError(err);
        }        
    }
    

    return(
        <>
        <Row className='mt-3'> 
            <Col>
                <Row className="text-center"><h2>Punti Totali: {totalPoints}</h2></Row>
                <Row><NumbersGrid 
                            selectedNumbers={selectedNumbers} 
                            handleSelectedNumbers={handleSelectedNumbers} 
                            handleRegisterBet={handleRegisterBet} 
                            betPoints={betPoints} 
                            totalPoints={totalPoints} 
                            availablePoints={availablePoints} />
                </Row>
            </Col>
            <Col>  
                <Row className='text-center'>
                    <h2>Tempo alla Prossima Estrazione: <span className={`${props.remainingTime <= 6000 ? 'text-danger' : 'text-dark'}`}> {dayjs(props.remainingTime).format('mm:ss')}</span></h2>
                    <Extraction startAnimation={props.startAnimation} extraction={props.extraction} guessedPoints={guessedPoints} />
                </Row>
                <Row>
                    <Col className='my-5'><Results wonPoints={wonPointsPlayedPoints[0]} playedPoints={wonPointsPlayedPoints[1]} /></Col>
                </Row>
                <Row>
                    <Col className='d-flex justify-content-md-center my-2'>
                        <Link className='btn btn-secondary btn-lg navigation-button' id='button-leaderboard' to='/leaderboard' relative='path'>Classifica 🏆</Link>
                    </Col>
                </Row>
            </Col>
        </Row>
        <Modal show={show} backdrop="static" keyboard={false}>
            <Modal.Header>
            <Modal.Title>Attenzione!</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                Hai terminato i tuoi punti a disposizione!
            </Modal.Body>
            <Modal.Footer>
            <Button variant="secondary" onClick={() => props.handleLogout()}>
                Esci
            </Button>
            </Modal.Footer>
        </Modal>
        </>
    );
}

export function LeaderboardPageLayout(props) {

    const [top3, setTop3] = useState([]); 

    useEffect(() => {            

        const fetchTop3 = async () => {
            try {
                const users = await API.getTop3Users();
                setTop3(users);
            }
            catch(err) {
                console.log('Error while fetching the top 3 users: ' + err);
                setFeedbackFromError(err);
            }
        }
        
        fetchTop3();
            
    }, [props.drawId]);




    return(
        <>
        <Row className="text-center"><Col><h1><span>Migliori 3 Giocatori 🏆</span></h1></Col></Row>
        <Row className='my-3'><Leaderboard top3={top3} /></Row>   
        <Row>
            <Col className='d-flex justify-content-md-center'>
                <Link className='btn btn-secondary btn-lg navigation-button' id='button-play' to='/play' relative='path'>Gioca 🎲</Link>
            </Col>
        </Row>
        </>
    );
}

export function NotFoundLayout(props) {
    return(
        <>
        <Row><Col className='d-flex justify-content-md-center'><h2>Errore: pagina non trovata!</h2></Col></Row>
        <Row><Col className='my-3 d-flex justify-content-md-center'><img src="/notfound.webp" alt="page not found" className="my-3" id='notfound-image' /></Col></Row>
        <Row><Col className='d-flex justify-content-md-center'>
            <Link className='btn btn-secondary btn-lg navigation-button' id='button-play' to={props.loggedIn ? '/play' : '/'} relative='path'>{props.loggedIn ? 'Gioca 🎲' : 'Home 🏠'}</Link>
            </Col>
        </Row>
        </>
    );
}
