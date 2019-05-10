import React, { useState, useEffect } from 'react';
import openSocket from 'socket.io-client'

function ChatBox(props){

  const [currMessage,setCurrMessage] = useState('')
  const [recievedMessage,setRecievedMessage] = useState('')
  const socket = openSocket('http://localhost:9000')


  useEffect(() => {
    listenForMessage()
  },[])

  function listenForMessage(){
    socket.on('newMessage', (message) => {
      setRecievedMessage(message)
    });
  }
  function handleChange(e){
    setCurrMessage(e.target.value)
  }
  function handleSubmit(e){
    e.preventDefault()
    socket.emit('message', currMessage);
    setCurrMessage('')
  }

  return(
    <div className="chat-box">
      <p>
        {recievedMessage}
      </p>
      <form onSubmit={handleSubmit}>
        <input onChange={handleChange} value={currMessage}></input>
        <input type="submit"></input>
      </form>
    </div>
  );
}


export default ChatBox;
