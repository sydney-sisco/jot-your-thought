import { useState } from 'react';
import { Thought } from './Thought';

export function Thoughts({ thoughts, editThought, deleteThought }) {

  return (
    <div className="card">
      <ul>
        {thoughts.map((thought, index) => (
          <Thought
            key={index}
            thought={thought}
            editThought={editThought}
            deleteThought={deleteThought}
          />
        )).reverse()}
      </ul>
    </div>
  )
};
