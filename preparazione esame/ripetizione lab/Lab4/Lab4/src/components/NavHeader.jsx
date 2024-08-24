import { Container, Navbar, Form} from 'react-bootstrap';

function NavHeader() {
    return(
        <>
            <Navbar className="bg-primary" data-bs-theme='dark' >
                <Container fluid>
                    <Navbar.Brand href="#home">
                        <i className="bi bi-collection-play" />{' '}
                        Film Library
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
                    <i className='bi bi-person-circle text-muted h5 my-auto' />
                </Container>
            </Navbar>
        </>
    );
}

export default NavHeader