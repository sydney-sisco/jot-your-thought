import { useState } from 'react'
import futureLogo from '/future.svg'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  const [apiResponse, setApiResponse] = useState('')

  const testApi = async () => {
    const response = await fetch('/api/test')
    const data = await response.json()
    console.log(data)
    setApiResponse(JSON.stringify(data, null, 2))
  }

  return (
    <>
      <div>
        <a href="https://github.com/sydney-sisco/webapp-template" target="_blank">
          <img src={futureLogo} className="logo" alt="future logo" />
        </a>
      </div>
      <h1>webapp-template</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.jsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the logo to learn more
      </p>
      <button onClick={testApi}>test connection to backend</button>
      <p>{apiResponse}</p>
    </>
  )
}

export default App