import React, { useState, useEffect } from "react";
import axios from "axios";
import { useLocation } from "wouter";
import { initiateSocket } from "../utils/socket";

function Login({ token, setToken }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [location, setLocation] = useLocation();

  useEffect(() => {
    console.log("Login token changed in Login: ", token);
    if (token) {
      // redirect to main page
      setLocation("/");
    }
  }, [token]);

  const handleSubmit = (e) => {
    e.preventDefault();

    const data = {
      username: username,
      password: password,
    }

    axios.post('/api/login', data)
      .then(res => {
        if (res.status === 200) {
          // Handle successful login here, such as redirecting to main page
          console.log("Login successful");
          console.log(res.data);

          // store token in local storage
          setToken(res.data.token);

          // initiate socket connection
          initiateSocket(res.data.token, setToken);
        }
      });
  }

  return (
    <div className="card">
      <form onSubmit={handleSubmit}>
        <label>
          Username:
          <input type="text" value={username} onChange={e => setUsername(e.target.value)} />
        </label>
        <label>
          Password:
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} />
        </label>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}

export default Login;
