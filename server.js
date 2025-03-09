const express = require('express');
const { createServer } = require('http');
const cors = require('cors');
const socketio = require('socket.io');


const app = express();
app.use(cors());

const myserver = createServer(app);
const io = new socketio.Server(myserver, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST'],
        credentials: true
    }
});


io.on('connection', (cursocket) => {

    console.log('New connection');

    cursocket.on('message', (message) => {
        cursocket.emit('message', message);
        cursocket.broadcast.emit('message', message);
    })
})








app.get('/', (req, res) => {
    res.send('Server is up and running');
    console.log('base');
})

myserver.listen(9000, () => {
    console.log('Server is running on port 9000');
});

