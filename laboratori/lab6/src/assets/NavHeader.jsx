import {Navbar, Container, Nav, Button, Form} from 'react-bootstrap';



function NavHeader() {
    return(
    <Navbar bg='primary' data-bs-theme='dark'>
        <Container fluid>
            
            <Navbar.Brand href="#index.html">
                <i className='bi bi-collection-play me-2 flex-shrink-0' />Film Library
            </Navbar.Brand>
            <Form className="d-flex">
            <Form.Control
              type="search"
              placeholder="Search"
              className="me-2"
              aria-label="Search"
              id="search-bar"
            />
          </Form>
          <i className='bi bi-person-circle text-white' id='navbar-right-icon' />
        </Container>
    </Navbar>
);
}


export default NavHeader;