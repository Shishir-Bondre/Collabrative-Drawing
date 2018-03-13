var express = require('express');
var app = express();
var path = require('path');
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var port = process.env.PORT || 8080;

server.listen(port, function() {
  console.log('Server listening at port %d', port);
});

app.use(express.static(__dirname + '/public'));

//  function onConnection(socket) {
//   socket.on('drawing', data => socket.broadcast.emit('drawing', data));
// }

//io.on('connection', onConnection);
var numUsers = 0;

io.on('connection', function(socket) {
  var addUser = false;
  console.log('connected');
  socket.on('add user', function(username) {
    console.log(username);
    console.log('in adding username');
    if (addUser) return;
    socket.username = username;
    ++numUsers;
    addedUser = true;
    socket.emit('login', {
      numUsers: numUsers
    });
    console.log(socket.username);
    socket.broadcast.emit('user joined', {
      username: socket.username,
      numUsers: numUsers
    });
  });
  socket.on('drawing', function(data) {
    socket.broadcast.emit('drawing', data);
  });

  socket.on('disconnect', function() {
    if (addUser) {
      --numUsers;
      // echo globally that this client has left
      socket.broadcast.emit('user left', {
        username: socket.username,
        numUsers: numUsers
      });
    }
  });
});
