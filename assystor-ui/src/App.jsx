import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import CustomerList from './components/CustomerList';
import CustomerForm from './components/CustomerForm';
import Login from './components/Login';


function App() {
  const [count, setCount] = useState(0)

  return <Login />;}

export default App
