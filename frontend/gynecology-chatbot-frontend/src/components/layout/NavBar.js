// src/components/layout/NavBar.js

import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Navbar, Nav, Container, Button, Dropdown } from 'react-bootstrap';
import { AuthContext } from '../../context/AuthContext';

const NavBar = () => {
  const { currentUser, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <Navbar expand="lg" className="navbar">
      <Container>
        <Navbar.Brand as={Link} to="/">
          <span style={{ color: 'var(--primary-color)' }}>G</span>yno<span style={{ color: 'var(--primary-color)' }}>C</span>are
        </Navbar.Brand>
        
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            {currentUser ? (
              <>
                <Nav.Link as={Link} to="/">
                  Chat
                </Nav.Link>
                <Nav.Link as={Link} to="/history">
                  History
                </Nav.Link>
                <Nav.Link as={Link} to="/doctors">
                  Doctors
                </Nav.Link>
                
                <Dropdown align="end">
                  <Dropdown.Toggle variant="outline-primary" id="dropdown-basic" className="ms-2">
                    {currentUser.first_name || currentUser.username}
                  </Dropdown.Toggle>
                  
                  <Dropdown.Menu>
                    <Dropdown.Item as={Link} to="/profile">My Profile</Dropdown.Item>
                    <Dropdown.Divider />
                    <Dropdown.Item onClick={handleLogout}>Logout</Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </>
            ) : (
              <>
                <Nav.Item>
                  <Button variant="outline-primary" as={Link} to="/login" className="me-2">
                    Login
                  </Button>
                </Nav.Item>
                <Nav.Item>
                  <Button variant="primary" as={Link} to="/register">
                    Register
                  </Button>
                </Nav.Item>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavBar;