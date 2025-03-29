import { useState } from 'react';
import MainChatComp from './MainChatComp';



function App() {
  const [username, setUsername] = useState<string>('');
  const [namegiven, setNamegiven] = useState<boolean>(false);



  return (
    <>
      {
        !namegiven ?
          <div className='form-container'>

            <div className='nameform'>
              <h2 className='nameform__title'>Choose your name</h2>
              <form className='nameform__form' onSubmit={(e) => {
                e.preventDefault();
                if (username.trim() !== '') {
                  setUsername(username);
                  setNamegiven(true)
                }
              }}>
                <input type="text" maxLength={30} className='nameform__input' placeholder='Enter your name' onChange={(e) => setUsername(e.target.value)} />
                <button type='submit' className='sendbtn'>Submit</button>
              </form>
            </div>

          </div>

          :
          <MainChatComp username={username || 'empty'} />
      }


    </>
  );
}

export default App;
