import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import CustomerList from './components/CustomerList';
import CustomerForm from './components/CustomerForm';


function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div className="App">
        <h1>Customer App</h1>
        <CustomerList />
        <CustomerForm />
      </div>
    </>
  )
}

export default App
