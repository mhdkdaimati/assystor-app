import { Link } from 'react-router-dom';

const Navbar = () => (
  <header style={headerStyle}>
    <div style={logoStyle}>
      <Link to="/" style={linkStyle}>MyApp</Link>
    </div>
    <nav style={navStyle}>
      <Link to="/admin/dashboard" style={linkStyle}>Dashboard</Link>
      <Link to="/admin/add-category" style={linkStyle}>Add Category</Link>
      <Link to="/contact" style={linkStyle}>Contact</Link>
    </nav>
  </header>
);

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
