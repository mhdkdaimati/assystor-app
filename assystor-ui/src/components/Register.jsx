import React from "react";
import { useState, useEffect } from 'react'
import axios from "../api/axios";
import { Link, useNavigate } from 'react-router-dom'
import Header from './Header'

const Register = () => {
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem('user-info')) {
      navigate("/")
    }

  }, [])

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [passwordConfirmation, setPassowrdConfirmation] = useState('')
  const [name, setName] = useState('')

  // const handleSubmit = async (event) => {
  //   event.preventDefault()
  //   console.log('register with:', { email, password,name,passwordConfirmation })
  //   try{
  //     await axios.post('/register',{email,password,name})
  //     setEmail("")
  //     setPassword("")
  //     setName("")
  //     navigate("/login")
  //     result=await result.json()
  //     console.log(result);

  //   }catch(e){

  //     console.log(e)

  //   }
  //   // هنا تقدر تضيف منطق تسجيل الدخول (API call مثلًا)
  // }

  async function handleSubmit(e) {
    e.preventDefault(); // 🛑 تمنع الصفحة من إعادة التحميل

    let item = { name, password, email }
    console.log(item)
    let result = await fetch("http://127.0.0.1:8000/api/register", {
      method: 'post',
      body: JSON.stringify(item),
      headers: {
        "Content-type": 'application/json',
        "Access": 'application/json'
      }
    })



    result = await result.json()
    localStorage.setItem("user-info", JSON.stringify(result))
    navigate("/")
  }

  return (
    <>
      <Header />

      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="card p-4 shadow" style={{ minWidth: '300px' }}>
          <h2 className="text-center mb-4">Register</h2>
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
              <label htmlFor="email" className="form-label">Name</label>
              <input
                type="text"
                className="form-control"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}

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