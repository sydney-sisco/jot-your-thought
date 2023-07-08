import { useState } from 'react';

export function Thoughts({ thoughts }) {

  return (
    <div className="card">
      <ul>
        {thoughts.map((thought) => (
          <li key={thought.id}>{thought.text}</li>
        )).reverse()}
      </ul>
    </div>
  )
};
