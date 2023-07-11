import { useState } from 'react';
import styles from './Thought.module.css'

export function Thought ({ thought, editThought, deleteThought }) {
  const [editing, setEditing] = useState(false);
  const [input, setInput] = useState(thought.text);

  const handleEdit = () => {

    // editThought
  };

  const handleSave = () => {
    setEditing(false);
    const updatedThought = {
      ...thought,
      text: input,
    };
    editThought(thought.id, updatedThought)
  };

  return (
    <li>
      <div className={styles.thought}>
        <p className={styles.timestamp}>
          {thought.timestamp}
        </p>
        {editing ?
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        :
        <p>
          {thought.text}
        </p>
        }
        <div className={styles.buttons}>
          <button onClick={()=>deleteThought(thought.id)}>Delete</button>
          {editing ? 
            <button onClick={handleSave}>Save</button>
          :
            <button onClick={()=>setEditing(true)}>Edit</button>
          }
        </div>
      </div>
    </li>
  )
};
