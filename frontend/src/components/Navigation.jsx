import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import {LinkContainer} from 'react-router-bootstrap';
import { useSelector } from 'react-redux';
import favicon from "/src/assets/favicon-96x96.png";
import { Button } from 'react-bootstrap';
import { useLogoutUserMutation } from '../services/appApi';
import DefaultImg from "../assets/default-profile-img.png";
import { useNavigate } from 'react-router-dom';


function Navigation() {
  const user = useSelector((state) => state.user);
  const [logoutUser] = useLogoutUserMutation();
  const navigate = useNavigate();

  const handleLogout = async (e) => {
  e.preventDefault();
  console.log("Logout button clicked ");

  if (!user || !user.id) {
      console.warn('No user in redux state');
      return;
    }

    try {
      const res = await logoutUser({ _id: user.id, newMessages: {} }).unwrap();
      console.log('Logout response :', res);
      // borrar persist store si usas redux-persist
      localStorage.removeItem('persist:root');
      navigate('/');
      window.location.reload();
    } catch (err) {
      console.error('Logout failed ', err);
    }
};



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

            {!user && (
              <LinkContainer to="/login">
                <Nav.Link>Login</Nav.Link>
              </LinkContainer>
            )}
            <LinkContainer to="/chat">
              <Nav.Link>Chat</Nav.Link>
            </LinkContainer>
            <NavDropdown title={
              <>
                {user ? (
                  <img src={user?.picture} alt="" style={{ width: "30px", height: "30px", borderRadius: "50%", marginRight: "10px" }} />
                ) : (
                  <img src={DefaultImg} alt="" style={{ width: "30px", height: "30px", borderRadius: "50%", marginRight: "10px" }} />
                )}
                Menu
              </>
            } id="basic-nav-dropdown">
              <NavDropdown.Item href="#action/3.1">Action</NavDropdown.Item>
              <NavDropdown.Item href="#action/3.2">
                Another action
              </NavDropdown.Item>
              <NavDropdown.Item href="#action/3.3">Something</NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item >
                <Button variant='primary' onClick={handleLogout}>Logout</Button>
              </NavDropdown.Item>
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default Navigation;