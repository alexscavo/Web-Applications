import { Table, Row, Col } from "react-bootstrap";


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
          <td>{props.film.fav}</td>
          <td>{props.film.date.format('YYYY-MM-DD')}</td>
        </>
      );
}

export default FilmList;