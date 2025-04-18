import { useState } from 'react'
import { Link,useNavigate } from 'react-router-dom'

import axios from '../api/axios'

const Login =()=>{


const [email, setEmail] = useState('')
const [password, setPassword] = useState('')
const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault()
    console.log('Logging in with:', { email, password })
    try{
      await axios.post('/login',{email,password})
      setEmail("")
      setPassword("")
      navigate("/")

    }catch(e){

      console.log(e)

    }
    // هنا تقدر تضيف منطق تسجيل الدخول (API call مثلًا)
  }

  return (
    <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="card p-4 shadow" style={{ minWidth: '300px' }}>
        <h2 className="text-center mb-4">Login</h2>
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
          <button type="submit" className="btn btn-primary w-100">Login</button>
        </form>
        <p className="mt-3 text-center">
          Don't have an account? <Link to="/register">Register</Link>
        </p>
      </div>
    </div>
  )
}

export default Login
