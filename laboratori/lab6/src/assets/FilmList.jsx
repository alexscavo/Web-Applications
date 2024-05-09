import { Table, Row, Col, InputGroup, Form } from "react-bootstrap";
import ReactStars from "react-rating-stars-component";


function FilmList(props) {

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

    return(
        <>
          <td>{props.film.title}</td>
          <td><Form.Check inline label="Favourite" checked={props.film.fav} readOnly/></td>
          <td>{props.film.date.isValid() ? props.film.date.format('YYYY-MM-DD') : ''}</td>
          <td><ReactStars count={5} readOnly size={24} activeColor="#ffd700" /></td>
        </>
      );
}

export default FilmList;