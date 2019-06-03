const http      = require('http');

// calling/import app from app.js
const app       = require('./app');

// setting port for application when running
const port      = process.env.PORT || 3000;

//creating server
const server    = http.createServer(app);

// set server to listening to port that created before
server.listen(port);