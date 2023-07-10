import { useState, useEffect } from 'react'
import { getSocket } from './utils/socket'
import futureLogo from '/future.svg'
import './App.css'
import Dexie from 'dexie';
import { usePersistence } from './hooks/usePersistence';
import Login from './components/Login';
import Register from './components/Register';
import Logout from './components/Logout';

import { Jot } from './components/Jot';
import { Thoughts } from './components/Thoughts';

import { Link, Route } from "wouter";
import { SocketTest } from './components/SocketTest';

import { useLocalStorage } from './hooks/useLocalStorage';
import { useReadLocalStorage } from './hooks/useReadLocalStorage';

const db = new Dexie("ThoughtsDB");
db.version(1).stores({ thoughts: "++id,text" });

function App() {

  const { deviceId } = usePersistence();
  const [thoughts, setThoughts] = useState([]);
  const [token, setToken] = useLocalStorage("token", null);

  useEffect(() => {
    const loadThoughts = async () => {
      const data = await db.thoughts.toArray();
      setThoughts(data);
    };
    loadThoughts();
  }, []);

  const addThought = async (input) => {

    const timestamp = new Date().toISOString();
    
    const thought = {
      id: timestamp,
      text: input.trim(),
      deviceId: deviceId,
      timestamp: timestamp,
    };
    
    await db.thoughts.add(thought);

    getSocket().emit("new thought", thought);

    const updatedThoughts = await db.thoughts.toArray();
    setThoughts(updatedThoughts);
  };

  return (
    <>
      <Link href="/">
        <a><img src={futureLogo} className="logo" alt="future logo" /></a>
      </Link>
      <h1>Jot Your Thought</h1>
      {token ?
      <>
        <Logout setToken={setToken} />
      </>
      :
      <>
        <Link href="/login">
          <a className="link">Login</a>
        </Link>
        <Link href="/register">
          <a className="link">Register</a>
        </Link>
      </>
      }
      <Route path="/login">
        <Login setToken={setToken} />
      </Route>
      <Route path="/register">
        <Register />
      </Route>
      <Route path="/">
        <Jot addThought={addThought} />
        <Thoughts thoughts={thoughts} />
      </Route>
      <SocketTest />
    </>
  )
}

export default App
