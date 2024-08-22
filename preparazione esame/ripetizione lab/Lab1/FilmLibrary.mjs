import dayjs from 'dayjs';

function Film(id, title, userId = 1, favourites = false, watchDate = null, rating = 0){

    this.id = id;
    this.title = title;
    this.userId = userId;
    this.favourites = favourites;
    this.watchDate = watchDate && dayjs(watchDate).format('YYYY-MM-DD');
    this.rating = rating;
}


function FilmLibrary() {

    this.filmList = [];

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

}







function main() {
    const film1 = new Film(1, 'Pulp Fiction', 1, true, 'March 10, 2024', 5);
    const film2 = new Film(2, '21 Grams', 1, true, 'March 17, 2024', 4);
    const film3 = new Film(3, 'Star Wars', 1, false, null,  0);
    const film4 = new Film(4, 'Matrix', 1, false, null, 0);
    const film5 = new Film(5, 'Shrek', 1, false, 'March 21, 2024', 3);

    
    const filmLibrary = new FilmLibrary();
    filmLibrary.addNewFilm(film1);
    filmLibrary.addNewFilm(film2);
    filmLibrary.addNewFilm(film3);
    filmLibrary.addNewFilm(film4);
    filmLibrary.addNewFilm(film5);
    filmLibrary.addNewFilm(film5);
    filmLibrary.addNewFilm(film5);

    filmLibrary.sortByDate();

    filmLibrary.resetWatchedFilms();

    console.log(filmLibrary.filmList);

    //filmLibrary.deleteFilm(5);
    

    console.log(filmLibrary.filmList);
    console.log('/----------------------/');
    console.log(filmLibrary.getRated());
}

main();