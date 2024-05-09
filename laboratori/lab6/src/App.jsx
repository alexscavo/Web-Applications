import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { useState } from 'react';
import './App.css';
import {Film, FilmLibrary} from './FilmModels.mjs';
import NavHeader from './assets/NavHeader';
import FilterList from './assets/FilterList';
import FilmList from './assets/FilmList';
import { Col, Container, ListGroup, Row} from 'react-bootstrap';

const filmLibrary = new FilmLibrary();

const film1 = new Film('Pulp Fiction', true, 'p1', '2024-03-10', 5);
const film2 = new Film('21 Grams', true, 'p1', '2024-03-30', 4);
const film3 = new Film('Star Wars', false, 'p1', '', 0);
const film4 = new Film('Matrix', false, 'p1', '', 0);
const film5 = new Film('Shrek', false, 'p1', '2024-04-15', 3);

filmLibrary.addNewFilm(film1);
filmLibrary.addNewFilm(film2);
filmLibrary.addNewFilm(film3);
filmLibrary.addNewFilm(film4);
filmLibrary.addNewFilm(film5);


function App() {

	const [filter, setFilter] = useState('All');
	const [filmLib, setFilmLib] = useState(filmLibrary);
	const [films, setFilms] = useState(filmLib.filmArray);
		

	const selectFilms = (filter) => {
		switch(filter) {
			case "All":
				setFilms([...filmLib.filmArray]);
				break;
			case "Favourites":
				setFilms(filmLib.getFavourites());
				break;
			case "Best Rated":
				setFilms(filmLib.getBestRated());
				break;
			case "Seen Last Month":
				setFilms(filmLib.seenLastMonth());
				break;
			case "Unseen":
				setFilms(filmLib.getUnseen());
				break
			default:
				break;
		}
	}


  const selectFilter = (filter) => {  /*funzione per settare lo stato del filtro*/
    setFilter(filter);
	selectFilms(filter);
  }

  return (
    <>
      <NavHeader /> 
      <Container fluid className='mt-3'>
        <Row>
        <Col sm='3'>
          <FilterList selectFilter={selectFilter}/>
        </Col>
        <Col sm='9'>
          <FilmList filterType={filter} filmList={films}/>
        </Col>
        </Row>
      </Container>  
    </>
  );
}

export default App;
