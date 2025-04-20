import React from 'react';
import {Link} from 'react-router-dom';

const NavbarAdmin = () =>{
    return (
        <nav className="sb-topnav navbar navbar-expand navbar-dark bg-dark shadow">
        <Link className="navbar-brand ps-3" to="/">StartAlef</Link>
        </nav>

        );
}
export default NavbarAdmin;