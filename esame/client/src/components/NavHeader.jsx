import {Container, Navbar, Form} from 'react-bootstrap';
import {LoginButton, LogoutButton} from './Auth';

export default function NavHeader(props) {
    return (
        <>
            <Navbar className="custom-navbar" data-bs-theme='dark' >
                <Container fluid className='mx-3'>
                    <Navbar.Brand href="/play">         
                    <span className="icon">
                            <svg
                                viewBox="0 0 64 64"
                                xmlns="http://www.w3.org/2000/svg"
                                width={'35px'}
                                height={'35px'}
                                fill={'#F97300'}  
                            >
                                <g id="a">
                                    <path d="M52.2,11.46c-2.39,0-4.46,1.32-5.57,3.26-4.03-6.62-11.23-10.72-19.01-10.72C15.35,4,5.35,13.99,5.35,26.28c0,8.59,4.95,16.33,12.64,20.04l-1.71,5.92h-1.39c-2.14,0-3.88,1.74-3.88,3.88s1.74,3.88,3.88,3.88h25.46c2.14,0,3.88-1.74,3.88-3.88s-1.74-3.88-3.88-3.88h-1.39l-1.71-5.92c7.69-3.7,12.65-11.44,12.65-20.03,0-.8-.05-1.61-.13-2.41,.75,.31,1.57,.48,2.43,.48,3.55,0,6.44-2.89,6.44-6.44s-2.89-6.44-6.44-6.44Zm-16.36,29.93l-.9-3.12c.82,.21,1.46,.93,1.46,1.81,0,.51-.22,.97-.56,1.31Zm-8.21-9.41c-3.14,0-5.7-2.56-5.7-5.7s2.57-5.7,5.7-5.7c1.82,0,3.59,.83,4.74,2.62h-4.74c-1.7,0-3.08,1.38-3.08,3.08s1.38,3.08,3.08,3.08h4.74c-1.03,1.59-2.78,2.62-4.74,2.62Zm-7.43,6.68c-.6-.32-1.01-.94-1.01-1.66,0-1.05,.85-1.9,1.9-1.9,.04,0,.08,.03,.13,.03l-1.02,3.53Zm-1.03-14.92c0-1.03,.87-1.9,1.9-1.9,.08,0,.16,.03,.24,.04-.69,.99-1.12,2.15-1.29,3.39-.5-.35-.85-.9-.85-1.54Zm14.11-2.58c-.84-.93-1.86-1.67-3.04-2.1,.32-.6,.95-1.02,1.67-1.02,1.05,0,1.9,.85,1.9,1.9,0,.47-.23,.88-.53,1.22Zm-5.65,6.2c-.6,0-1.08-.49-1.08-1.08s.49-1.08,1.08-1.08h9.3c.45,0,.85-.3,.97-.74l1.83-6.83c.13-.47,.56-.8,1.05-.8h5.09c-.06,.35-.11,.71-.11,1.08s.05,.73,.11,1.08h-3.49c-.45,0-.85,.3-.97,.74l-1.83,6.83c-.13,.47-.56,.8-1.05,.8h-10.91Zm-20.28-1.08C7.35,15.1,16.45,6,27.63,6c6.7,0,12.92,3.36,16.68,8.82h-3.53c-1.39,0-2.62,.94-2.98,2.29l-1.63,6.08h-1.57c-.05-.1-.1-.2-.15-.3,.85-.73,1.37-1.8,1.37-2.95,0-2.15-1.75-3.9-3.9-3.9-1.68,0-3.09,1.11-3.62,2.64-.22-.02-.43-.1-.66-.1-1.83,0-3.49,.67-4.81,1.74-.54-.28-1.12-.47-1.74-.47-2.15,0-3.9,1.75-3.9,3.9,0,1.76,1.24,3.22,2.87,3.68,.25,1.67,1.01,3.17,2.16,4.31l-.42,1.45c-.23-.04-.46-.09-.69-.09-2.15,0-3.9,1.75-3.9,3.9,0,1.62,1.02,2.99,2.46,3.58l-1.09,3.78c-6.83-3.43-11.21-10.37-11.21-18.08Zm34.89,29.84c0,1.04-.84,1.88-1.88,1.88H14.9c-1.04,0-1.88-.85-1.88-1.88s.85-1.88,1.88-1.88h25.46c1.04,0,1.88,.85,1.88,1.88Zm-17.56-3.88l.69-7.17c.11-1.13,.86-2.34,2.25-2.34s2.15,1.21,2.25,2.34l.69,7.17h-5.89Zm7.89,0l-.71-7.36c-.23-2.41-2.02-4.15-4.25-4.15s-4.01,1.75-4.24,4.15l-.71,7.36h-4.31l5.56-19.24c1.1,.61,2.36,.99,3.71,.99s2.58-.42,3.69-1.04l5.57,19.29h-4.31Zm4.12-7.87l-.27-.93c1.19-.68,1.97-1.93,1.97-3.35,0-2.15-1.75-3.9-3.9-3.9-.05,0-.1,.02-.16,.02l-1.32-4.56c.65-.65,1.18-1.41,1.56-2.28h3.94c1.39,0,2.62-.94,2.98-2.29l1.63-6.08h3.44c.26,.47,.56,.9,.92,1.29,.26,1.31,.41,2.66,.41,4,0,7.71-4.38,14.66-11.21,18.08Zm15.5-22.01c-2.45,0-4.44-1.99-4.44-4.44s1.99-4.44,4.44-4.44,4.44,1.99,4.44,4.44-1.99,4.44-4.44,4.44Z"/>
                                </g>
                            </svg>
                        </span>{' '}
                        Gioco del LOTTO
                    </Navbar.Brand>
                    { props.loggedIn ? <LogoutButton logout={props.logout} /> : <LoginButton />}
                </Container>
            </Navbar>
        </>
      );
}