import { useState, useEffect } from 'react'
import { getSocket, initiateSocket, disconnectSocket } from './utils/socket'
import futureLogo from '/future.svg'
import './App.css'
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

import { db } from './utils/db';
import ScrollToTop from './components/ScrollToTop';

function App() {

  const { deviceId } = usePersistence();
  const [thoughts, setThoughts] = useState([]);
  const [token, setToken] = useLocalStorage("token", null);
  const [lastSyncTime, setLastSyncTime] = useLocalStorage("lastSyncTime.thoughts", '1970-01-01T00:00:00.000Z');
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
    const updatedThoughts = await db.thoughts.orderBy('createdAt').toArray();
    setThoughts(updatedThoughts);
  };

  // sync from remote
  const syncLatest = async () => {
    socket.emit('get thoughts', lastSyncTime, async (response) => {
      if (response.success) {
        console.log('thoughts array: ', response.data.thoughts);

        // update last sync time
        setLastSyncTime(response.data.syncTime);

        // update thoughts
        await db.thoughts.bulkPut(response.data.thoughts);

        // refresh thoughts
        refreshThoughtsFromIndexedDb();

      } else {
        console.error('Error syncing thoughts:', response.error);
      }
    });
  };

  // temporary function during migration to new data structure
  const deleteDB = async () => {
    await db.delete();
    console.log('db deleted');
  };

  // temporary function during migration to new data structure
  const resetLastSyncTime = () => {
    setLastSyncTime('1970-01-01T00:00:00.000Z');
  };

  const addThought = async (input) => {
    
    const thought = {
      id: undefined,
      text: input.trim(),
      deviceId: deviceId,
    };
    
    socket.emit('new thought', thought, async (response) => {
      if (response.success) {

        await db.thoughts.add({
          ...thought,
          ...response.thoughtData,
        });
        refreshThoughtsFromIndexedDb();
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
        <button onClick={syncLatest}>Sync from remote</button>
        <p>Last sync time: {lastSyncTime}</p>
        <Thoughts
          thoughts={thoughts}
          editThought={editThought}
          deleteThought={deleteThought}
        />
      </Route>
      <button onClick={refreshThoughtsFromIndexedDb}>Refresh</button>
      <button onClick={deleteDB}>Delete DB</button>
      <button onClick={resetLastSyncTime}>Reset Last Sync Time</button>
      <p>Device Id: {deviceId}</p>
      <SocketTest socket={socket} />
      <ScrollToTop />
    </>
  )
}

export default App
