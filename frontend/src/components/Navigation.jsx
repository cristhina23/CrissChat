import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import {LinkContainer} from 'react-router-bootstrap';
import favicon from "/src/assets/favicon-96x96.png";

function Navigation() {
  return (
    <Navbar expand="lg" className="bg-body-tertiary">
      <Container>
        <LinkContainer to="/">
        <Navbar.Brand> 
          <img src={favicon} alt="logo image of crisschat app" style={{width: "70px", height: "70px"}}/> 
          </Navbar.Brand>
        </LinkContainer>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            <LinkContainer to="/login">
              <Nav.Link>Login</Nav.Link>
            </LinkContainer>
            <LinkContainer to="/chat">
              <Nav.Link>Chat</Nav.Link>
            </LinkContainer>
            <NavDropdown title="Dropdown" id="basic-nav-dropdown">
              <NavDropdown.Item href="#action/3.1">Action</NavDropdown.Item>
              <NavDropdown.Item href="#action/3.2">
                Another action
              </NavDropdown.Item>
              <NavDropdown.Item href="#action/3.3">Something</NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item href="#action/3.4">
                Separated link
              </NavDropdown.Item>
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default Navigation;