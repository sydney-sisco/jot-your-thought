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
  if (socket) {
    socket.disconnect();
  }
};

export const getSocket = () => socket;
