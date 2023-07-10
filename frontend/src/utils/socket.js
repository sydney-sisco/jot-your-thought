import io from 'socket.io-client';

let socket;

export const initiateSocket = (token) => {
  socket = io({
    query: {
      token: token,
    },
  })
};

export const disconnectSocket = () => {
  socket.disconnect();
};

export const getSocket = () => socket;
