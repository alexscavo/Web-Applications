import FilmLibrary from "./FilmLibrary.mjs";
import Film from './Film.mjs';

async function main() {
    
    const narnia = new Film(8, 'Narnia', 1, 1, 'March 10, 2024', 5);

    const filmLibrary = new FilmLibrary();
    
    // --- LEGGO TUTTI I FILM --- // 
    const allFilms = await filmLibrary.getAll();
    //console.log(allFilms);

    // --- FILM PREFERITI --- //
    const favouriteFilms = await filmLibrary.getFavourites();
    //console.log(favouriteFilms);

    // --- FILM VISTI OGGI --- //
    const watchedToday = await filmLibrary.getWatchedToday();
    //console.log(watchedToday);

    // --- FILM VISTI PRIMA DI UNA CERTA DATA --- //
    const watchedBeforeDate = await filmLibrary.getWatchedBeforeDate('2024-03-17');
    //console.log(watchedBeforeDate);

    // --- FILM CON RATING MAGGIORE DI UN CERTO VALORE --- //
    const ratingGraterThan = await filmLibrary.getRatingGraterEqualThan(4);
    //console.log(ratingGraterThan);

    // --- FILM CON IL TITOLO CHE CONTIENE UNA STRINGA --- // 
    const containingString = await filmLibrary.getContainingString('ulp');
    //console.log(containingString);

    // --- AGGIUNTA DI UN FILM --- //
    const film = await filmLibrary.addFilm(narnia);
    //console.log(film.id);
    //console.log(await filmLibrary.getAll());

    // --- CANCELLAZIONE FILM --- // 
    //await filmLibrary.deleteFilm(6);
    //console.log(await filmLibrary.getAll());

    // --- AZZERAMENTO WATCHDATE ---//
    await filmLibrary.resetWatchDates();
    console.log(await filmLibrary.getAll());
}

main();