import { useState } from 'react';

export function Jot({ addThought }) {
  const [input, setInput] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    await addThought(input);
    setInput("");
  }

  return (
    <div className="card">
      <form onSubmit={handleSubmit}>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          rows="4"
          placeholder="Jot your thought here..."
        ></textarea>
        <button type="submit">Save</button>
      </form>
    </div>
  )
};
