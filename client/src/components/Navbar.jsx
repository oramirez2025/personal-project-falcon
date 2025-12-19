import { Container } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useOutletContext } from "react-router-dom";
import Button from 'react';



export default function Navbar() {
  const OutletContect = useOutletContext()||{}
  const { user, setUser } = OutletContect
  return (
    <>
      <nav className="navbar navbar-expand-lg bg-body-tertiary">
        <div className="container-fluid">
          <a className="navbar-brand" href="/">Home</a>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
            <div className="navbar-nav">
              <a className="nav-link active" aria-current="page" href="tickets">Tickets</a>
              <a className="nav-link" href="events">Events</a>
              <a className="nav-link" href="signup">Sign-Ups</a>
              <a className="nav-link" href="login">Login</a>
              <a className="nav-link" href="https://falcons-forge-shop.fourthwall.com/">Merchandise</a>
              <a className="nav-link disabled" aria-disabled="true">Disabled</a>
{user ? (<Button
  variant="outline-danger"
  onClick={async () => setUser(await userLogOut())}
>Log Out</Button>):null}
            </div>
          </div>
        </div>
      </nav>
    </>
 );
}

