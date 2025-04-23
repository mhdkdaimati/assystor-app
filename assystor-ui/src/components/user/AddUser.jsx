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
      axios.post(`api/register`, data).then((res) => {
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
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card shadow">
            <div className="card-header bg-success text-white text-center">
              <h3>Add New User</h3>
            </div>
            <div className="card-body">
              <form onSubmit={registerSubmit} id="REGISTER_FORM">
                <div className="mb-3">
                  <label htmlFor="name" className="form-label">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    onChange={handleInput}
                    value={registerInput.name}
                    className="form-control"
                    id="name"
                    placeholder="Enter full name"
                  />
                  <span className="text-danger">{registerInput.error_list.name}</span>
                </div>
                <div className="mb-3">
                  <label htmlFor="email" className="form-label">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    onChange={handleInput}
                    value={registerInput.email}
                    className="form-control"
                    id="email"
                    placeholder="Enter email address"
                  />
                  <span className="text-danger">{registerInput.error_list.email}</span>
                </div>
                <div className="mb-3">
                  <label htmlFor="password" className="form-label">
                    Password
                  </label>
                  <input
                    type="password"
                    name="password"
                    onChange={handleInput}
                    value={registerInput.password}
                    className="form-control"
                    id="password"
                    placeholder="Enter password"
                  />
                  <span className="text-danger">{registerInput.error_list.password}</span>
                </div>
                <div className="mb-3">
                  <label htmlFor="role" className="form-label">
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
                  <span className="text-danger">{registerInput.error_list.role}</span>
                </div>
                <button type="submit" className="btn btn-success w-100">
                  Register
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