import dayjs from 'dayjs';
import Film from './Film.mjs';
import db from './db.mjs';
import { check } from 'express-validator';

const filters = {
    'filter-favourites': {label: 'Favourites', filterFunction: film => film.favourite},
    'filter-best': {label: 'Best', filterFunction: film => film.rating === 5},
    'filter-unseen': {label: 'Unseen', filterFunction: film => film.watchDate === null},
    'filter-lastmonth': {label: 'LastMonth', filterFunction: film => checkLastMonth(film.watchDate)}
}

function checkLastMonth(watchDate) {

    const date = dayjs(watchDate);

    const today = dayjs();
    const prevMonthDate = today.subtract(today.daysInMonth());


    if(date.year() === today.year()){
        if(date.month() === today.month()){
            if(date.isBefore(today))
                return true;
        }
        else if(date.month() === today.month()-1) {
            if(date.isAfter(prevMonthDate))
                return true;
        }
        else
            return false;
    }
    return false;
}


export default function FilmLibraryDAO() {

    this.filmList = [];

    /* server functions */

    this.getFilms = (filterType) => {
        
        return(new Promise((resolve, reject) => {
            const sql = 'SELECT * FROM films';
        
            db.all(sql, [], (err, rows) => {
                if(err)
                    reject(err);

                const films = rows.map(line => new Film(line.id, line.title, line.userId, line.isFavourite === 1, line.watchDate, line.rating))
                
                if(filters.hasOwnProperty(filterType))
                    resolve(films.filter(filters[filterType].filterFunction));
                
                resolve(films);
            });
        }));
    }

    this.getFilmById = (id) => {
        return(new Promise((resolve, reject) => {
            const sql = 'SELECT * FROM films WHERE id = ?';

            db.get(sql, [id], (err, row) => {
                if(err)
                    reject(err);

                if(row === undefined)
                    resolve({err: 'Film not found'});

                else {
                    const film = new Film(row.id, row.title, row.userId, row.isFavourite === 1, row.watchDate, row.rating);

                    resolve(film);
                }
                
            });
        }));
    }

    // add a film
    this.addFilm = (film) => {
        return(new Promise((res, rej) => {
            
            const sql = 'INSERT INTO films(title, isFavourite, rating, watchDate, userId) VALUES (?, ?, ?, ?, ?)';
            let rating = undefined;
            let watchDate = film.watchDate ? film.watchDate : null;
            let isFavourite = film.isFavourite === true ? 1 : 0;

            if(!film.rating || film.rating <= 0 || film.rating > 5)
                rating = null;
            else
                rating = film.rating; 

            db.run(sql, [film.title, isFavourite, rating, watchDate, film.userId], function(err) {
                if(err)
                    rej(err);
                film.id = this.lastID;
                res(film);
            });
        }));
    }

    this.updateFilm = (id, film) => {
        return(new Promise((resolve, reject) => {
            const sql = 'UPDATE films SET title=?, isFavourite=?, rating=?, watchDate=?, userId=? WHERE id = ?';

            const favourite = film.favourite === true ? 1 : 0;
            let rating = undefined;
            const watchDate = film.watchDate ? film.watchDate : null;

            if(!film.rating || film.rating <= 0 || film.rating > 5)
                rating = null;
            else
                rating = film.rating;

            db.run(sql, [film.title, favourite, rating, watchDate, film.userId, id], function(err) {
                if(err)
                    reject(err);

                resolve();
            });
        }));
    }

    this.updateRating = (id, rating) => {
        return(new Promise((resolve, reject) => {
            const sql = 'UPDATE films SET rating=? WHERE id = ?';

            db.run(sql, [rating, id], function(err) {
                if(err)
                    reject(err);

                resolve();
            });
        }));
    }

    this.updateFavourite = (id, fav) => {
        return(new Promise((resolve, reject) => {
            const sql = 'UPDATE films SET isFavourite=? WHERE id = ?';

            const favourite = fav === true ? 1 : 0;

            db.run(sql, [favourite, id], function(err) {
                if(err)
                    reject(err);

                resolve();
            });
        }));
    }

    // delete a film
    this.deleteFilm = (filmId) => {
        return(new Promise((res, rej) => {
            const sql = 'DELETE FROM films WHERE id = ?';
            db.run(sql, [filmId], function(err) {
                if(err)
                    rej(err);

                res();
            });
        }));
    }

}