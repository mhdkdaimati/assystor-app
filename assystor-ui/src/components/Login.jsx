import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import swal from 'sweetalert';
import './Login.css'; // استيراد ملف CSS

function Login() {
  const navigate = useNavigate();
  const [loginInput, setLoginInput] = useState({ email: '', password: '' });

  // منع الدخول لصفحة تسجيل الدخول إذا كان المستخدم مسجل دخول
  useEffect(() => {
    const authName = localStorage.getItem('auth_name');
    const authToken = localStorage.getItem('auth_token');

    if (authName && authToken) {
      navigate('/', { replace: true });
    }
  }, [navigate]);

  const handleInput = (e) => {
    setLoginInput({ ...loginInput, [e.target.name]: e.target.value });
  };

  const loginSubmit = async (e) => {
    e.preventDefault();
    const data = { email: loginInput.email, password: loginInput.password };

    try {
      const res = await axios.post('/api/login', data);
      if (res.data.status === 200) {
        // تخزين 
        localStorage.setItem('auth_token', res.data.token);
        localStorage.setItem('auth_name', res.data.username);
        localStorage.setItem('auth_role', res.data.role); // تخزين دور المستخدم
        window.dispatchEvent(new Event("authChanged"));



        swal("Success", res.data.message, "success");
        navigate('/');
      } else {
        swal("Error", res.data.message, "error");
      }
    } catch (error) {
      swal("Error", "Something went wrong. Please try again.", "error");
    }
  };

  return (
    <div className="login-container">
      <div className="login-form">
        <h1>Login</h1>
        <form onSubmit={loginSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Enter your email"
              value={loginInput.email}
              onChange={handleInput}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Enter your password"
              value={loginInput.password}
              onChange={handleInput}
              required
            />
          </div>
          <button type="submit" className="login-button">Login</button>
        </form>
      </div>
    </div>
  );
}

export default Login;