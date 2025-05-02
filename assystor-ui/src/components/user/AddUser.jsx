import React, { useState } from 'react';
import axios from 'axios';
import swal from 'sweetalert';
import { useNavigate } from 'react-router-dom';




function AddUser() {
  const navigate = useNavigate();
  const [registerInput, setRegister] = useState({
    name: '',
    email: '',
    password: '',
    role: '',
    error_list: [],
  });

  const handleInput = (e) => {
    e.persist();
    setRegister({ ...registerInput, [e.target.name]: e.target.value });
  };

  const registerSubmit = (e) => {
    e.preventDefault();
    const data = {
      name: registerInput.name,
      email: registerInput.email,
      password: registerInput.password,
      role: registerInput.role || 'operator',
    };

    axios.get('/sanctum/csrf-cookie').then(() => {
      axios.post(`api/store-user`, data).then((res) => {
        if (res.data.status === 201) {
          setRegister({
            name: '',
            email: '',
            password: '',
            role: '',
            error_list: [],
          });
          swal('Operation is completed', res.data.message, 'success');
          document.getElementById('REGISTER_FORM').reset();
        } else {
          setRegister({ ...registerInput, error_list: res.data.validator_errors });
          swal(
            'Operation is incomplete',
            "Your registration couldn't be completed, please check the errors.",
            'error'
          );
        }
      });
    });
  };

  return (
<div className="container py-5" style={{ backgroundColor: "#f8f9fa", minHeight: "100vh" }}>
  <div className="row justify-content-center">
    <div className="col-md-7 col-lg-6">
      <div className="card shadow rounded-4 border-0">
        <div className="card-header bg-gradient bg-success text-white text-center rounded-top-4">
          <h3 className="mb-0">👤 Add New User</h3>
        </div>
        <div className="card-body p-4">
          <form onSubmit={registerSubmit} id="REGISTER_FORM">
            <div className="mb-3">
              <label htmlFor="name" className="form-label fw-semibold">
                Full Name
              </label>
              <div className="input-group">
                <span className="input-group-text"><i className="bi bi-person-fill"></i></span>
                <input
                  type="text"
                  name="name"
                  onChange={handleInput}
                  value={registerInput.name}
                  className="form-control"
                  id="name"
                  placeholder="Enter full name"
                />
              </div>
              <small className="text-danger">{registerInput.error_list.name}</small>
            </div>

            <div className="mb-3">
              <label htmlFor="email" className="form-label fw-semibold">
                Email Address
              </label>
              <div className="input-group">
                <span className="input-group-text"><i className="bi bi-envelope-fill"></i></span>
                <input
                  type="email"
                  name="email"
                  onChange={handleInput}
                  value={registerInput.email}
                  className="form-control"
                  id="email"
                  placeholder="Enter email address"
                />
              </div>
              <small className="text-danger">{registerInput.error_list.email}</small>
            </div>

            <div className="mb-3">
              <label htmlFor="password" className="form-label fw-semibold">
                Password
              </label>
              <div className="input-group">
                <span className="input-group-text"><i className="bi bi-lock-fill"></i></span>
                <input
                  type="password"
                  name="password"
                  onChange={handleInput}
                  value={registerInput.password}
                  className="form-control"
                  id="password"
                  placeholder="Enter password"
                />
              </div>
              <small className="text-danger">{registerInput.error_list.password}</small>
            </div>

            <div className="mb-3">
              <label htmlFor="role" className="form-label fw-semibold">
                Role
              </label>
              <select
                className="form-select"
                name="role"
                onChange={handleInput}
                value={registerInput.role || 'operator'}
                id="role"
              >
                <option value="operator">Operator</option>
                <option value="manager">Manager</option>
                <option value="admin">Admin</option>
              </select>
              <small className="text-danger">{registerInput.error_list.role}</small>
            </div>

            <button type="submit" className="btn btn-success w-100 rounded-pill shadow-sm fw-bold">
              <i className="bi bi-person-plus me-2"></i> Register
            </button>
          </form>
        </div>
      </div>
    </div>
  </div>
</div>
  );
}

export default AddUser;