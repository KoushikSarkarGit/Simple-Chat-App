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


io.on('connection', async (cursocket) => {

    let croom = 'global';
    await cursocket.join(croom);

    cursocket.on('join-room', (data) => {
        cursocket.leave(croom)
        cursocket.join(data.room);
        croom = data.room;
        console.log(`User ${cursocket.id} Joined room: ` + data.room);

        cursocket.to(croom).emit('join-room', `User ${data.username} with id ${cursocket.id} Joined room: ` + data.room);
    })

    cursocket.on('leave-room', (data) => {
        cursocket.to(croom).emit('leave-room', `User ${data.username} with id ${cursocket.id} has left the room: ${data.room}`);
        cursocket.leave(data.room)
        cursocket.join('global');
        croom = 'global';
        // cursocket.emit('leave-room', `User ${cursocket.id} has left the room: ${data.room}`);

    })

    cursocket.on('message', (data) => {
        console.log(data.message);
        cursocket.emit('message', data);
        cursocket.to(croom).emit('message', data);
    })

    cursocket.on('disconnect', (data) => {
        cursocket.emit('leave-room', `User ${data.username} with id ${cursocket.id} has left the room: ${data.room}`);
        cursocket.leave(data.room)
    })
})










app.get('/', (req, res) => {
    res.send('Server is up and running');
    console.log('base');
})

myserver.listen(9000, () => {
    console.log('Server is running on port 9000');
});

