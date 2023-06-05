import { useState, useEffect } from 'react'
import { socket } from './utils/socket'
import futureLogo from '/future.svg'
import './App.css'
import Dexie from 'dexie';

const db = new Dexie("ThoughtsDB");
db.version(1).stores({ thoughts: "++id,text" });

function App() {

  const [thoughts, setThoughts] = useState([]);
  const [input, setInput] = useState("");

  useEffect(() => {
    const loadThoughts = async () => {
      const data = await db.thoughts.toArray();
      setThoughts(data);
    };
    loadThoughts();
  }, []);

  const addThought = async (event) => {
    event.preventDefault();
    if (!input.trim()) return;
    await db.thoughts.add({ text: input });
    setInput("");
    const updatedThoughts = await db.thoughts.toArray();
    setThoughts(updatedThoughts);
  };

  return (
    <>
      <div>
        <a href="https://github.com/sydney-sisco/jot-your-thought" target="_blank">
          <img src={futureLogo} className="logo" alt="future logo" />
        </a>
      </div>
      <h1>Jot Your Thought</h1>
      <div className="card">
        <form onSubmit={addThought}>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            rows="4"
            placeholder="Write your thought here..."
          ></textarea>
          <button type="submit">Save</button>
        </form>
      </div>
      <div className="card">
        <ul>
          {thoughts.map((thought) => (
            <li key={thought.id}>{thought.text}</li>
          ))}
        </ul>
      </div>
    </>
  )
}

export default App
