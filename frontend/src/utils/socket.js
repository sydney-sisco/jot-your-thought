import io from 'socket.io-client';

let socket;

export const initiateSocket = (token) => {
  socket = io({
    transports: ["websocket"],
    query: {
      token: token,
    },
  });
  
  socket.on('connect_error', (error) => {
    if (error.message === 'Token expired') {
      console.log('token expired');
    }
  });
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
  }
};

export const getSocket = () => socket;
