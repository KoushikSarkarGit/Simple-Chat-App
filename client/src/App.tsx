import { useState } from "react";
import MainChatComp from "./MainChatComp";

function App() {
  const [username, setUsername] = useState<string>("");
  const [namegiven, setNamegiven] = useState<boolean>(false);

  return (
    <>
      {!namegiven ? (
        <div>
          <div className="form-container">
            <div className="nameform">
              <header className="appheader">
                <h1 className="text-center ">Welcome to Simply Chat</h1>
                <div>
                  <span>Anonymous | Secure | Forgettable</span>
                </div>
              </header>
              <p>Enter your username to join</p>
              <form
                className="nameform__form"
                onSubmit={(e) => {
                  e.preventDefault();
                  if (username.trim() !== "") {
                    setUsername(username);
                    setNamegiven(true);
                  }
                }}
              >
                <input
                  type="text"
                  maxLength={20}
                  className="nameform__input"
                  placeholder="Enter your name"
                  onChange={(e) => setUsername(e.target.value)}
                />
                <button type="submit" className="">
                  Submit
                </button>
              </form>
            </div>
          </div>
        </div>
      ) : (
        <MainChatComp username={username || "empty"} />
      )}
    </>
  );
}

export default App;
