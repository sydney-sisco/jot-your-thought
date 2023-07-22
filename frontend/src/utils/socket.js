import io from 'socket.io-client';

let socket;

export const initiateSocket = (token, setToken) => {
  socket = io({
    transports: ["websocket"],
    query: {
      token: token,
    },
  });
  
  socket.on('connect_error', (error) => {
    if (error.message === 'Token expired') {
      console.log('token expired, logging out');
      setToken(null);
    }
  });
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
  }
};

export const getSocket = () => socket;
