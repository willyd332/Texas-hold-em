import React, { useState, useEffect } from 'react';


function ChatView(props){

  const allMessages = props.messages.map((message, index) =>{
    return <span key={index} className='message' >> {message}<br/></span>
  })

  return(
    <div id="chatBigDiv">
      <div className="chat-view">
        <div className="chat-message">
          <span className='message' >> <br/></span>
          {allMessages}
        </div>
      </div>
    </div>
  );
}

export default ChatView;
