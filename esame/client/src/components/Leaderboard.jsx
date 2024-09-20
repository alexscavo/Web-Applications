import {Col, Row, ListGroup, Container} from 'react-bootstrap';
import { Link } from 'react-router-dom';


const Leaderboard = (props) => { 
    return (
        <>
        <Container fluid="md" className='my-5' id='leaderboard-container'>
            <Row className="justify-content-md-center">
                <Container className="numbers-grid-container py-2 px-auto my-4">
                    <ListGroup id='leaderboard-list'>
                        {props.top3.map((user, index) => (
                            <LeaderBoardRow key={index} id={index + 1} user={user} />
                        ))}
                    </ListGroup>
                </Container>
            </Row>
        </Container>
        </>
    );
}

function LeaderBoardRow(props) {
    return (
        <ListGroup.Item className='leaderboard-row' id={`leaderboard-row-${props.id}`}>
            <div className="d-flex justify-content-between align-items-center mx-5">
                <span id={`leaderboard-number-${props.id}`}>
                    {props.id === 1 ? <i className="bi bi-1-circle-fill" id='icon-1'></i> :
                    props.id === 2 ? <i className="bi bi-2-circle-fill" id='icon-2'></i> :
                    <i className="bi bi-3-circle-fill" id='icon-3'></i>}
                </span>
                <span>{props.user.email}</span>
                <span>{props.user.points} punti</span>
            </div>
        </ListGroup.Item>
    );
}

export default Leaderboard;