import React from 'react';
import { Link } from 'react-router-dom';

const Sidebar = () => {

  const authRole = localStorage.getItem('auth_role'); // تخزين دور المستخدم

  return (
    <aside style={sidebarStyle}>
      <ul style={listStyle}>
        <li>
          <Link to="/" style={linkStyle}>Home</Link>
        </li>
        <li>
          <Link to="/dashboard" style={linkStyle}>Dashboard</Link>
        </li>
          {authRole === 'admin' && (
            <>
            <li>
            <Link to="/add-user" style={linkStyle}>Add User</Link>
          </li>
          <li>
            <Link to="/add-company" style={linkStyle}>Add Company</Link>
          </li>
          <li>
            <Link to="/view-company" style={linkStyle}>View Company</Link>
          </li>
          <li>
            <Link to="/add-customer" style={linkStyle}>Add Customer</Link>
          </li>
          <li>
            <Link to="/view-customer" style={linkStyle}>View Customer</Link>
          </li>
          </>
        )}
      </ul>
    </aside>
  );
};

// CSS Styles
const sidebarStyle = {
  width: '200px',
  background: '#2c3e50',
  color: '#ecf0f1',
  height: '100vh',
  padding: '1rem',
  position: 'fixed', // تثبيت Sidebar
  top: 0,
  left: 0,
};

const listStyle = {
  listStyle: 'none',
  padding: 0,
};

const linkStyle = {
  color: '#ecf0f1',
  textDecoration: 'none',
  display: 'block',
  padding: '0.5rem 0',
  transition: 'color 0.3s',
};

export default Sidebar;