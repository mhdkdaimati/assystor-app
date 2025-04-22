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
                // إزالة القيم من localStorage
                localStorage.removeItem('auth_token');
                localStorage.removeItem('auth_name');

                // عرض رسالة نجاح
                swal("Operation Completed", res.data.message, "success", { button: false });

                // التوجيه إلى صفحة تسجيل الدخول
                navigate('/login');
            } else {
                // عرض رسالة خطأ إذا لم يكن status 200
                swal("Error", res.data.message || "Logout failed", "error");
            }
        } catch (error) {
            // معالجة الأخطاء
            swal("Error", "Something went wrong. Please try again.", "error");
        }
    };
    const authButtons = !localStorage.getItem('auth_token') ? (
        <>
            <Link className="nav-link" to="/login">Login</Link>
        </>
    ) : (
        <>
            <button className="nav-link logout-btn" onClick={logoutSubmit}>Logout</button>
        </>
    );

    return (
        <nav style={navbarStyle}>
            <div style={logoStyle}>
                <Link to="/" style={linkStyle}>MyApp</Link>
            </div>
            <div style={navLinksStyle}>
                {authButtons}
            </div>
        </nav>
    );
};

// CSS Styles
const navbarStyle = {
    background: '#2c3e50',
    color: '#ecf0f1',
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

const navLinksStyle = {
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