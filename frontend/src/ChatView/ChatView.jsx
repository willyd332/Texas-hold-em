import React, { useEffect, useContext } from 'react';

// Context
import {SocketContext} from '../App.jsx'


function ChatView(props){

  const io = useContext(SocketContext);

  const allMessages = props.messages.map((message, index) =>{
    if (message.user === io.user){
    return <span key={index} className='message' ><strong>{message.user}<span className="blueArrow"> ></span></strong> {message.message}<br/></span>
    } else {
    return <span key={index} className='message' ><strong>{message.user} ></strong> {message.message}<br/></span>
  };
});

  let messagesEnd;

  useEffect(()=>{
    messagesEnd.scrollIntoView({ behavior: "smooth" })
  })

  return(
    <div id="chatBigDiv">
      <div className="chat-view">
        <div className="chat-message">
          <span className='message' >> <br/></span>
          {allMessages}
        </div>
      </div>
      <div style={{ float:"left", clear: "both" }}
        ref={(el) => { messagesEnd = el; }}>
      </div>
    </div>
  );
}

export default ChatView;
