import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import React from "react";
import {useEffect,useState} from 'react';
import axios from 'axios';

function NavbarBetter() {

    function logout() {
        localStorage.removeItem('currentUser')
        window.location.href='/login'
      }
    
      const [location, setlocation] = useState([]);
        
        useEffect(() => {
          async function fetchData() {
            var retrievedData = JSON.parse(localStorage.getItem('currentUser'));
            console.log(retrievedData.email)
            const req = await axios.post('/api/users/rewards',{email:retrievedData.email});
            var reqdata = req.data;
            console.log(reqdata[0].location);
            setlocation(reqdata[0].location);
           
          }
    
          fetchData();
        }, [])

  return (
    <Navbar bg="primary" className='pr-4 noPrint' variant="dark"  expand="lg">
      
        <Navbar.Brand href="/">Modern Payroll</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav" className="d-flex justify-content-between">
          <Nav>
            <Nav.Link style = {{fontSize: "20px"}}  href="../HelpScreen">About</Nav.Link>       
            </Nav>

            <Nav className='mr-5'>
            {/* <Nav.Link href="#link">Link</Nav.Link> */}
            {localStorage.getItem('currentUser') ? (

            <NavDropdown className="justify-content-end" style = {{fontSize: "20px"}} title={JSON.parse(localStorage.getItem('currentUser')).name} id="basic-nav-dropdown">
              <NavDropdown.Item  href="/profile">Profile</NavDropdown.Item>
              <NavDropdown.Item href="#" onClick={logout}>
                Logout
              </NavDropdown.Item>
            </NavDropdown>) : (
                    <React.Fragment>
            <Nav.Link className="justify-content-end" style = {{fontSize: "20px"}} href="/register">Register</Nav.Link>
            <Nav.Link className="justify-content-end" style = {{fontSize: "20px"}} href="/login">Login</Nav.Link>
            </React.Fragment>
            )}

          </Nav>
        </Navbar.Collapse>
      
    </Navbar>
  );
}

export default NavbarBetter;