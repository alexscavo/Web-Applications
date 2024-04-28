'use strict';

let currentFilmId = 0;
const filmLib = new FilmLibrary();
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

//list of possible filters
const listItemsData = [
    "All",
    "Favourites",
    "Best Rated",
    "Seen Last Month",
    "Unseen"
];









/*
------JS PER HTML------
*/


function createFilmRow(film) {  // crea una riga contenente il film

    const tr = document.createElement('tr');    //creo una table row

    tr.setAttribute('id', `film-${film.filmId}`);   //serve per identificare il film 

    /*---TITOLO---*/
    const tdTitle = document.createElement('td');   
    tdTitle.innerText = film.title;
    tr.appendChild(tdTitle);

    /*---FAVOURITE---*/
    const checkboxFav = document.createElement('td');   
    if(film.fav == 1)
        checkboxFav.innerHTML = '<input class="form-check-input" type="checkbox" value="" aria-label="..." checked disabled> Favourite';
    else
        checkboxFav.innerHTML = '<input class="form-check-input" type="checkbox" value="" aria-label="..." disabled> Favourite';
    tr.appendChild(checkboxFav);

    /*---DATE---*/
    const tdDate = document.createElement('td');   
    if(!dayjs(film.date).isValid())
        tdDate.innerText = '';
    else
        tdDate.innerText = film.date;
    tr.appendChild(tdDate);

    /*---RATING---*/
    const tdRating = document.createElement('td');  // creo td per le stelline del rating

        for(let i=0; i<film.rating; i++){
            const iStarFill = document.createElement('i');
            iStarFill.classList.add('bi', 'bi-star-fill');
            tdRating.appendChild(iStarFill);
        }

        for(let i=0; i<5-film.rating; i++){
            const iStarEmpty = document.createElement('i');
            iStarEmpty.classList.add('bi', 'bi-star');
            tdRating.appendChild(iStarEmpty);
        }
    tr.appendChild(tdRating);

    /*---BUTTONS---*/
    const tdButtons = document.createElement('td');
        const buttonModify = document.createElement('button');
        buttonModify.classList.add('btn');
        buttonModify.setAttribute('data-bs-toggle', 'button');
        buttonModify.setAttribute('disabled', 'true');
        buttonModify.innerHTML = '<i class="bi bi-pen"></i>';
        tdButtons.appendChild(buttonModify);

        const buttonDelete = document.createElement('button');
        buttonDelete.classList.add('btn');
        buttonDelete.setAttribute('data-bs-toggle', 'button');
        buttonDelete.innerHTML = '<i class="bi bi-trash"></i>';
        tdButtons.appendChild(buttonDelete);

        buttonDelete.addEventListener('click', event => {   // quando viene cliccato elimina la riga corrispondente
            tr.remove();
        });

    tr.appendChild(tdButtons);



    return tr;
}

function fillFilmLibraryTable(filmList) {    // data una lista di film crea la tabella contenente i film

    const filmTable = document.getElementById('filter-table');

    filmTable.innerHTML = "";

    for(const film of filmList){
        const trFilm = createFilmRow(film);
        filmTable.append(trFilm);
    }
}


function selectFilter(filter) {

    const filterTitle = document.getElementById('selected-filter-title');
    
    filterTitle.innerText = `${filter}`;    // scrivo il titolo del filtro

    let selectedFilms = [];

    switch(filter) {
        case "All":
            selectedFilms = [...filmLib.filmArray];
            break;
        case "Favourites":
            selectedFilms = filmLib.getFavourites();
            break;
        case "Best Rated":
            selectedFilms = filmLib.getBestRated();
            break;
        case "Seen Last Month":
            selectedFilms = filmLib.seenLastMonth();
            break;
        case "Unseen":
            selectedFilms = filmLib.getUnseen();
            break;
        default:
            break;

    }

    fillFilmLibraryTable(selectedFilms);
        
}


//---CREA LISTA DI FILTRI---//
function createFilter() {

    const filterList = document.getElementById('select-filter-list');

    for(let i=0; i<listItemsData.length; i++) { // per ogni filtro nella lista creo una "riga" nel list group
        const liItem = document.createElement('li');
        liItem.classList.add('list-group-item');

        if(i == 0){
            liItem.classList.add('active');
        }

        liItem.setAttribute('id', `${listItemsData[i]}`);
        liItem.innerText = `${listItemsData[i]}`;
        filterList.append(liItem);

        liItem.addEventListener('click', event => {
            filterList.querySelectorAll('.list-group-item').forEach(item => {   // per rimuovere l'active da tutte gli item
                item.classList.remove('active');
            });
            liItem.classList.add('active');     // attivo solo l'item cliccato
            liItem.replaceWith(liItem);
            selectFilter(listItemsData[i]);
        });
    }
    
}

function main() {

    const film1 = new Film('Pulp Fiction', true, 'p1', '2024-03-10', 5);
    const film2 = new Film('21 Grams', true, 'p1', '2024-03-30', 4);
    const film3 = new Film('Star Wars', false, 'p1', '', 0);
    const film4 = new Film('Matrix', false, 'p1', '', 0);
    const film5 = new Film('Shrek', false, 'p1', '2024-04-15', 3);

    

    filmLib.addNewFilm(film1);
    filmLib.addNewFilm(film2);
    filmLib.addNewFilm(film3);
    filmLib.addNewFilm(film4);
    filmLib.addNewFilm(film5);

    fillFilmLibraryTable(filmLib.filmArray);

    createFilter();
}



main();