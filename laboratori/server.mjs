import express, { json } from 'express';
import morgan from 'morgan';
import { FilmLibrary, Film } from './film_library.mjs';
import {check, validationResult} from 'express-validator';


//init
const app = express();
const port = 3001;

//middleware
app.use(morgan('dev'));
app.use(json());

// istanza filmLibrary

const filmLib = new FilmLibrary();

// path

// GET /api/films
app.get('/api/films', (request, response) => {  //cosa deve fare l'API
    
    filmLib.getFilms()
    .then(films => response.json(films))
    .catch(() => response.status(500).end());
});

// GET /api/filtered
app.get('/api/films/filtered', (request, response) => {

    switch(request.query.filterType){
        case "favourites":
            filmLib.getFavourites()
            .then(films => response.json(films))
            .catch(() => response.status(500).end());
            break;

        case "best":
            filmLib.ratingGraterThan(5)
            .then(films => response.json(films))
            .catch(() => response.status(500).end());
            break;
            
        case "lastMonth":
            filmLib.getUnseen()
            .then(films => response.json(films))
            .catch(() => response.status(500).end());
            break;

        case "unseen":
            filmLib.getUnseen()
            .then(films => response.json(films))
            .catch(() => response.status(500).end());
            break;

        default:     
    }
});


// GET /api/films/<filmId>
app.get('/api/films/:filmid', async(req, res) => {

    try{
        const film = await filmLib.getFilm(req.params.filmid);

        if(film.error)
            res.status(404).json(film);
        else
            res.json(film);
    }
    catch{
        res.status(500).end();
    }
});


// POST /api/films
app.post('/api/films', [
    check('title').notEmpty(),
    check('isFavourite').isNumeric(),
    check('rating').isNumeric(),
    check('watchDate').isDate({format: 'YYYY-MM-DD', strictMode: true}),
    check('userId').isNumeric()
], async (request, resolve) => {

    const errors = validationResult(request);   //faccio i check indicati
    
    if(!errors.isEmpty()){  //verifico se sono presenti errori
        return resolve.status(422).json({errors: errors.array()});  //se presenti, li mando come json
    }

    const newFilm = request.body;


    try{
        const id = await filmLib.insertNewMovie(new Film(
            newFilm.title,
            newFilm.isFavourite, 
            newFilm.rating, 
            newFilm.watchDate,
            newFilm.userId
        ));

        resolve.status(201).location(id).end();
    }
    catch(e) {
        console.error(`ERROR: ${e.message}`);
        resolve.status(503).json({error: 'Impossible to create a new film.'});
    }
});


// PUT /api/film/<filmId>
app.put('/api/films/:filmId', [
    check('title').notEmpty(),
    check('isFavourite').isNumeric(),
    check('rating').isNumeric(),
    check('watchDate').isDate({format: 'YYYY-MM-DD', strictMode: true}),
    check('userId').isNumeric()
], async (request, resolve) => {

    const errors = validationResult(request);

    if(!errors.isEmpty()){
        return resolve.status(422).json({errors: errors.array()});
    }

    const filmToUpdate = request.body;
    filmToUpdate.filmId = request.params.filmId;
    
    try{
        await filmLib.updateFilm(filmToUpdate);
        resolve.status(200).end();
    }
    catch(e){
        console.error(`ERROR: ${e.message}`);
        resolve.status(503).json({'error': `Impossibile to update the film ${request.params.id}`});
    }
});


// PATCH /api/films/<filmId>/favourite
app.patch('/api/films/:id/favourite',
    [
        check('favourite').isNumeric(),
    ],
    async (req, res) => {
        const invalidFields = validationResult(req);

        if (!invalidFields.isEmpty()) {
            return res.status(422).json({invalidFields: invalidFields.array()});
        }

        try {
            
            const film = await filmLib.getFilm(req.params.id);
            if (film.error)
                return res.status(404).json(film);
            film.favorite = req.body.favorite;  // update favorite property
            const result = await filmLib.updateFav(film.filmId, req.body.favourite);
            return res.json(result);
        } catch (err) {
            res.status(503).json({error: `Database error during the favorite update of film ${req.params.id}`});
        }
});

// PATCH /api/films/:id/rating
app.patch('/api/films/:id/rating',
    [
        check('rating').optional({nullable: true}).isInt({min: 1, max: 5}),
    ],
    async (req, res) => {
        const invalidFields = validationResult(req);

        if (!invalidFields.isEmpty()) {
            return res.status(422).json({invalidFields: invalidFields.array()});
        }

        try {
            const film = await filmLib.getFilm(req.params.id);
            if (film.error)
                return res.status(404).json(film);
            // update favorite property
            film.rating = req.body.rating || null;  // if req.body.rating is falsy, null is assigned
            const result = await filmLib.updateRating(film.filmId, req.body.rating);
            return res.json(result);
        } catch (err) {
            res.status(503).json({error: `Database error during the rating update of film ${req.params.id}`});
        }
    }
);


// 7. Delete an existing film, given its “id”
// DELETE /api/films/<id>
// Given a film id, this route deletes the associated film from the library.
app.delete('/api/films/:id',
    async (req, res) => {
        try {
            // NOTE: if there is no film with the specified id, the delete operation is considered successful.
            await filmDao.deleteFilm(req.params.id);
            res.status(200).end();
        } catch (err) {
            res.status(503).json({error: `Database error during the deletion of film ${req.params.id}: ${err} `});
        }
    }
);


// PUT /api/films/:filmId
app.delete('/api/films/:filmId', async(req, res) => {

    const filmId = req.params.filmId;

    try{
        await filmLib.deleteFilmDB(filmId);
        res.status(200).end();
    }
    catch(e) {
        console.error(`Error: ${e.message}`);
        res.status(500).json({'error': `Impossible to delete film ${filmId}`});
    }
});



//avvio server
app.listen(port, () => 'API server started!');