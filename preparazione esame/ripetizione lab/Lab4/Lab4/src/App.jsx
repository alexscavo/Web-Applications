import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { useState } from 'react'
import './App.css'
import NavHeader from './components/NavHeader';
import SideBar from './components/SideBar';
import { Row, Col, Container } from 'react-bootstrap';

function App() {

  return (
    <>
    <NavHeader />
    <Container fluid>
        <Row className='my-3'>
            <Col sm={3}>
                <SideBar />
            </Col>
            <Col sm={9}>
            
            </Col>
        </Row>
    </Container>
    
    </>
  )
}

export default App;
