import React from 'react';
import useAuth from '../hooks/useAuth';

function Logout() {
  const { logout } = useAuth();

  const handleSubmit = (e) => {
    e.preventDefault();
    logout();
  };

  return (
    <form onSubmit={handleSubmit}>
      <button type="submit">Logout</button>
    </form>
  );
}

export default Logout;
