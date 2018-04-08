import express from 'express';
import path from 'path';
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);


app.set('port', process.env.PORT || 3000);
app.use(express.static(path.join(__dirname + '/public')));

server.listen(app.get('port'), () => {
  console.info(`Server is listening on http://localhost:${app.get('port')}`);
});

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

app.get('/javascript', (req, res) => {
  res.sendFile(__dirname + '/public/javascript.html');
});

app.get('/swift', (req, res) => {
  res.sendFile(__dirname + '/public/swift.html');
});

app.get('/css', (req, res) => {
  res.sendFile(__dirname + '/public/css.html');
});

// tech namespace
const tech = io.of('/tech');

tech.on('connection', (socket) => {
  socket.on('join', (data) => {
    socket.join(data.room);
    tech.in(data.room).emit('message', `New user joined the ${data.room} room!`)
  })
  socket.on('message', (data) => {
    console.info(`message: ${data.msg}`);
    tech.in(data.room).emit('message', data.msg);
  });

  socket.on('disconnect', () => {
    console.info('user disconnected');
    tech.emit('message', 'user disconnected')
  })
});