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

    let croom = 'global';

    cursocket.on('join-room', (data) => {
        // cursocket.join(room);
        // croom = room;;
        console.log(`User ${cursocket.id} Joined room: ` + data.room);

        // cursocket.emit(`User ${cursocket} Joined room: ` + room);
    })

    cursocket.on('message', (data) => {
        console.log(data.message);
        cursocket.emit('message', data);
        cursocket.broadcast.emit('message', data);
        // if (croom == 'global')
        //     cursocket.emit('message', data);
        // else
        //     cursocket.to(croom).emit('message', data);
    })

    cursocket.on('disconnect', (room) => {
        cursocket.emit('leave-room', `User ${cursocket.id} has left the room`);
        cursocket.leave(room)
    })
})










app.get('/', (req, res) => {
    res.send('Server is up and running');
    console.log('base');
})

myserver.listen(9000, () => {
    console.log('Server is running on port 9000');
});

