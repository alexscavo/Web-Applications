import 'bootstrap-icons/font/bootstrap-icons.css';
import { useState } from 'react';
import { Table, Row, Col, InputGroup, Form, Button } from "react-bootstrap";
import ReactStars from "react-rating-stars-component";


function filmLib(props) {

    
    return(
        <>
        <Row>
            <Col as='h1'>{props.filterType}</Col>
        </Row>
        <Row>
            {/*<Col lg={10} className="mx-auto">*/}
            <FilmTable films={props.filmList}></FilmTable>
            {/*</Col>*/}
        </Row>
        </>
    );
}

function FilmTable(props) {
    
    return(
        <Table striped>
            <tbody>
                { props.films.map((film) => <FilmRow singleFilm={film} key={film.filmId}/>) }
            </tbody>
        </Table>
    );
}

function FilmRow(props) {
    
    return(
        <tr><FilmData film={props.singleFilm}/></tr>
      );
}

function FilmData(props) {

    const [rating, setRating] = useState(props.film.rating || 0);   // se props.film.rating non e' definito usa 0
    const [hoverRating, setHoverRating] = useState(0);

    const onMouseEnter = (index) => {   // quando il mouse arriva sulla stellina
        setHoverRating(index);
    };

    const onMouseLeave = () => {    // quando il mouse esce dalla stellina
        setHoverRating(0);
    };

    const onSaveRating = (index) => {
        setRating(index);
    };

    return(
        <>
          <td>{props.film.title}</td>
          <td><Form.Check inline label="Favourite" checked={props.film.fav} readOnly/></td>
          <td className='right-aligned'>{props.film.date.isValid() ? props.film.date.format('YYYY-MM-DD') : ''}</td>
          <td className='right-aligned'>
            {[1, 2, 3, 4, 5].map((index) => {
              return (
                <i 
                  key={index}
                  className={index <= (hoverRating || rating) ? 'bi bi-star-fill' : 'bi bi-star'}
                  //onMouseEnter={() => onMouseEnter(index)}
                  //onMouseLeave={onMouseLeave}
                  //onClick={() => onSaveRating(index)}
                  style={{color: index <= (hoverRating || rating) ? "#ffc107" : "#e4e5e9", cursor: "pointer"}}
                />
              );
            })}
          </td>
          <td className='right-aligned'>
            <Button variant='transparent'><i className='bi bi-pen'/></Button>
            <Button variant='transparent'><i className='bi bi-trash'/></Button>
          </td>
        </>
      );
}

export default filmLib;