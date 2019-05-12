import React, { useState, useEffect } from 'react';


function ChatView(props){

  const allMessages = props.messages.map((message, index) =>{
    return <span key={index} className='message' ><strong>{message.user}></strong> {message.message}<br/></span>
  })

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
