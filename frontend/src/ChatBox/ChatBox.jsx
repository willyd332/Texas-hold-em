import React, {useContext, useState, useEffect} from 'react';
import {SocketContext} from '../App.jsx'

// Components
import ChatView from '../ChatView/ChatView.jsx';

function ChatBox(props) {

  const [messageList, setMessageList] = useState([]);
  const [currMessage, setCurrMessage] = useState('');
  const socketContext = useContext(SocketContext)

  useEffect(() => {
    listenForMessage();
  }, [messageList])

  const listenForMessage = () => {
    socketContext.socket.on('newMessage', (message) => {
      setMessageList(messageList.concat([message]));
      socketContext.socket.off('newMessage');
    });
  }

  const handleChange = (e) => {
    setCurrMessage(e.target.value)
  }
  const handleSubmit = (e) => {
    e.preventDefault()
    socketContext.socket.emit('message', {
      message: currMessage,
      room: socketContext.room,
      user: socketContext.user
    });
    setCurrMessage('');
  }

  return (<div className="chat-box">
    <ChatView messages={messageList}/>
    <form onSubmit={handleSubmit}>
      <input className="messageInput" placeholder="Write Something" onChange={handleChange} value={currMessage}></input>
    </form>
  </div>)
}

export default ChatBox;
