import './App.css'
import { io } from 'socket.io-client';

function App() {

  const socket = io('http://localhost:5000');

  return (
    <>
      <div>
        <header>
          <h1 className="text-center">Welcome to Simple Chat App</h1>
        </header>
        <main className="maincontainer">
          <div id="chat-container">
            <div className="mitem left">hi</div>
            <div className="mitem right">hello</div>
          </div>
          <form id="chat-form">
            <input type="text" id="message-input" placeholder="Type your message here..." required />
            <button type="submit" className="sendbtn">Send</button>
          </form>
        </main>
      </div>
    </>
  )
}

export default App
