import React from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import MasterLayout from './layout/admin/MasterLayout'
import Dashboard from './components/admin/Dashboard'

function App() {

  return (
    <div className="App">
      <Router>
        <Routes>
        <Route path="/q" element={<h1>Welcome Home</h1>} />

        <Route path="/admin/dashboard" element={<Dashboard />} />

        <Route path='/' element={<MasterLayout/>}/>
        </Routes>
      </Router>
    </div>
  )
}

export default App
