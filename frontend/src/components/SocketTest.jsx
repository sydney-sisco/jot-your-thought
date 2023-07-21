import { useState, useEffect } from 'react';
import { ConnectionState } from './ConnectionState';

export function SocketTest({ socket }) {
  const [status, setStatus] = useState(null);
  const [socketResponse, setSocketResponse] = useState('')

  const testSocket = () => {
    if (socket) {
      socket.emit("ping");
    }
  }

  useEffect(() => {
    setSocketResponse('');
    if (socket) {
      socket.on('connect', () => setStatus('Connected'));
      socket.on('disconnect', () => setStatus('Disconnected'));

      function onPingEvent(value) {
        console.log(value);
        setSocketResponse(value);
      }

      socket.on('pong', onPingEvent);
      testSocket();

      // Clean up when component unmounts
      return () => {
        socket.off('connect');
        socket.off('disconnect');
        socket.off('pong', onPingEvent);
      };
    }
  }, [socket]);

  return (
    <div>
      <button onClick={testSocket}>test socket connection</button>
      <p>{socketResponse}</p>
      <ConnectionState isConnected={status === 'Connected'} />
    </div>
  );
};
