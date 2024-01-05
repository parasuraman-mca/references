npm install socket.io-client

npm init -y
npm install express socket.io


---------www---------


/**
 * Module dependencies.
 */
var app = require('../app');
var debug = require('debug')('backend:server');
var http = require('http');
const cors = require('cors');
//var server = require('../app').server;

// Remove the redundant declaration of 'server'
// var app = require('../app').app;
var server = http.createServer(app);

const corsOptions = {
  origin: ['http://localhost:3000'], // Add the origins of your client applications
};

app.use(cors(corsOptions));
var socketIO = require('socket.io');
const io = socketIO(server, {
  cors: {
    origin: ['http://localhost:3000','http://localhost:3001'], // Add the origin of your client application
    methods: ['GET', 'POST'],
  },
});






//var server = http.createServer(app);
// var io = socketIO(server);

// Socket.IO logic
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  // Listen for messages from users
  socket.on('userMessage', (message) => {
    console.log('User says:', message);

    // Emit the message to all connected clients (including admin panel)
    io.emit('adminMessage', message);
  });

  // Clean up on disconnect
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});
/**
 * Get port from environment and store in Express.
 */

var port = normalizePort(process.env.PORT || '4444');
app.set('port', port);

/**
 * Listen on provided port, on all network interfaces.
 */

server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  var bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
  var addr = server.address();
  var bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port;
  debug('Listening on ' + bind);
}

--------------------app

var socketIO = require('socket.io'); 

var io = socketIO(); 
app.io = io; 
----------------

import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';



const socket = io('http://localhost:4444'); 
const Mesg = () => {
  const [notifications, setNotifications] = useState([]);


    useEffect(() => {
    //  const socket = io('http://localhost:4444'); //  server address
  
      // Listen for messages from admin
      socket.on('adminMessage', (message) => {
        console.log('Admin says:', message);
      });
  
      // Clean up the socket connection on component unmount
      return () => {
        socket.disconnect();
      };
    }, []);
  


  const handleSendNotification = () => {
    const notificationMessage = prompt('Enter notification message:');
    // Emit the notification to the server
    socket.emit('sendNotification', notificationMessage);
  };

  return (
    <div className='mt-5'>
      <h1>Real-time Notifications</h1>
      <button onClick={handleSendNotification}>Send Notification</button>
      <div>
        <h2>Notifications:</h2>
        <ul>
          {notifications.map((notification, index) => (
            <li key={index}>{notification}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Mesg;
-------



