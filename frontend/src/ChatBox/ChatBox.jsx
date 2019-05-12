import React, { Component, useState, useEffect } from 'react';
import {socket} from '../SocketContext/SocketContext.jsx'

// Components
import ChatView from '../ChatView/ChatView.jsx';

function ChatBox(props) {

  const [messageList,setMessageList] = useState([]);
  const [currMessage,setCurrMessage] = useState('');

  useEffect(()=>{
    listenForMessage();
  },[messageList])

  const listenForMessage = () => {
    socket.on('newMessage', (message) => {
      setMessageList(messageList.concat([message]));
      socket.off('newMessage');
    });
  }

  const handleChange = (e) => {
    setCurrMessage(e.target.value)
  }
  const handleSubmit = (e) => {
    e.preventDefault()
    socket.emit('message', currMessage);
    setCurrMessage('');
  }

  return (
    <div className="chat-box">
      <ChatView messages={messageList}/>
      <form onSubmit={handleSubmit}>
        <input className="messageInput" placeholder="Write Something" onChange={handleChange} value={currMessage}></input>
      </form>
    </div>
  )
}


export default ChatBox;
