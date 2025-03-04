const express = require('express');
const { createServer } = require('http');
const cors = require('cors');
const socketio = require('socket.io');


const app = express();
app.use(cors());

const myserver = createServer(app);
const io = new socketio.Server(myserver);


io.on('connection', () => {
    console.log('user connected');
})


app.get('/', (req, res) => {
    res.send('Server is up and running');
    console.log('base');
})

myserver.listen(9000, () => {
    console.log('Server is running on port 9000');
});

