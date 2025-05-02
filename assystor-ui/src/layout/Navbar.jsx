import { useNavigate, Link } from 'react-router-dom';
import React from 'react';
import axios from 'axios';
import swal from 'sweetalert';

const Navbar = () => {
    const navigate = useNavigate();

    const logoutSubmit = async (e) => {
        e.preventDefault();

        try {
            const res = await axios.post(`/api/logout`, {}, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('auth_token')}`,
                },
            });

            if (res.data.status === 200) {
                localStorage.removeItem('auth_token');
                localStorage.removeItem('auth_name');
                localStorage.removeItem('auth_role');

                swal("Operation Completed", res.data.message, "success", { button: false });
                navigate('/login');
            } else {
                swal("Error", res.data.message || "Logout failed", "error");
            }
        } catch (error) {
            swal("Error", "Something went wrong. Please try again.", "error");
        }
    };

    const authButtons = !localStorage.getItem('auth_token') ? (
        <>
            <Link className="nav-link" to="/login">Login</Link>
        </>
    ) : (
        <>
            <button className="nav-link btn btn-link text-light" onClick={logoutSubmit}>Logout</button>
        </>
    );

    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-secondary">
            <div className="container-fluid">
                <Link className="navbar-brand" to="/">Call Center App</Link>
                <div className="d-flex">
                    {authButtons}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;