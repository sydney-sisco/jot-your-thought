import { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation } from 'wouter';
import { initiateSocket } from '../utils/socket';
import { useLocalStorage } from './useLocalStorage';

function useAuth() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  // const [token, setToken] = useState(null);
  const [token, setToken] = useLocalStorage("token", null);
  const [location, setLocation] = useLocation();

  useEffect(() => {
    if (token) {
      setLocation('/');
    }
  }, [token]);
  
  const login = async () => {
    const data = {
      username,
      password,
    };

    const res = await axios.post('/api/login', data);
    if (res.status === 200) {
      console.log('Login successful');
      setToken(res.data.token);
      initiateSocket(res.data.token, setToken);
    }
  };

  const logout = () => {
    // Clear token and potentially other cleanup actions.
    setToken(null);
    disconnectSocket();
    // Optional cleanup actions: Reset sync time, clear DB etc...
    setLocation('/login');
  };

  return {
    setUsername,
    setPassword,
    login,
    logout,
  };
}

export default useAuth;
