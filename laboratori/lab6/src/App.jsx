import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { useState } from 'react';
import './App.css';
import {Film, FilmLibrary} from './FilmModels.mjs';
import NavHeader from './assets/NavHeader';
import FilterList from './assets/FilterList';
import FilmList from './assets/FilmList';
import { Col, Container, ListGroup, Row} from 'react-bootstrap';

const filmLib = new FilmLibrary();

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


function App() {

  return (
    <>
      <NavHeader /> 
      <Container fluid className='mt-3'>
        <Row>
        <Col sm='3'>
          <FilterList />
        </Col>
        <Col sm='9'>
          <FilmList filterType={'All'} filmList={filmLib.filmArray}/>
        </Col>
        </Row>
      </Container>  
    </>
  );
}

export default App;
