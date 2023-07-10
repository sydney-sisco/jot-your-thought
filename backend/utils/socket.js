const { Server } = require("socket.io");
const jwt = require('jsonwebtoken');

module.exports = function (server) {
  const io = new Server(server);

  io.use((socket, next) => {
    console.log('socket.handshake.query', socket.handshake.query);
    const token = socket.handshake.query.token;
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) return next(new Error('Authentication error'));
      socket.decoded = decoded;
      next();
    });
  }).on('connection', (socket) => {
    console.log('a user connected');
  
    socket.on('disconnect', () => {
      console.log('user disconnected');
    });
  });

  return io;
};
