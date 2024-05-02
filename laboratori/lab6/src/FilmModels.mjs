import dayjs from 'dayjs';

let currentFilmId = 0;

/*
------DEFINIZIONE CLASSI------
*/
function Film(title, fav, userId, date = '', rating = 0, id = -1){ //rating è opzionale
    
    this.filmId = currentFilmId++;
    this.fav = fav;
    this.rating = rating;
    this.userId = userId;
    this.title = title;
    this.date = dayjs(date);
    
    if(id != -1)
        this.filmId = id;
    
    this.toString = () => {
        return `FilmId: ${this.filmId},  Title: ${this.title},  Favourite: ${this.fav},  Date: ${this.date.format('YYYY-MM-DD')},  Score:${this.rating},  User:${this.userId}\n`;
    }
}

function FilmLibrary(){

    this.filmArray = [];    //array contenente i film

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

    this.getFilms = () => {
        return [...this.filmArray];
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

    this.getFavourites = () => {

        return [...this.filmArray].filter((film) => film.fav === true);
    }

    this.getBestRated = () => {

        return [...this.filmArray].filter((film) => film.rating === 5);
    }

    this.seenLastMonth = () => {
        return [...this.filmArray].filter((film) => dayjs(film.date).isAfter(dayjs().subtract(30, 'day')));
    }

    this.getUnseen = () => {
        return [...this.filmArray].filter((film) => !dayjs(film.date).isValid());
    }
}


export {Film, FilmLibrary};