import { useEffect, useMemo, useState } from 'react';
import './App.css';
import { io } from 'socket.io-client';



enum MessageType {
    message = 'message',
    info = 'info',

}
interface Message {
    message: string;
    socketid: string;
    type: MessageType;
    username: string;
    time: string;
}

export default function MainChatComp(props: any) {

    const [message, setMessage] = useState<string>("");
    const [messagelist, setMessagelist] = useState<Message[]>([]);

    const [room, setRoom] = useState<string>('global');
    const [shownroom, setShownroom] = useState<string>(room);
    const [roomgiven, setRoomgiven] = useState<boolean>(false);

    const socket = useMemo(() => {
        return io('http://localhost:9000');
    }, []);


    const getCurrentDateTime = () => {
        const now = new Date();
        return now.toLocaleString();
        // return format(new Date(), 'PPpp');
        // Or other formats:
        // format(new Date(), 'PPpp'); // "Mar 29, 2024, 2:30 PM"
        // format(new Date(), 'yyyy-MM-dd HH:mm:ss'); // "2024-03-29 14:30:45"
    };



    useEffect(() => {

        socket.on('connect', () => {
            console.log(socket.id, 'connected');
        });

        socket.on('message', (data: Message) => {
            setMessagelist((prev) => [...prev, data]);
        });

        socket.on('join-room', (msg: any) => {
            console.log(msg);
        });
        socket.on('leave-room', (msg: any) => {
            console.log(msg);
        });

        return () => {
            socket.off('connect');
            socket.off('message');
            socket.emit('leave-room', { room });
            socket.disconnect();
        };
    }, []);

    const submitHandel = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log('socket', socket.id);
        socket.emit('message', {
            message: message,
            socketid: socket.id,
            type: MessageType.message,
            username: props.username,
            time: getCurrentDateTime()
        });
        setMessage("");
    };

    const roomHandel = (e: any) => {
        e.preventDefault();
        if (room.trim() === '' || room.length < 1 || room.trim() === 'global') {
            return;
        }
        if (roomgiven) {
            socket.emit('leave-room', { room });
            setRoom('global');
            setShownroom('global');
        } else {
            socket.emit('join-room', { room: room, });
            setShownroom(room);
        }
        setMessagelist([])
        setRoomgiven(!roomgiven);
    };

    return (
        <>
            <div>
                <header>
                    <h2 className="text-center">Welcome to Simple Chat App</h2>
                </header>
                <main className="maincontainer">
                    <div id="chat-container">
                        <div className='center'>
                            <div className='details'>
                                <div className='userdetails'>User: {props.username} </div>
                                <div className='roomdetails'>Chatting in room: {shownroom}  </div>
                            </div>
                        </div>


                        {messagelist.map((msg, index) => (
                            <div key={index} className={msg.socketid === socket.id ? "mitem right" : "mitem left"}>

                                {msg.socketid !== socket.id ?

                                    <div className='m-userdetails'>
                                        <span >{msg.username}</span>
                                        <span className='m-date' > {msg.time} </span>
                                    </div>
                                    :
                                    <div className='m-userdetails'>
                                        <span className='m-date' > {msg.time} </span>
                                    </div>}

                                {msg.message}
                            </div>
                        ))}
                    </div>
                    <form id="chat-form" onSubmit={submitHandel}>
                        <div className='roomcontainer'>
                            <input
                                type="text"
                                value={room}
                                maxLength={20}
                                disabled={roomgiven}
                                onChange={(e) => setRoom(e.target.value)}
                                id="room-input"
                                placeholder="Type your room here..."
                            />
                            <button type="button" className="sendbtn" onClick={roomHandel}>
                                {roomgiven ? "Leave Room" : "Join Room"}
                            </button>
                        </div>
                        <input
                            type="text"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            id="message-input"
                            placeholder="Type your message here..."
                            required
                        />
                        <button type="submit" className="sendbtn">Send</button>
                    </form>
                </main>
            </div>
        </>
    )
}
