const { Server } = require("socket.io");
const jwt = require('jsonwebtoken');

module.exports = function (server) {
  const io = new Server(server);

  // example of middleware
  io.use((socket, next) => {
    console.log('A connection attempt is being made!');
    next();
  });

  io.use((socket, next) => {
    // token comes from client as query parameter
    const token = socket.handshake.query.token;

    // JWT_SECRET can be changed to invalidate all JWTs
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        let errorMessage = 'Authentication error';
        if (err.name === 'TokenExpiredError') {
          console.log('connection attempt failed due to token expiration');
          errorMessage = 'Token expired';
        }
        return next(new Error(errorMessage));
      }
      socket.decoded = decoded;
      next();
    });
  });

  io.on('connection', (socket) => {
    console.log('a user connected');

    socket.on('disconnect', () => {
      console.log('user disconnected');
    });
  });

  return io;
};