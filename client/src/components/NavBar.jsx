import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Container from 'react-bootstrap/Container';
import NavbarBrand from 'react-bootstrap/esm/NavbarBrand';
import { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { userLogOut } from '../utilities';

export default function NavBar({ user, setUser }) {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await userLogOut();
    setUser(null); // update parent state
    navigate("/");  // go home
  };

  return (
    <Navbar bg="dark" data-bs-theme="dark">
      <Container>
        <NavbarBrand as={Link} to="/">Falconforgefantasy</NavbarBrand>
        <Nav className="me-auto navigraph">
    
          <NavLink to="/" className="nav-link">Home</NavLink>
          <NavLink to="/events" className="nav-link">Events</NavLink>

          {user ? (
            <>
              <button className="nav-link btn btn-link" onClick={handleLogout}>Logout</button>
              <NavLink to="/tickets" className="nav-link">Tickets</NavLink>
            </>
          ) : (
            <>
              <NavLink to="/login" className="nav-link">Login</NavLink>
              <NavLink to="/signup" className="nav-link">Signup</NavLink>
            </>
          )}

          <NavLink to="https://falcons-forge-shop.fourthwall.com/" className="nav-link" target="_blank" rel="noopener noreferrer">Merchandise</NavLink>
          <NavLink to="https://marketplace.roll20.net/browse/publisher/1785/falconforgefantasy" className="nav-link" target="_blank" rel="noopener noreferrer">Roll20</NavLink>
          <NavLink to="https://startplaying.games/gm/falconforgefantasy" className="nav-link" target="_blank" rel="noopener noreferrer">StartPlaying</NavLink>
        </Nav>
      </Container>
    </Navbar>
  );
}