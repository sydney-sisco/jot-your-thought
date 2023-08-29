import React from 'react';
import useAuth from '../hooks/useAuth';

function Login() {
  const {
    setUsername,
    setPassword,
    login,
  } = useAuth();

  const handleSubmit = (e) => {
    e.preventDefault();
    login();
  };

  return (
    <div className="card">
      <form onSubmit={handleSubmit}>
        <label>
          Username:
          <input type="text" onChange={e => setUsername(e.target.value)} />
        </label>
        <label>
          Password:
          <input type="password" onChange={e => setPassword(e.target.value)} />
        </label>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}

export default Login;
