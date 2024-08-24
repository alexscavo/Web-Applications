import express from 'express';
import morgan from 'morgan';
import {check, validationResult} from 'express-validator';
import FilmLibraryDAO from './dao-filmLibrary.mjs';
import UserDAO from './dao-users.mjs';
import Film from './Film.mjs';


// --- SETUP --- // 
const app = express();
const port = 3001;
app.use(morgan('dev')); // per il log
app.use(express.json());  // per il json

const filmDao = new FilmLibraryDAO();
const userDao = new UserDAO();


// --- VALIDATION MIDDLEWARE --- //
async function userIdValidation(req, res, next) {
    const {userId} = req.body;

    try {
        const result = await userDao.getUser(userId);
        if(result.err)
            res.status(404).json(result).end();
        else
            next();
    }
    catch(err) {
        res.status(503).json({err: err.message}).end();
    }
}

async function filmIdValidation(req, res, next) {
    const filmId = req.params.id;

    try {
        console.log(req.params);
        const result = await filmDao.getFilmById(filmId);
        if(result.err)
            res.status(404).json(result).end();
        else
            next();
    }
    catch(err) {
        res.status(503).json({err: err.message}).end();
    }
}

const filmValidation = [
    check('title').isString().notEmpty(),
    check('userId').isNumeric().notEmpty(),
    check('favourite').isBoolean().optional(),
    check('watchDate').optional({nullable: true}).isISO8601({strict: true}).toDate(),
    check('rating').optional({nullable: true}).isInt({min: 1, max: 5}),
    userIdValidation
];


const onValidationErrors = (validationResult, res) => {
    const errors = validationResult.formatWith(({msg}) => msg);
    return res.status(422).json({validationErrors: errors.mapped()});
}



// --- APIs --- //

// 1. GET /api/films + filtri
app.get('/api/films', async (req, res) => {
    try {
        const films = await filmDao.getFilms(req.query.filter)
        res.status(200).json(films);
    }
    catch (err) {
        res.status(500).end();
    }

});

// GET /api/films/:id
app.get('/api/films/:id', async (req, res) => {
    try {
        const result = await filmDao.getFilmById(req.params.id);
        if(result.err){
            res.status(404).json(result);
        }
        else
            res.status(200).json(result);
    }
    catch (err) {
        res.status(500).end();
    }
});

// POST /api/films
app.post('/api/films',
    filmValidation,
    async (req, res) => {
        
        const invalidFields = validationResult(req);

        if(!invalidFields.isEmpty()) {
            return onValidationErrors(invalidFields, res);
        }

        const favourite = req.body.favourite ? req.body.favourite : false;
        const watchDate = req.body.watchDate ? req.body.watchDate : null;
        const rating = req.body.rating ? req.body.rating : null;

        const film = new Film(undefined, req.body.title, req.body.userId, favourite, watchDate, rating);
        try{
            const result = await filmDao.addFilm(film);

            res.status(200).json(result);
            
        }
        catch(err) {
            res.status(503).json({error: `error: Database error during the creation of the film: ${err}`});
        }
    }
);

// PUT /api/films/:id
app.put('/api/films/:id',
    filmValidation,
    async (req, res) => {
        const invalidFields = validationResult(req);

        if(!invalidFields.isEmpty()) {
            return onValidationErrors(invalidFields, res);
        }

        const favourite = req.body.favourite ? req.body.favourite : false;
        const watchDate = req.body.watchDate ? req.body.watchDate : null;
        const rating = req.body.rating ? req.body.rating : null;

        const film = new Film(undefined, req.body.title, req.body.userId, favourite, watchDate, rating);
        try{
            await filmDao.updateFilm(req.params.id, film);

            res.status(200).end();
            
        }
        catch(err) {
            res.status(503).json({error: `error: Database error during the creation of the film: ${err}`});
        }
});

// PUT /api/films/:id/rating
app.put('/api/films/:id/rating',
    [
        check('rating').notEmpty().isInt({min:1, max:5}),
        filmIdValidation
    ],
    async (req, res) => {
        const invalidFields = validationResult(req);

        if(!invalidFields.isEmpty()) {
            return onValidationErrors(invalidFields, res);
        }

        const rating = req.body.rating ? req.body.rating : null;

        try{
            await filmDao.updateRating(req.params.id, rating);

            res.status(200).end();
        }
        catch(err) {
            res.status(503).json({error: `error: Database error during the creation of the film: ${err}`});
        }
});

// PUT /api/films/:id/favourites
app.put('/api/films/:id/favourite',
    [
        check('favourite').notEmpty().isBoolean(),
        filmIdValidation
    ],
    async (req, res) => {
        const invalidFields = validationResult(req);

        if(!invalidFields.isEmpty()) {
            return onValidationErrors(invalidFields, res);
        }

        try{
            await filmDao.updateFavourite(req.params.id, req.body.favourite);

            res.status(200).end();
        }
        catch(err) {
            res.status(503).json({error: `error: Database error during the creation of the film: ${err}`});
        }
});


// DELETE /api/films/:id
app.delete('/api/films/:id',
    [
        filmIdValidation
    ],
    async (req, res) => {
        const invalidFields = validationResult(req);

        if(!invalidFields.isEmpty()) {
            return onValidationErrors(invalidFields, res);
        }

        try{
            await filmDao.deleteFilm(req.params.id);

            res.status(200).end();
        }
        catch(err) {
            res.status(503).json({error: `error: Database error during the creation of the film: ${err}`});
        }
});

app.listen(port, () => 'API server started');



