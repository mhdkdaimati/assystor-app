import { useState } from 'react'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div className="container mt-5">
        <h1 className="text-primary">Hello Bootstrap!</h1>
        <button className="btn btn-success">Click Me</button>
      </div>   
    </>
  )
}

export default App
