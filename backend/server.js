require('dotenv').config()
const express = require('express')
const app = express()
const path = require('path');
const port = process.env.PORT || 3001
const APP_NAME = process.env.APP_NAME || 'webapp-template'

app.get('/api', (req, res) => {
  res.send('Hello World from API!')
})

app.get('/api/test', (req, res) => {
  const sampleData = {
    text: 'You are connected to the backend! ✅',
    randomData: Math.random(),
  };
  res.send(sampleData);
})

// Serve static files from the public folder
app.use(express.static(path.join(__dirname, 'public')));

// Serve your React app at the root path
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const server = app.listen(port, () => {
  console.log(`${APP_NAME} listening on port ${port}`)
})

const io = require('./utils/socket')(server);
require('./features/socketPing')(io);

require('./features/thoughts')(io);
