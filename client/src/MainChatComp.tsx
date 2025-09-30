import { useEffect, useMemo, useState } from "react";
import "./App.css";
import { io } from "socket.io-client";

enum MessageType {
  message = "message",
  info = "info",
}
interface Message {
  message: string;
  socketid: string;
  type: MessageType;
  username: string;
  time: string;
  room: string;
}

export default function MainChatComp(props: any) {
  const [message, setMessage] = useState<string>("");
  const [messagelist, setMessagelist] = useState<Message[]>([]);

  const [room, setRoom] = useState<string>("global");
  const [shownroom, setShownroom] = useState<string>(room);
  const [username] = useState<string>(props.username || "");
  const [roomgiven, setRoomgiven] = useState<boolean>(false);

  const socket = useMemo(() => {
    return io("http://localhost:9000");
  }, []);

  const getCurrentDateTime = () => {
    const now = new Date();
    return now.toLocaleString();
  };

  useEffect(() => {
    socket.on("connect", () => {
      console.log(socket.id, "connected");
    });

    socket.on("message", (res: Message) => {
      setMessagelist((prev) => [...prev, res]);
    });

    socket.on("join-room", (res: Message) => {
      if (res.socketid == socket.id) {
        setMessagelist([]);
      }

      setMessagelist((prev) => [...prev, res]);
    });

    socket.on("leave-room", (res: Message) => {
      setMessagelist((prev) => [...prev, res]);
      if (res.socketid == socket.id) {
        setMessagelist([]);
      }
    });

    return () => {
      socket.off("connect");
      socket.off("message");
      socket.emit("leave-room", { room });
      socket.disconnect();
    };
  }, []);

  const submitHandel = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // console.log("socket", socket.id);
    socket.emit("message", {
      message: message,
      socketid: socket.id,
      type: MessageType.message,
      username: props.username,
      time: getCurrentDateTime(),
      room: room,
    });
    setMessage("");
  };

  const roomHandel = (e: any) => {
    e.preventDefault();
    if (room.trim() === "" || room.length < 1 || room.trim() === "global") {
      return;
    }
    if (roomgiven) {
      socket.emit("leave-room", {
        message: "",
        socketid: socket.id,
        type: MessageType.info,
        username: username,
        time: getCurrentDateTime(),
        room: room,
      });

      setRoom("global");
      setShownroom("global");
    } else {
      socket.emit("join-room", {
        message: "",
        socketid: socket.id,
        type: MessageType.info,
        username: username,
        time: getCurrentDateTime(),
        room: room,
      });
      setShownroom(room);
    }
    // setMessagelist([]);
    setRoomgiven(!roomgiven);
  };

  return (
    <>
      <div className="rootcomponent">
        <header className="appheader">
          <span className="text-center appheadertext">
            Welcome to Simply Chat
          </span>
        </header>
        <main className="maincontainer">
          <div id="chat-container">
            <div className="center sticky">
              <div className="details">
                <div className="userdetails">Username: {props.username} </div>
                <div className="roomdetails">Room: {shownroom} </div>
              </div>
            </div>

            {messagelist.map((msg: Message, index) =>
              msg.type == "message" ? (
                <div
                  key={index}
                  className={
                    msg.socketid === socket.id ? "mitem right" : "mitem left"
                  }
                >
                  {msg.socketid !== socket.id ? (
                    <div className="m-userdetails">
                      <span>{msg.username}</span>
                      <span className="m-date"> {msg.time} </span>
                    </div>
                  ) : (
                    <div className="m-userdetails">
                      <span>You</span>
                      <span className="m-date"> {msg.time} </span>
                    </div>
                  )}

                  {msg.message}
                </div>
              ) : (
                <div key={index} className="noti">
                  <div className="innernoti">{msg.message}</div>
                </div>
              )
            )}
          </div>
          <form id="chat-form" onSubmit={submitHandel}>
            <div className="roomcontainer">
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
            <div className="messagecontainer">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                id="message-input"
                placeholder="Type your message here..."
                required
              />
              <button type="submit" className="sendbtn">
                Send
              </button>
            </div>
          </form>
        </main>
      </div>
    </>
  );
}
