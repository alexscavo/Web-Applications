'use strict';

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
    this.date = dayjs(date).format('YYYY-MM-DD');
    
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
}











/*
------JS PER HTML------
*/


function createFilmRow(film) {

    const tr = document.createElement('tr');    //creo una table row

    tr.setAttribute('id', `film-${film.filmId}`);   //serve per identificare il film 

    const tdTitle = document.createElement('td');   //creo un td per il titolo
    tdTitle.innerText = film.title;
    tr.appendChild(tdTitle);

    const tdFavourite = document.createElement('td');   //creo un td per il titolo
    tdFavourite.innerText = 'Favourite';
    tr.appendChild(tdFavourite);

    const tdDate = document.createElement('td');   //creo un td per il titolo
    if(!dayjs(film.date).isValid())
        tdDate.innerText = '';
    else
        tdDate.innerText = film.date;
    tr.appendChild(tdDate);

    

    return tr;
}

function fillFilmLibraryTable(filmLib) {

    const filmTable = document.getElementById('filter-table');

    let films = filmLib.getFilms();

    filmTable.innerHTML = "";

    for(const film of films){
        const trFilm = createFilmRow(film);
        filmTable.prepend(trFilm);
    }
}


function main() {

    const film1 = new Film('Pulp Fiction', true, 'p1', '2024-03-10', 5);
    const film2 = new Film('21 Grams', true, 'p1', '2024-03-17', 4);
    const film3 = new Film('Star Wars', false, 'p1', '', 0);
    const film4 = new Film('Matrix', false, 'p1', '', 0);
    const film5 = new Film('Shrek', false, 'p1', '2024-03-21', 3);

    const filmLib = new FilmLibrary();

    filmLib.addNewFilm(film1);
    filmLib.addNewFilm(film2);
    filmLib.addNewFilm(film3);
    filmLib.addNewFilm(film4);
    filmLib.addNewFilm(film5);

    fillFilmLibraryTable(filmLib);
}



main();