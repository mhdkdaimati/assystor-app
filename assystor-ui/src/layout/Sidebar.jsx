import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Sidebar = () => {
  const location = useLocation(); // Get the current path
  const authRole = localStorage.getItem('auth_role'); // Store user role

  return (
    <aside style={sidebarStyle}>
      <ul style={listStyle}>
        <li>
          <Link
            to="/"
            style={location.pathname === '/' ? activeLinkStyle : linkStyle}
          >
            Home
          </Link>
        </li>
        <li>
          <Link
            to="/dashboard"
            style={location.pathname === '/dashboard' ? activeLinkStyle : linkStyle}
          >
            Dashboard
          </Link>
        </li>
        {authRole === 'admin' && (
          <>
            <hr />
            <li><b>Customers</b></li>

            <Link
              to="/view-customer"
              style={location.pathname === '/view-customer' ? activeLinkStyle : linkStyle}
            >
              Customers
            </Link>

            <li>
              <Link
                to="/customer-group-page"
                style={location.pathname === '/customer-group-page' ? activeLinkStyle : linkStyle}
              >
                Customer Group page
              </Link>
            </li>
            <li>
              <Link
                to="/incompleted-customer-groups"
                style={location.pathname === '/incompleted-customer-groups' ? activeLinkStyle : linkStyle}
              >
                Incompleted customer groups
              </Link>
            </li>
            <hr />
            <li><b>Products</b></li>
            <li>
              <Link
                to="/pending-customer-products"
                style={location.pathname === '/pending-customer-products' ? activeLinkStyle : linkStyle}
              >
                Pending customer products
              </Link>
            </li>
            <li>
              <Link
                to="/all-customer-products"
                style={location.pathname === '/all-customer-products' ? activeLinkStyle : linkStyle}
              >
                All customer products
              </Link>
            </li>
            <hr />
            <li><b>Entities</b></li>
            <Link
              to="/entity-tabs"
              style={location.pathname === '/entity-tabs' ? activeLinkStyle : linkStyle}
            >
              All customer entities
            </Link>

          </>
        )}
      </ul>
    </aside>
  );
};

// CSS Styles
const sidebarStyle = {
  width: '200px',
  background: '#6c757d', // Bootstrap gray color (bg-secondary)
  color: '#ffffff', // White text color
  height: '100vh',
  padding: '1rem',
  position: 'fixed', // set Sidebar position to fixed
  top: 0,
  left: 0,
  overflowY: 'auto', // Enable vertical scrolling if content overflows
}
const listStyle = {
  listStyle: 'none',
  padding: 0,
  margin: 0, // Remove default margin
};

const linkStyle = {
  color: '#ffffff', // White text color
  textDecoration: 'none',
  display: 'block',
  padding: '0.5rem 0.5rem',
  transition: 'color 0.3s',
};

const activeLinkStyle = {
  ...linkStyle,
  backgroundColor: '#495057', // Bootstrap dark gray color (bg-secondary-dark)
  borderRadius: '4px', // Rounded corners
}
export default Sidebar;