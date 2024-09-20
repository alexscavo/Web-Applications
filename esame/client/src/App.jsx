import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { useState, useEffect } from 'react';
import './App.css';
import {Route, Routes, Outlet, Navigate, useLocation} from 'react-router-dom';
import {Container, Toast, ToastBody} from 'react-bootstrap';
import NavHeader from './components/NavHeader';
import FeedbackContext from './contexts/FeedbackContext';
import {HomePageLayout, PlayPageLayout, LeaderboardPageLayout, NotFoundLayout} from './components/PageLayout';
import API from './API.mjs';
import {LoginForm} from './components/Auth';



function App() {

    const [user, setUser] = useState(null);         // utente loggato
    const [loggedIn, setLoggedIn] = useState(false);    // indica lo stato di login dell'utente
    const [drawId, setDrawId] = useState(-1);   // id della draw corrente
    const [extraction, setExtraction] = useState([]);      // numeri estratti
    const [remainingTime, setRemainingTime] = useState(0);      // tempo rimanente alla prossima estrazione
    const [startAnimation, setStartAnimation] = useState(false);    // indica se mostrare l'animazione dell'estrazione o meno

    
    const {pathname} = useLocation();

    // feedback per context
    const [feedback, setFeedback] = useState('');


    const setFeedbackFromError = (err) => {
        let message = '';
        if(err.message) message = err.message;
        else message = "Unkown Error";
        setFeedback(message);
    }


    /* ---------------------- */
    /* --- GESTIONE LOGIN --- */
    /* ---------------------- */
    useEffect(() => {   
        // verifiche sullo stato di login dell'utente

        API.getUserInfo().then(user => {

            setLoggedIn(true);
            setUser(user);

        }).catch(err => {
            if(loggedIn) {    // se sono segnato come loggato ma l'API mi dice che non lo sono, si verifica un errore
                setFeedbackFromError(err);
            }
            setLoggedIn(false);
            setUser(null);
        }); 
    }, []);

    // Gestione dell'azione login
    const handleLogin = async (credentials) => {
        const usr = await API.logIn(credentials);
        setUser(usr);
        setLoggedIn(true);
        setFeedback('Benvenuto, ' + usr.name);
    };

    // Gestione dell'azione logout
    const handleLogout = async () => {
        setLoggedIn(false); 
        setUser(null);
        setStartAnimation(false);
        await API.logOut();
    };

    
    
    /* ---------------------- */    
    /* --- GESTIONE TIMER --- */
    /* ---------------------- */
    // useEffect per la gestione del timer
    useEffect(() => {

        if(!loggedIn)
            return;

        // fetch per sapere il tempo rimanente
        const fetchRemainingTime = async () => {
            try {
                const data = await API.getRemainingTime();   // chiamo l'API per ottenere il tempo rimanente da parte del server 
                const remainingTime = data.remainingTime; 
                const serverTime = data.timestamp;      // timestamp in cui il server ha inviato la risposta
                const receivedAt = Date.now();  
                const delay = (receivedAt - serverTime) / 1000;     // calcolo del Round Trip Time
                setRemainingTime(() => remainingTime - Math.floor(delay)); // imposto lo stato remainingTime
            } catch (error) {
                console.error('Error fetching remaining time:', error);
                setFeedbackFromError(err)
            }
        };
    
    
        fetchRemainingTime();

        // faccio partire il countdown
        const interval = setInterval(() => {

            setRemainingTime(prevTime => {
                    if(prevTime <= 7000) {
                        setStartAnimation(true);    // qualche secondo prima della fine lancio l'animazione dell'estrazione
                    }
                    if (prevTime <= 1500) {      // quando raggiungo la fine del timer, effettuo un'altra chiamata al server
                    fetchRemainingTime(); 
                    setStartAnimation(false);
                    return prevTime;  
                    }
                    return prevTime - 1000;
            });
        }, 1000);
    
        return () => clearInterval(interval);   // quando il componente viene smontato, rimuovo il timer
    }, [loggedIn]);

    /* ------------------------ */
    /* --- GESTIONE POLLING --- */
    /* ------------------------ */
    // effettuo la fetch del round attuale ogni volta che entro in partita
    useEffect(() => {   

        if(loggedIn) {
            API.getLastDraw().then(draw => {
                setDrawId(draw.id+1);       // aggiungo 1 per avere l'id del round corrente
                setExtraction([draw.n1, draw.n2, draw.n3, draw.n4, draw.n5]);
            }).catch(err => {
                setDrawId(1);
            });
        }
    }, [loggedIn]);


    // ogni volta che viene estratto un draw id (grazie anche alla use effect sopra), se sono
    // loggato inizio il long polling, ricevendo alla fine il risultato della fetch
    useEffect(() => {            
        
        const pollServer = async () => {
            try {

                if(loggedIn === false)      
                    return;

                const data = await API.getPoll();

                // aggiorno i dati con quelli appena ricevuti
                setDrawId(data.drawId);    // draw id scatena in modo ricorsivo (se si e' loggati) nuovamente la useEffect
                setExtraction(data.numbers);
                    
            } catch (err) {
                console.log('Error while polling:', err);
                setFeedbackFromError(err);
            }
        };

        if(pathname === '/leaderboard' && loggedIn){
            setFeedback('Estrazione effettuata! Controlla i risultati!');
        }


        // inizio il polling
        if(loggedIn === true){
            pollServer();
        }
            
        return () => {
            if(loggedIn !== false){
                API.getUserInfo().catch(err => {
                    setLoggedIn(false);
                });
            }
        };
    }, [drawId]);
   





    return (
        <>
        <FeedbackContext.Provider value={{setFeedback, setFeedbackFromError}}>
            <Routes>
                <Route element={
                    <>
                    <div>
                        <NavHeader loggedIn={loggedIn} logout={handleLogout} />
                        <Toast
                            show={feedback !== ''}
                            autohide
                            onClose={() => setFeedback('')}
                            delay={4000}
                            position={'top-start'}
                            className="position-fixed m-3"
                        >
                            <ToastBody>
                                {feedback}
                            </ToastBody>
                        </Toast>
                        <Container fluid className='mt-5 pt-1' id='page'>
                            <Outlet />
                        </Container>
                    </div>
                    </>
                }>
                
                <Route path='/' element={
                    loggedIn ? <Navigate replace to='/play' remainingTime={remainingTime}/> : <HomePageLayout />
                } />

                {
                <Route path='/login' element={
                    loggedIn ? <Navigate replace to='/play' remainingTime={remainingTime}/> : <LoginForm login={handleLogin} />
                } />
                }

                <Route index path='/play' element={         /*index indica che e' il "figlio" di default del padre, ovvero /    */
                    !loggedIn ? <Navigate replace to='/' /> : <PlayPageLayout handleLogout={handleLogout} loggedIn={loggedIn} remainingTime={remainingTime} drawId={drawId} userId={user.id} startAnimation={startAnimation} extraction={extraction} />
                } />

                <Route path='/leaderboard' element={
                    !loggedIn ? <Navigate replace to='/' /> : <LeaderboardPageLayout drawId={drawId} />
                } />

                <Route path='*' element={<NotFoundLayout loggedIn={loggedIn} /> } />

                </Route>
            </Routes>
        </FeedbackContext.Provider>
        </>
    );
}

export default App
