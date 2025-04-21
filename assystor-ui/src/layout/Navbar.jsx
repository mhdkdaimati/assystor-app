import { useNavigate, Link } from 'react-router-dom';
import React from 'react';
import axios from 'axios';

const Navbar = () => {
    const navigate = useNavigate();

    const logoutSubmit = (e) => {
        e.preventDefault();



        axios.post(`/api/logout`).then(res =>{
            if(res.data.status === 200){
                localStorage.removeItem('auth_token');
                localStorage.removeItem('auth_name');
                swal("Operation Completed", res.data.message, "success",{button: false,});
                navigate('/login')

            }
        });

    };

    const authButtons = !localStorage.getItem('auth_token') ? (
        <>
            <Link className="btn nav-link" to="/login">Login</Link>
        </>
    ) : (
        <>
            <button className="btn nav-link" onClick={logoutSubmit}>Logout</button>
        </>
    );

    return (
        <header style={headerStyle}>
            <div style={logoStyle}>
                <Link to="/" style={linkStyle}>MyApp</Link>
            </div>
            <nav style={navStyle}>
                {authButtons}
            </nav>
        </header>
    );
};

// Styling
const headerStyle = {
    background: '#2c3e50',
    color: '#fff',
    padding: '1rem 2rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottom: '4px solid #1abc9c',
};

const logoStyle = {
    fontSize: '1.5rem',
    fontWeight: 'bold',
};

const navStyle = {
    display: 'flex',
    gap: '1rem',
};

const linkStyle = {
    color: '#ecf0f1',
    textDecoration: 'none',
    fontWeight: '500',
    transition: 'color 0.3s',
};

export default Navbar;
