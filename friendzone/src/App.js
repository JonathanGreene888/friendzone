import React, { useEffect, useState } from 'react';
import './App.css';
import {w3cwebsocket as W3CWebSocket } from 'websocket';

const client = new W3CWebSocket('ws://127.0.0.1:8000');



function App() {

  const [isLoggedIn, setIsLoggedIn] = useState( false );
  const [usersMessage, setUsersMessage] = useState('');
  const [userName, setUserName] = useState('');
  const [allMessages, setAllMessages] = useState([]);

  useEffect(() => {
    client.onopen = () => {
      console.log("websocket is connected");
    };
  });

  useEffect(() => {
    client.onmessage = (message) => {
      const dataFromServer = JSON.parse(message.data);
      console.log(" Reply recieved ", dataFromServer)
      if(dataFromServer.type === 'message') {
        setAllMessages([...allMessages, {
          msg: dataFromServer.msg,
          user: dataFromServer.user,
        }])
      }
    };
  });

  const sendMessage = () => {
  client.send(JSON.stringify({
    type: 'message',
    msg: usersMessage,
    user: userName,
  }))
  setUsersMessage('')
  }
  
  const loginUser = () => {
    setIsLoggedIn(true);
  }

  const changeUsername = (character) => {
    setUserName(character.target.value)
  }

  const changeUsersMessage = (character) => {
    setUsersMessage(character.target.value)
  }


  return (
    <div className="App">
      <header className="App-header">
        <h1>
          FRIEND ZONE
        </h1>
      </header>
      <body className="App-body">
        {isLoggedIn ? 
        <div>
          <input type='text' name="message" value={usersMessage} onChange={(e) => changeUsersMessage(e)} ></input>
        <button onClick={() => sendMessage()}> Send Message </button>
        </div>
       : <div>
         <input name="Username" value={userName} onChange={(e) => changeUsername(e)} ></input>
         <button onClick={() => loginUser()}> Login In</button>
         </div>
       }
       {
         allMessages.map(message => <div> user: {message.user} <br/> message: {message.msg}  </div>)
        }
      </body>
    </div>
  );
}

export default App;
