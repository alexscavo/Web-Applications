import dayjs from 'dayjs';
import sqlite from 'sqlite3';  
import Film from './Film.mjs';


export default function FilmLibrary() {

    this.filmList = [];

    const db = new sqlite.Database('films.db', (err) => {
        if(err)
            throw err;
    });

    this.closeDB = () => {
        try {
            db.close();
        } catch (error) {
            console.error(`Impossible to close the database! ${error}`);
        }
    }


    this.addNewFilm = (film) => {
        if(!this.filmList.some(f => f.id === film.id))
            this.filmList.push(film);
    }

    this.sortByDate = () => {
        const newList = [...this.filmList];
        newList.sort((a, b) => {
            if(a.watchDate === null)
                return 1;
            if(b.watchDate === null)
                return -1;

            if(dayjs(a.watchDate).isAfter(dayjs(b.watchDate)))
                return 1;

            return -1;
        });
        return newList;
    }

    this.deleteFilm = (filmId) => {
        
        const newList = this.filmList.filter(film => film.id !== filmId);
        this.filmList = newList;
    }
    
    this.resetWatchedFilms = () => {

        const newList = this.filmList.map(film => new Film(film.id, film.title, film.userId, film.favourites, null, film.rating));
        this.filmList = newList;
    }

    this.getRated = () => {
        const newList = this.filmList
                            .filter(film => film.rating > 0)
                            .sort((a, b) => a.score - b.score);

        return newList;
    }

    /* server functions */

    // retrieve all the films
    this.getAll = () => {
        return(new Promise((resolve, reject) => {
            const sql = 'SELECT * FROM films';

            db.all(sql, [], (err, rows) => {
                if(err)
                    reject(err);
                const films = rows.map(line => new Film(line.id, line.title, line.userId, line.isFavourite, line.watchDate, line.rating));
                resolve(films);
            });
        }));
    }

    // retrieve all favourite films
    this.getFavourites = () => {
        return(new Promise((resolve, reject) => {
            const sql = 'SELECT * FROM films WHERE isFavourite = 1';
            db.all(sql, [], (err, rows) => {
                if(err) 
                    reject(err);

                const films = rows.map(line => new Film(line.id, line.title, line.userId, line.isFavourite, line.watchDate, line.rating));
                resolve(films);
            });
        }));
    }

    // retrieve all films watched today
    this.getWatchedToday = () => {
        return(new Promise((resolve, reject) => {
            
            const sql = 'SELECT * FROM films WHERE watchDate = ?';
            db.all(sql, [dayjs().format('YYYY-MM-DD')], (err, rows) => {
                if(err) 
                    reject(err);

                const films = rows.map(line => new Film(line.id, line.title, line.userId, line.isFavourite, line.watchDate, line.rating));
                resolve(films);
            });
        }));
    }

    // retrieve films whose watch date is earlier then a given date
    this.getWatchedBeforeDate = (date) => {
        return(new Promise((resolve, reject) => {

            const sql = 'SELECT * FROM films WHERE watchDate < ?';
            db.all(sql, [dayjs(date).format('YYYY-MM-DD')], (err, rows) => {
                if(err) 
                    reject(err);

                const films = rows.map(line => new Film(line.id, line.title, line.userId, line.isFavourite, line.watchDate, line.rating));
                resolve(films);
            });
        }));
    }

    // retrieve films whose rating is grater than or equal to a given number
    this.getRatingGraterEqualThan = (rating) => {
        return(new Promise((res, rej) => {

            const sql = 'SELECT * FROM films WHERE rating >= ?';
            db.all(sql, [rating], (err, rows) => {
                if(err) 
                    rej(err);

                const films = rows.map(line => new Film(line.id, line.title, line.userId, line.isFavourite, line.watchDate, line.rating));
                res(films);
            });
        }));
    }

    // retrieve films whose title contains a string passed as parameter
    this.getContainingString = (string) => {
        return(new Promise((res, rej) => {
            
            const sql = 'SELECT * FROM films WHERE title LIKE ?';
            db.all(sql, [`%${string}%`], (err, rows) => {
                if(err) 
                    rej(err);

                const films = rows.map(line => new Film(line.id, line.title, line.userId, line.isFavourite, line.watchDate, line.rating));
                res(films);
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

    // delete the watch date of all the films in the library
    this.resetWatchDates = () => {
        return new Promise((resolve, reject) => {
            const query = 'UPDATE films SET watchDate = NULL';
            db.run(query, [], (err) => {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            });
        });
    };

}