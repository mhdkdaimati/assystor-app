import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaShapes, FaBuilding, FaUsers, FaBoxOpen, FaUserFriends, FaUser } from 'react-icons/fa';

const Dashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="container py-5">
      <h4 className="mb-4">Welcome to the Dashboard</h4>
      <div className="row g-4">
        <div className="col-md-4">
          <button className="btn btn-outline-secondary w-100 py-3" onClick={() => navigate('/view-company')}>
            <FaBuilding size={28} className="me-2" />
            Companies
          </button>
        </div>
        <div className="col-md-4">
          <button className="btn btn-outline-secondary w-100 py-3" onClick={() => navigate('/view-customer')}>
            <FaUsers size={28} className="me-2" />
            Customers
          </button>
        </div>
        <div className="col-md-4">
          <button className="btn btn-outline-secondary w-100 py-3" onClick={() => navigate('/product-page')}>
            <FaBoxOpen size={28} className="me-2" />
            Products
          </button>
        </div>
        <div className="col-md-4">
          <button className="btn btn-outline-secondary w-100 py-3" onClick={() => navigate('/view-customer-group')}>
            <FaUserFriends size={28} className="me-2" />
            Customer Groups
          </button>
        </div>
        <div className="col-md-4">
          <button className="btn btn-outline-secondary w-100 py-3" onClick={() => navigate('/view-user')}>
            <FaUser size={28} className="me-2" />
            Users
          </button>
        </div>
        <div className="col-md-4">
          <button className="btn btn-outline-secondary w-100 py-3" onClick={() => navigate('/entity-page')}>
            <FaShapes size={28} className="me-2" />
            Entities
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;