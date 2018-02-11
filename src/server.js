const http = require('http');
const socketio = require('socket.io');

const fs = require('fs');

const PORT = process.env.PORT || process.env.NODE_PORT || 3000;

const handler = (req, res) => {
  // handle sending back the html
  fs.readFile(`${__dirname}/../client/index.html`, (err, data) => {
    if (err) {
      throw err;
    }
    res.writeHead(200);
    res.end(data);
  });
};

const app = http.createServer(handler);

const io = socketio(app);

const square = {

  lastUpdate: new Date().getTime(),
  x: 0, // x position of our square
  y: 0, // y position of our square
  height: 100, // height of our square
  width: 100, // width of our square
};


app.listen(PORT);

// On connection join a room
io.on('connection', (socket) => {
  const s = socket;
  s.join('room1');

  socket.on('draw', (data) => {
    if (data.time > square.lastUpdate) {
      square.lastUpdate = data.time;
      square.x = data.x;
      square.y = data.y;
      io.sockets.in('room1').emit('updateDraws', data);
    }
  });
});
