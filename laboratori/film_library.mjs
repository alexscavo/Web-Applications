import dayjs from 'dayjs';
import sqlite from 'sqlite3';

//films copt è quello originale
const db1 = new sqlite.Database('films copy.db', (err) => {
    if(err) throw err;
});

//films è quello modificato
const db = new sqlite.Database('films.db', (err) => {
    if(err)
        throw err;
});
let currentFilmId = 1;


export function Film(title, fav, userId, date = '', rating = 0, id = -1){ //rating è opzionale
    
    this.filmId = currentFilmId++;
    this.fav = fav;
    this.rating = rating;
    this.userId = userId;
    this.title = title;
    this.date = dayjs(date).format('YYYY-MM-DD');
    
    if(id != -1)
        this.filmId = id;
    
    this.toString = () => {
        return `FilmId: ${this.filmId},  Title: ${this.title},  Favourite: ${this.fav},  Date: ${this.date.format('YYYY-MM-DD')},  Score:${this.rating},  User:${this.userId}\n`;
    }

}

export function FilmLibrary(){

    this.filmArray = [];

    this.closeDB = () => {
        try {
            db.close();
        } catch (error) {
            console.error(`Impossible to close the database! ${error}`);
        }
    }

    this.addNewFilm = (film) => {
        this.filmArray.push(film);
    }

    this.printFilmLibrary = () => {
        for(let film of this.filmArray)
            console.log(''+film);
    }

    this.sortByDate = () => {
        
        return this.filmArray.sort((a, b) => {
            if(!dayjs(a.date).isValid())
                return 1;
            else if(!dayjs(b.date).isValid())
                return -1;
            else if(a.date.isAfter(b.date))
                return 1;

            return -1;
        }); 
    }

    this.deleteFilm = (filmId) => this.filmArray = this.filmArray.filter((a) => a.filmId !== filmId);

    this.resetWatchedFilms = () => {
        for(let film of this.filmArray)
            film.date = dayjs(''); 
    }

    this.getRated = () => {
        const ratingLib = Object.assign([], this.filmArray);

        for(let i=0; i < ratingLib.length; i++){
            let film = ratingLib[i];

            if(film.rating == 0){
                ratingLib.pop(i);
                i--;
            }
        }

        return ratingLib.sort((a, b) => {
            if(a.rating > b.rating)
                return -1;
            
            return 1;
        });
    }

    //ritorno il vettore di film
    this.getFilms = () => {

        return new Promise((resolve, reject) => {
            const sql = 'SELECT * FROM films';

            db1.all(sql, [], (err, rows) => {

                if(err)
                    reject(err);
                else{
                    const films = rows.map(row => new Film(row.title, row.isFavorite, row.userId, row.watchDate, row.rating));

                    this.filmArray = Array.from(films);

                    resolve(films);
                }
            });
        });
    }

    //ritorno vettore di film preferiti
    this.getFavourites = () => {
        
        return new Promise((resolve, reject) => {

            const sql = 'SELECT * FROM films WHERE isFavorite = 1';

            db1.all(sql, [], (err, rows) => {
                if(err)
                    reject(err);
                else{
                    const returnVect = rows.map(row => new Film(row.title, row.isFavorite, row.userId, row.watchDate, row.rating));

                    resolve(returnVect);
                }
            })
        });
    }

    //film guardati oggi
    this.watchedToday = () => {

        return new Promise((resolve, reject) => {

            const sql = 'SELECT * FROM films WHERE watchDate = ?';

            db1.all(sql, [dayjs().format('YYYY-MM-DD')], (err, rows) => {

                if(err)
                    reject(err);
                else{
                    const returnVect = rows.map(row => new Film(row.title, row.isFavorite, row.userId, row.watchDate, row.rating));

                    resolve(returnVect);
                }
            });
        });
    }

    //film guardati prima di una data passata come parametro
    this.watchedEarlier = (date) => {

        return new Promise((resolve, reject) => {
            const sql = 'SELECT * FROM films WHERE watchDate < ?';

            db1.all(sql, [date], (err, rows) => {
    
                if(err)
                    reject(err);
                else{
                    const returnVect = rows.map(row => new Film(row.title, row.isFavorite, row.userId, row.watchDate, row.rating));

                    resolve(returnVect);
                }
            })
        });
    }

    //film con un rating >= ad uno passato come parametro
    this.ratingGraterThan = (rating) => {

        return new Promise((resolve, reject) => {

            const sql = 'SELECT * FROM films WHERE rating >= ?';

            db1.all(sql, [rating], (err, rows) => {
                if(err)
                    reject(err);
                else{
                    const returnVect = rows.map(row => new Film(row.title, row.isFavorite, row.userId, row.watchDate, row.rating));

                    resolve(returnVect);
                }
            });
        });
    }

    //film aventi il titolo contenente una stringa passata come parametro
    this.titleContainigString = (string) => {
        return new Promise((resolve, reject) => {

            const sql = 'SELECT * FROM films WHERE title LIKE ?';

            const str = '%'+string+'%';

            db1.all(sql, [str], (err, rows) => {
                if(err)
                    reject(err);
                else{
                    const returnVect = rows.map(row => new Film(row.title, row.isFavorite, row.userId, row.watchDate, row.rating));

                    resolve(returnVect);
                }
            });
        });
    }
    
    //inserimento nuovo film nel db
    this.insertNewMovie = (film) => {

        return new Promise((resolve, reject) => {

            const sql = 'INSERT INTO films(title, isFavorite, rating, watchDate, userId) VALUES(?, ?, ?, ?, ?)';
            let rating = undefined;
            
            if (!film.rating || film.rating < 1 || film.rating > 5) 
                rating = null;
            else
                rating = film.rating;


            db1.run(sql, [film.title, film.fav, film.rating, film.date.format('YYYY-MM-DD'), film.userId], function (err) {

                if(err){
                    reject(err);
                }
                else{
                    resolve(film.filmId);
                }
            });
        });
    }

    //rimozione film dato il suo id
    this.removeFilm = (id) => {

        return new Promise((resolve, reject) => {

            const sql = 'DELETE FROM films WHERE id = ?';

            db1.run(sql, [id], function (err) {
                if(err)
                    reject(err);
                else{
                    console.log('Tutto ok');
                    resolve();
                }
            });
        });
    }

    //prendo i film mai stati visti
    this.getUnseen = () => {

        return new Promise((resolve, reject) => {

            const today = dayjs().format('YYYY-MM-DD').toString();

            const year = dayjs().year();
            const month = dayjs().month();
            const day = dayjs().day();

            let firstDay = '';

            if(month < 10){
                 firstDay = `${year}-0${month-1}-${day}`;    
            }
            else{
                firstDay = `${year}-${month-1}-${day}`;
            }

            const sql = "SELECT * FROM films WHERE watchDate <= ? AND watchDate >= ?";

            db1.all(sql, [today, firstDay], (err, rows) => {

                if(err)
                    reject(err);
                else{
                    const returnVect = rows.map(row => new Film(row.title, row.isFavorite, row.userId, row.watchDate, row.rating));

                    resolve(returnVect);
                }
            });
        });
    }

    //prendo un film in base al suo id
    this.getFilm = (filmId) => {

        return new Promise((resolve, reject) => {

            const sql = 'SELECT * FROM films WHERE id = ?';

            db1.get(sql, [filmId], (err, row) => {

                if(err)
                    reject(err);

                else if(row === undefined)
                    resolve({error: "Film not available, check the inserted id"});

                else
                    resolve(new Film(row.title, row.isFavorite, row.userId, row.watchDate, row.rating, row.id));
                
            });
        })
    } 
    
    //aggiorna un film esistente
    this.updateFilm = (film) => {

        return new Promise((resolve, reject) => {

            const query = 'UPDATE films SET title = ?, isFavorite = ?, rating = ?, watchDate = DATE(?), userId = ? WHERE id = ?';

            db1.run(query, [film.title, film.isFavourite, film.rating, film.watchDate, film.userId, film.filmId], function (err) {
                
                if(err)
                    reject(err);
                else{
                    console.log('Tutto ok');
                    resolve(this.lastID);
                }
            });
        });
    }


}

/*
async function main(){

    const myLib = new FilmLibrary();
*/
    /*
    const film1 = new Film('Pulp Fiction', true, 'p1', '2024-03-10', 5);
    const film2 = new Film('21 Grams', true, 'p1', '2024-03-17', 4);
    const film3 = new Film('Star Wars', false, 'p1', '', 0);
    const film4 = new Film('Matrix', false, 'p1', '', 0);
    const film5 = new Film('Shrek', false, 'p1', '2024-03-21', 3);

    myLib.addNewFilm(film1);
    myLib.addNewFilm(film2);
    myLib.addNewFilm(film3);
    myLib.addNewFilm(film4);
    myLib.addNewFilm(film5);

    //console.log(dayjs(film3.date).isValid());

    console.log('\n-------------Libreria Iniziale-------------\n');
    myLib.printFilmLibrary();


    myLib.sortByDate();
    console.log('\n-------------Libreria Ordinata-------------\n');
    myLib.printFilmLibrary();
    */
    /*
    myLib.deleteFilm('f2');
    console.log('\n-------------Rimuovo f2-------------\n');
    myLib.printFilmLibrary();

    console.log('\n-------------Rimuovo le Date-------------\n');
    myLib.resetWatchedFilms();
    myLib.printFilmLibrary();*/

    /*
    console.log('\n***** Films filtered, only the rated ones *****\n');
    const sortedScoreLib = new FilmLibrary();
    sortedScoreLib.filmArray = myLib.getRated();
    sortedScoreLib.printFilmLibrary();
    */
/*
    //carico i film da db
    const filmVett = await myLib.getFilms();
    console.log('\n---------TUTTI I FILM----------\n'+filmVett);

    //creo vettore di film preferiti
    const favVett = await myLib.getFavourites();
    console.log('\n---------FILM PREFERITI----------\n'+favVett);

    //cerco film recensiti oggi
    const watchToday = await myLib.watchedToday();
    console.log('\n---------FILM GUARDATI OGGI----------\n'+watchToday);

    //cerco film guardati prima di una certa data
    const watchedEarlier = await myLib.watchedEarlier('2024-03-18');
    console.log('\n---------FILM GUARDATI PRIMA DI 2024/03/18----------\n'+watchedEarlier);

    //film con un rating superiore ad un rating dato
    const ratingGraterThan = await myLib.ratingGraterThan(4);
    console.log('\n---------FILM AVENTI RATING MAGGIORE DI UN VALORE DATO----------\n'+ratingGraterThan);

    //cerco contenenti una determinata stringa
    const containigString = await myLib.titleContainigString('s');
    console.log('\n---------FILM CONTENENTI UNA DATA STRINGA----------\n'+containigString);

    //inserisco un nuovo film all'interno del DB
    const film = new Film('Harry Potter', 1, 'p16', '2024-03-21', 5);
    await myLib.insertNewMovie(film);

    //elimino un film dalla libreria dato il suo id
    await myLib.removeFilm(1);
}


main();
*/
