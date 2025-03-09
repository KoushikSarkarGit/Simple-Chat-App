import { useEffect, useMemo, useState } from 'react';
import './App.css'
import { io } from 'socket.io-client';

function App() {


  const [message, setMessage] = useState("");
  const [messagelist, setMessagelis] = useState([] as any);

  const socket = useMemo(() => {
    return io('http://localhost:9000');
  }, [])



  useEffect(() => {
    socket.on('connect', () => {
      console.log(socket.id, 'connected');

    })

    socket.on('message', (data) => {
      console.log(data);

      setMessagelis((prev: any) => { return [...prev, data] })
    })

  }, [])

  const submitHandel = (e: any) => {
    e.preventDefault();
    socket.emit('message', {
      message: message,
      socketid: socket.id
    });
    setMessage("");
  }

  return (
    <>
      <div>
        <header>
          <h1 className="text-center">Welcome to Simple Chat App</h1>
        </header>
        <main className="maincontainer">
          <div id="chat-container">
            {
              messagelist.map((msg: any, index: any) => {
                return (
                  <div key={index} className={msg.socketid == socket.id ? "mitem right" : "mitem left"}>{msg.message}</div>
                )
              })
            }


          </div>
          <form id="chat-form" onSubmit={submitHandel}>
            <input type="text" value={message} onChange={(e) => {
              e.preventDefault();
              setMessage(e.target.value)
            }} id="message-input" placeholder="Type your message here..." required />
            <button type="submit" className="sendbtn">Send</button>
          </form>
        </main>
      </div>
    </>
  )
}

export default App
