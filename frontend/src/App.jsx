import { useState, useEffect } from 'react'
import { getSocket, initiateSocket, disconnectSocket } from './utils/socket'
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
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    console.log('App token changed: ', token);
    if (token) {
      const socket = initiateSocket(token, setToken);
      setSocket(socket);
    } else {
      disconnectSocket();
      setSocket(null);
    }
  }, [token]);

  useEffect(() => {
    const loadThoughts = async () => {
      const data = await db.thoughts.toArray();
      setThoughts(data);
    };
    loadThoughts();
  }, []);

  const refreshThoughtsFromIndexedDb = async () => {
    const updatedThoughts = await db.thoughts.toArray();
    setThoughts(updatedThoughts);
  };

  const addThought = async (input) => {

    const timestamp = new Date().toISOString();
    
    const thought = {
      id: undefined,
      text: input.trim(),
      deviceId: deviceId,
      timestamp: timestamp,
    };
    
    socket.emit('new thought', thought, async (response) => {
      if (response.success) {
        await db.thoughts.add({...thought, id: response.thoughtId});
        setThoughts(await db.thoughts.toArray());
      } else {
        console.error('There was an error creating the thought');
      }
    });
  };

  const editThought = async (id, updatedThought) => {
    console.log('edit thought: ', id, updatedThought);
    await db.thoughts.update(id, updatedThought)
    refreshThoughtsFromIndexedDb();

    // send update to server
    getSocket().emit("edit thought", updatedThought);
  };

  const deleteThought = async (id) => {
    console.log('delete thought: ', id);
    await db.thoughts.delete(id);
    console.log('thought deleted');
    refreshThoughtsFromIndexedDb();

    // send delete to server
    getSocket().emit("delete thought", id);
  };

  return (
    <>
      <Link href="/">
        <a><img src={futureLogo} className="logo" alt="future logo" /></a>
      </Link>
      <h1>Jot Your Thought</h1>
      <SocketTest socket={socket} />
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
        <Jot
          addThought={addThought}
        />
        <Thoughts
          thoughts={thoughts}
          editThought={editThought}
          deleteThought={deleteThought}
        />
      </Route>
    </>
  )
}

export default App
