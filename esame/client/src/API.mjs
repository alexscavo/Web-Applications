

const SERVER_URL = 'http://localhost:3001/api';



function handleInvalidResponse(response) {
    
    if(!response.ok)
        throw Error(response.statusText);

    let type = response.headers.get('Content-Type');
    if(type !== null && type.indexOf('application/json') === -1)    // controllo di star ricevendo effettivamente un json
        throw new TypeError(`Expected JSON, got ${type}`);  

    return response;
}


/* ------------------------------ */
/* --- AUTHENTICATION FETCHES --- */
/* ------------------------------ */

const logIn = async (credentials) => {
    return await fetch(SERVER_URL + '/sessions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include',         // sto mandando i cookies dell'autenticazione
        body: JSON.stringify(credentials),
    }).then(handleInvalidResponse).then(response => response.json());
}

const logOut = async() => {
    return await fetch(SERVER_URL + '/sessions/current', {
        method: 'DELETE',
        credentials: 'include'
    }).then(handleInvalidResponse);
}


const getUserInfo = async () => {
    return await fetch(SERVER_URL + '/sessions/current', {
        credentials: 'include'
    }).then(handleInvalidResponse).then(response => response.json());
}


/* -------------------- */
/* --- POLL FETCHES --- */
/* -------------------- */

const getPoll = async () => {       
    return await fetch(SERVER_URL + '/poll', {
        credentials: 'include'
    }).then(handleInvalidResponse).then(response => response.json());
}

const getRemainingTime = async () => {
    return await fetch(SERVER_URL + '/time-remaining', {
        credentials: 'include'
    }).then(handleInvalidResponse).then(response => response.json());
}


/* -------------------- */
/* --- DRAW FETCHES --- */
/* -------------------- */

const getLastDraw = async () => {
    return await fetch(SERVER_URL + '/draws/lastDraw', {
        credentials: 'include'
    }).then(handleInvalidResponse).then(response => response.json());
}


/* ------------------- */
/* --- BET FETCHES --- */
/* ------------------- */

const postBet = async (bet) => {
    return await fetch(SERVER_URL + '/bets', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include',       
        body: JSON.stringify(bet)
    }).then(handleInvalidResponse);   
}

const updateBet = async (betId, bet) => {
    return await fetch(SERVER_URL + `/bets/${betId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(bet)
    })
    .then(handleInvalidResponse); 
};


const getBet = async (userId, drawId) => {
    return await fetch(SERVER_URL + `/users/${userId}/bets/${drawId}`, {
        credentials: 'include',
    })
    .then(handleInvalidResponse)
    .then(response => response.json()); 
};





/* -------------------- */
/* --- USER FETCHES --- */
/* -------------------- */

const getUserTotalPoints = async (userId) => {
    return await fetch(SERVER_URL + `/users/${userId}/points`, {
        credentials: 'include',
    })
    .then(handleInvalidResponse)
    .then(response => response.json()); 
};

const updateUserPoints = async (userId, points) => {
    return await fetch(SERVER_URL + `/users/${userId}/points`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({points: points})
    })
    .then(handleInvalidResponse); 
};

const getTop3Users = async () => {
    return await fetch(SERVER_URL + `/users/top3`, {
        credentials: 'include',
    })
    .then(handleInvalidResponse)
    .then(response => response.json()); 
};





const API = {logIn, logOut, getUserInfo, getLastDraw, getRemainingTime, getPoll, postBet, updateBet, getBet, getUserTotalPoints, updateUserPoints, getTop3Users};
export default API;