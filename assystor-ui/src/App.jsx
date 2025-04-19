import { useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './components/Home'
import Login from './components/Login'
import Register from './components/Register'
import AddProduct from './components/AddProduct'
import UpdateProduct from './components/UpdateProduct'
import Protected from './components/Protected'
function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="App">

      <div className="App">
        <BrowserRouter>
          <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/login' element={<Login />} />
            <Route path='/register' element={<Register />} />
            <Route path='/add-product' element={<Protected Cmp={AddProduct} />} />
            <Route path='/update-product' element={<UpdateProduct />} />
          </Routes>
        </BrowserRouter>
      </div>


    </div>
  )
}

export default App
