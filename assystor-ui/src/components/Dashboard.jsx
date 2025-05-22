import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaShapes } from 'react-icons/fa'; // أيقونة FontAwesome

const Dashboard = () => {
  const navigate = useNavigate();

  return (
    <div>
      <h1>Welcome to the Dashboard</h1>
      <div style={{ marginTop: 40 }}>
        <button
          className="btn btn-outline-primary"
          style={{ fontSize: 22, display: 'flex', alignItems: 'center', gap: 10 }}
          onClick={() => navigate('/entity-page')}
        >
          <FaShapes style={{ fontSize: 28 }} />

          <span>Manage Entity Types</span>
        </button>
      </div>
    </div>
  );
};

export default Dashboard;