import React from 'react';
import {Link, useHistory} from 'react-router-dom';
import axios from 'axios';
import swal from 'sweetalert';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';


const NavbarFront = () =>{
    var loggedUser = '';


    const history = useHistory();
    const logoutSubmit = (e) =>{
        e.preventDefault();
        axios.post(`/api/logout`).then(res =>{
            if(res.data.status === 200){
                localStorage.removeItem('auth_token');
                localStorage.removeItem('auth_name');
                swal("Operation Completed", res.data.message, "success",{button: false,});
                history.push('/')


                setTimeout(() => {
                    window.location.reload(false);
                }, 1000);

            }
        });
    }
    var authButtons = '';
    if(!localStorage.getItem('auth_token')){
        authButtons = (
            <>
            <Link className="btn nav-link" to="/login">Login</Link>
            <Link className="btn nav-link" to="/register">Register</Link>
            </>
        );
    }else{
        authButtons = (
            <>
                <button className="btn nav-link" onClick={logoutSubmit}>Logout</button>
                <Link className="btn nav-link" to="/cart">myCart</Link>
                </>
            );
    }
    return (
    <Navbar collapseOnSelect expand="lg" bg="light" variant="light">
    <Container>
        <Link className="btn btn-lg nav-link brand" to="/">Home</Link>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
        <Nav className="me-auto">
            <Link className="btn nav-link" to="/collections">Collections</Link>
            <Link className="btn nav-link" to="/allproduct">All Products</Link>
            <Link className="btn nav-link" to="/about">About us</Link>
            <Link className="btn nav-link" to="/contact">Contact</Link>
            {/* <NavDropdown title="Dropdown" id="collasible-nav-dropdown">
                <NavDropdown.Item href="#action/3.1">Action</NavDropdown.Item>
                <NavDropdown.Item href="#action/3.2">
                Another action
                </NavDropdown.Item>
                <NavDropdown.Item href="#action/3.3">Something</NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item href="#action/3.4">
                Separated link
                </NavDropdown.Item>
            </NavDropdown> */}
            </Nav>
            <Nav>
            {authButtons}
            </Nav>
        </Navbar.Collapse>
        </Container>
    </Navbar>
        );
}
export default NavbarFront;

