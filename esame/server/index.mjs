// imports
import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import {param, check, validationResult} from 'express-validator';
import DrawDAO from './dao-draws.mjs';
import Draw from './Draw.mjs';
import passport from 'passport';                    
import LocalStrategy from 'passport-local';         
import session from 'express-session';
import UserDAO from './dao-users.mjs';
import BetDAO from './dao-bets.mjs'; 
import Bet from '../client/src/models/Bet.mjs';


const drawDAO = new DrawDAO();
const userDAO = new UserDAO();
const betDAO = new BetDAO();

// init express
const app = new express();
app.use(morgan('dev'));
app.use(express.json());
const port = 3001;

// setup cors
const corsOptions = {
    origin: 'http://localhost:5173',
    credentials: true  
};
app.use(cors(corsOptions));



// ---------------------- //
// --- PASSPORT SETUP --- //
// ---------------------- //

// definisco la strategia per l'autenticazione (email + password)
passport.use(new LocalStrategy(async function verify(username, password, cb) {

    const user = await userDAO.getUserByCredentials(username, password);
    if(!user)
      return cb(null, false, 'Incorrect username or password.');
      
    return cb(null, user);
}));


passport.serializeUser(function (user, cb) {
    cb(null, user);
});
  
passport.deserializeUser(function (user, cb) {
    return cb(null, user);
});


app.use(session({
    secret: "shhhhh... it's a secret!",
    resave: false,
    saveUninitialized: false,
}));
app.use(passport.authenticate('session'));




// ------------------------ //
// --- MIDDLEWARE SETUP --- //
// ------------------------ //

/**
 * Middleware function to check if the user is authenticated.
* @param {Object} req - The request object, which contains the user session and authentication information.
 * @param {Object} res - The response object, used to send the HTTP response.
 * @param {Function} next - The next middleware function in the stack to call if the user is authenticated.
 * @returns {void} - If the user is authenticated, the function calls `next()` to proceed; otherwise, it sends a 401 response.
 */
const isLoggedIn = (req, res, next) => {

    if(req.isAuthenticated()) {
      return next();
    }
    return res.status(401).json({error: 'Not authorized'});
}



const ROUND_DURATION = 120000; // 2 minuti = 120000 ms
let drawTimestamp = Date.now();


// ---------------------- //
// --- RANDOM NUMBERS --- //
// ---------------------- //

/**
 * Generate 5 random numbers without repetitions
 * @returns {number[]} array of numbers representing the extraction
 */
const generateRandomNumbers = () => {

    const array = [];

    while(array.length != 5) {
        const number = Math.floor(Math.random() * 90) + 1;
        if(!array.includes(number))
            array.push(number);
    }

    return [...array];
};

// --------------------------- //
// --- POLLING & BROADCAST --- //
// --------------------------- //

let clients = [];

/**
 * Function to broadcast messages to all clients
 * @param {string} message message to be broadcasted to all the clients (numbers extracted + drawId + timeRemaining)
 */
function broadcast(message) {
    clients.forEach(client => client.json(message));
    clients = []; // dopo aver effettuato il broadcasting pulisco la lista di clients
}

/**
 * Function to broadcast round update information
 * @param {number[]} numbersExtracted numbers extracted
 * @param {number} drawId id of the last draw
 */
async function broadcastRoundUpdate(numbersExtracted, drawId) {
    if (clients.length > 0) {

        broadcast({
            numbers: numbersExtracted,
            drawId: drawId
        });
    }
}

/**
 * Function to compute the points of the player's bet
 * @param {number} correctNumbers number of correct numbers played
 * @param {number} betNumbers number of played numbers
 * @param {number} usedPoints number of points used
 * @returns {number} points earned with the bet
 */
function computePoints(correctNumbers, betNumbers, usedPoints) {

    if(correctNumbers === betNumbers)
        return usedPoints * 2;
    else if(correctNumbers === 0)
        return 0;

    return (correctNumbers / betNumbers) * 2 * usedPoints;
}

/**
 * Function to compute the points obtained with the bets of the players and save it in the database (both bets and users tables)
 * @param {BetDAO[]} bets array of bets from the players
 * @param {number[]} numbersExtracted numbers extracted from the server
 * @returns {Promise<void> | null} A promise that resolves when the scores are computed and saved, or null if the bet is empty (all numbers of the bet are 0).
 */
async function computeAndSaveScores(bets, numbersExtracted) {

    const updatePromises = bets.flatMap(bet => {
        const betNumbers = [bet.n1, bet.n2, bet.n3];


        const correctNumbers = betNumbers.filter(number => numbersExtracted.includes(number));

        let score = 0;

        if(bet.n1 === 0 && bet.n2 === 0 && bet.n3 === 0){
            return;
        }
        else {
            score = computePoints(correctNumbers.length, betNumbers.filter(number => number !== 0).length, bet.usedPoints);
        }
        

        // ritorno le Promise
        const updateBetPromise = betDAO.updateScoreBet(bet.userId, bet.drawId, score)
            .catch(err => {
                console.log(`Error while updating score for the user's bet ${bet.userId}:`, err);
            });
        const updateUserPromise = userDAO.addScoreToPoints(bet.userId, score)
            .catch(err => {
                console.log(`Error while updating points for user ${bet.userId}:`, err);
            });

        return [updateBetPromise, updateUserPromise];
    });

    // Promise.all mi permette di attendere la terminazione dell'esecuzione in parallelo delle query
    await Promise.all(updatePromises);
}







/**
 * Function to start the 2 minutes timer, registering the extraction, computing the scores and broadcasting the extraction to the users/clients
 */
async function startRoundTimer() {

    const executeRound = async () => {
        try {
            // genera i numeri casuali
            const numbersExtracted = generateRandomNumbers(); 
            drawTimestamp = Date.now();
            
            // crea la draw
            const newDraw = new Draw(
                numbersExtracted[0], 
                numbersExtracted[1], 
                numbersExtracted[2], 
                numbersExtracted[3], 
                numbersExtracted[4], 
                drawTimestamp
            );

            // salva l'estrazione
            const updatedDraw = await drawDAO.addDraw(newDraw);      
            
            // verifica le varie bet, aggiornando il punteggio ottenuto
            // prendo tutte le puntate fatte da tutti i giocatori per questa estrazione e calcolo gli score
            const bets = await betDAO.getBetForRound(updatedDraw.id);  
            if(bets.length !== 0)
                computeAndSaveScores(bets, numbersExtracted);
            

            // mando in broadcast i numeri estratti
            broadcastRoundUpdate(numbersExtracted, updatedDraw.id + 1);
        } catch (err) {
            console.error('Error during round processing:', err);
        }
    };

    try {
        setInterval(executeRound, ROUND_DURATION);
    } catch (err) {
        console.error('Error initializing round timer:', err);
    }
}

// lancio l'estrattore
startRoundTimer();


// ----------- //
// --- API --- //
// ----------- //

/**
 * Function to format the error message
 * @param {String} param0 message 
 * @returns message
 */
const errorFormatter = ({msg}) => {
    return msg;
}

/**
 * Handles validation errors by formatting them and sending a response with a 422 status code.
 * @param {Object} validationResult The result of the validation process, typically from a validation middleware.
 * @param {Object} res The response object used to send back the HTTP response.
 * @returns {Object} The HTTP response with a 422 status code and the formatted validation errors.
 */
const onValidationErrors = (validationResult, res) => {
    const errors = validationResult.formatWith(errorFormatter);
    return res.status(422).json({validationErrors: errors.mapped()})
}

// GET /api/poll
// Endpoint to handle polling from clients
app.get('/api/poll', isLoggedIn, (req, res) => {
    
    clients.push(res);  

    req.on('close', () => {     // quando una richesta viene chiusa la rimuovo dall'elenco
        clients = clients.filter(client => client !== res);
    });
});

// GET /api/draws/time-remaining
// Get the remaining time before next extraction
app.get('/api/time-remaining', isLoggedIn, (req, res) => {

    const timeElapsed = Date.now() - drawTimestamp;
    const remainingTime = ROUND_DURATION - timeElapsed; 
    res.status(200).json({ remainingTime: Math.max(0, remainingTime), timestamp: Date.now() });
});

// ----------------- //
// --- USERS API --- //
// ----------------- //


// POST /api/sessions
// Route per effettuare il login
app.post('/api/sessions', function(req, res, next) {
    passport.authenticate('local', (err, user, info) => {
        
        if (err)
            return next(err);
        if (!user) {

          return res.status(401).send(info);
        }

        req.login(user, (err) => {
            if (err)
                return next(err);
            
            return res.status(201).json(req.user);
        });
    })(req, res, next);
});

// GET /api/sessions/current
// Route per controllare se l'utente sia loggato
app.get('/api/sessions/current', async (req, res) => {

    if(req.isAuthenticated()) {
        res.status(200).json(req.user);
    }
    else {
        res.status(401).json({error: 'Not authenticated'});
    }
});


// DELETE /api/session/current
// This route is used for loggin out the current user.
app.delete('/api/sessions/current', (req, res) => {
    req.logout(() => {
        res.end();
    });
});

// GET /api/users/:<id>/points
// Retrieve the points of a user
app.get('/api/users/:id/points', isLoggedIn,
    [
        param('id').isInt().withMessage('the user ID must be a number'),
    ], async (req, res) => {

        const invalidFields = validationResult(req);

        if(!invalidFields.isEmpty()) {
            return onValidationErrors(invalidFields, res);
        }
    
        const userId = req.params.id;

        try {
            const result = await userDAO.getUserPoints(userId);
            if(result.err){
                res.status(404).json(result);
            }
            else{
                res.status(200).json(result);
            }
        }
        catch(err) {
            res.status(500).end();
        }
});

// PUT /api/users/:<id>/points
// Update the points of a user identified by its id
app.put('/api/users/:id/points', isLoggedIn,
    [
        param('id').isInt().withMessage('the user ID must be a number'),
        check('points').isInt({min: 0}).withMessage('points must be a positive number')
    ], async (req, res) => {

        const invalidFields = validationResult(req);

        if(!invalidFields.isEmpty()) {
            return onValidationErrors(invalidFields, res);
        }

        const userId = req.params.id;

        try {
            const checkUser = await userDAO.getUserById(userId);    
            if(checkUser.error) {
                return res.status(404).json(checkUser);
            }

            const result = await userDAO.updateUserPoints(userId, req.body.points);
            res.status(200).json(result);
        } catch (err) {
            res.status(500).json({ error: `Database error during the update of the bet: ${err}` });
        }
});


// GET /api/users/top3
// Retrieve the top 3 users with higher score
app.get('/api/users/top3', isLoggedIn, async (req, res) => {

    try {
        const result = await userDAO.getTop3Users();
        res.status(200).json(result);
    }
    catch (err) {
        res.status(500).json({ error: `Database error during the update of the bet: ${err}` });
    }
})





// ----------------- //
// --- DRAWS API --- //
// ----------------- //

// GET /api/draws/lastDraw
// Get the last draw ID 
app.get('/api/draws/lastDraw', isLoggedIn, async (req, res) => {
    
    try {
        const lastDraw = await drawDAO.getLastDraw();
        if(lastDraw === undefined) {
            res.status(204).json(lastDraw);
        }
        else {
            res.status(200).json(lastDraw);
        }
    }
    catch (err) {
        res.status(500).end();
    }
});



// --------------- //
// --- BET API --- //
// --------------- //

// GET /api/users/:<userId>/bets/:<drawId>
// Retrieve the bet of a user in a certain draw
app.get('/api/users/:userId/bets/:drawId', isLoggedIn,
    [
        param('userId').isInt().withMessage('The user ID must be a number'),
        param('drawId').isInt().withMessage('The bet ID must be a number'),
    ], async (req, res) => {

        const invalidFields = validationResult(req);

        if(!invalidFields.isEmpty()) {
            return onValidationErrors(invalidFields, res);
        }

        const { userId, drawId } = req.params;
        
        try {
            const bet = await betDAO.getBetByUserAndDraw(userId, drawId);
            res.json(bet);
        }
        catch(err) {
            res.status(500).json({error: `Database error during the registration of the bet: ${err}`});
        }
});

// POST /api/bets
// Add a new bet for a given user and a given draw
app.post('/api/bets', isLoggedIn,
    [
        check('userId').isInt().withMessage('userId must be number'),
        check('drawId').isInt().withMessage('drawId must be number'),
        check('wonPoints').isInt({min: -1, max: 30}).withMessage('wonPoints needs to be a number between -1 and 30'),
        check('n1').isInt({min: 0, max: 90}).withMessage('n1 must be a number between 0 and 90'),
        check('n2').isInt({min: 0, max: 90}).withMessage('n2 must be a number between 0 and 90'),
        check('n3').isInt({min: 0, max: 90}).withMessage('n3 must be a number between 0 and 90'),
        check('usedPoints').isInt({min: 0, max: 15}).withMessage('usedPoints must be a number between 0 and 15'),
    ],  async (req, res) => { // aggiungere validazione bet

        const invalidFields = validationResult(req);

        if(!invalidFields.isEmpty()) {
            return onValidationErrors(invalidFields, res);
        }

        const {userId, drawId, n1, n2, n3, usedPoints, wonPoints} = req.body;
        if((n1 === n2 && n1 !== 0) || (n1 === n3 && n1 !== 0) || (n2 === n3 && n2 !== 0)){
            return res.status(422).json({error: 'Numbers n1, n2, n3 must all be distinct'});
        }
        if(usedPoints % 5 !== 0){
            return res.status(422).json({error: 'wonPoints needs to be a multiple of 5'});  
        }


        const bet = new Bet(userId, drawId, n1, n2, n3, usedPoints, wonPoints);

        try {      
            
            const checkUser = await userDAO.getUserById(userId);
            if(checkUser.error) {
                return res.status(404).json(checkUser);
            }

            const checkBet = await betDAO.getBetByUserAndDraw(userId, drawId);  // verifico che non esista gia' una entry per l'utente nel round attuale
            if(checkBet !== null)
                return res.status(409).json({error: 'A bet for this user in this draw already exists'});

            const result = await betDAO.addBet(bet);    // se non esiste, ne inserisco una nuova
            res.json(result);    
        }
        catch(err) {
            res.status(500).json({error: `Database error during the registration of the bet: ${err}`});
        }
});

// PUT /api/bets/:<id>
// Route to update a bet given its id
app.put('/api/bets/:id', isLoggedIn,
    [
        param('id').isInt().withMessage('The bet ID must be a number'),
        check('n1').isInt({min: 0, max: 90}).withMessage('n1 must be a number between 0 and 90'),
        check('n2').isInt({min: 0, max: 90}).withMessage('n2 must be a number between 0 and 90'),
        check('n3').isInt({min: 0, max: 90}).withMessage('n3 must be a number between 0 and 90'),
        check('usedPoints').isInt({min: 0, max: 15}).withMessage('usedPoints must be a number between 0 and 15'),
    ], async (req, res) => {

        const invalidFields = validationResult(req);

        if(!invalidFields.isEmpty()) {
            return onValidationErrors(invalidFields, res);
        }

        const {n1, n2, n3, usedPoints} = req.body;
        if((n1 === n2 && n1 !== 0) || (n1 === n3 && n1 !== 0) || (n2 === n3 && n2 !== 0)){
            return res.status(422).json({error: 'Numbers n1, n2, n3 must all be distinct'});
        }
        if(usedPoints % 5 !== 0){
            return res.status(422).json({error: 'wonPoints needs to be a multiple of 5'}); 
        }



        const betId = req.params.id;

        try {
            const checkBet = await betDAO.getBetById(betId);
            if(checkBet === null) {
                return res.status(404).json({error: 'Bet not found'});
            }

            const result = await betDAO.updateBet(betId, n1, n2, n3, usedPoints);
            res.json(result);
        } catch (err) {
            res.status(500).json({ error: `Database error during the update of the bet: ${err}` });
        }
});



// activate the server
app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});