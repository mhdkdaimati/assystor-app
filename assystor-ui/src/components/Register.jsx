import React from "react";
import { useState } from 'react'
import axios from "../api/axios";
import { Link,useNavigate } from 'react-router-dom'

const Register =()=>{
    
    
    
const [email, setEmail] = useState('')
const [password, setPassword] = useState('')
const [passwordConfirmation, setPassowrdConfirmation] = useState('')
const [username, setUsername] =useState('')
const navigate = useNavigate();


  const handleSubmit = async (event) => {
    event.preventDefault()
    console.log('register with:', { email, password,username,passwordConfirmation })
    try{
      await axios.post('/register',{email,password,username,passwordConfirmation})
      setEmail("")
      setPassword("")
      navigate("/")

    }catch(e){

      console.log(e)

    }
    // هنا تقدر تضيف منطق تسجيل الدخول (API call مثلًا)
  }

  return (
    <>
        <div className="d-flex justify-content-center align-items-center vh-100">
    <div className="card p-4 shadow" style={{ minWidth: '300px' }}>
            <h2 className="text-center mb-4">ٌRegister</h2>
            <form onSubmit={handleSubmit}>
            <div className="mb-3">
                <label htmlFor="email" className="form-label">Email address</label>
                <input 
                type="email" 
                className="form-control" 
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required 
                />
            </div>

            <div className="mb-3">
                <label htmlFor="email" className="form-label">Username</label>
                <input 
                type="text" 
                className="form-control" 
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required 
                />
            </div>

            <div className="mb-3">
                <label htmlFor="password" className="form-label">Password</label>
                <input 
                type="password" 
                className="form-control" 
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required 
                />
            </div>
            <div className="mb-3">
                <label htmlFor="password" className="form-label">Password Confirmation</label>
                <input 
                type="password" 
                className="form-control" 
                id="passwordConfirmation"
                value={passwordConfirmation}
                onChange={(e) => setPassowrdConfirmation(e.target.value)}
                required 
                />
            </div>
            <button type="submit" className="btn btn-primary w-100">Register</button>
            </form>
            <p className="mt-3 text-center">
            Do you have an account? <Link to="/login">Login</Link>
            </p>
        </div>
        </div>
    </>
    )
}
export default Register;