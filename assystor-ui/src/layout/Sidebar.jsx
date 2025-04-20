import { NavLink } from 'react-router-dom';
import { FaTachometerAlt, FaPlusCircle } from 'react-icons/fa'; // icons

const Sidebar = () => (
  <aside style={{
    width: '220px',
    background: '#2c3e50',
    color: '#ecf0f1',
    padding: '1rem',
    height: '100vh',
    position: 'fixed',
    top: 0,
    left: 0
  }}>
    <h2 style={{ color: '#ecf0f1', textAlign: 'center', marginBottom: '2rem' }}>
      Admin Panel
    </h2>
    <ul style={{ listStyle: 'none', padding: 0 }}>
      <li style={{ marginBottom: '1rem' }}>
        <NavLink 
          to="/admin/dashboard" 
          style={({ isActive }) => ({
            display: 'flex',
            alignItems: 'center',
            textDecoration: 'none',
            color: isActive ? '#1abc9c' : '#ecf0f1',
            fontWeight: isActive ? 'bold' : 'normal'
          })}
        >
          <FaTachometerAlt style={{ marginRight: '8px' }} />
          Dashboard
        </NavLink>
      </li>
      <li style={{ marginBottom: '1rem' }}>
        <NavLink 
          to="/admin/add-category" 
          style={({ isActive }) => ({
            display: 'flex',
            alignItems: 'center',
            textDecoration: 'none',
            color: isActive ? '#1abc9c' : '#ecf0f1',
            fontWeight: isActive ? 'bold' : 'normal'
          })}
        >
          <FaPlusCircle style={{ marginRight: '8px' }} />
          Add Category
        </NavLink>
      </li>
    </ul>
  </aside>
);

export default Sidebar;
