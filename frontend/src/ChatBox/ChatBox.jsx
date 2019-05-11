import React, { Component } from 'react';

// Components
import ChatView from '../ChatView/ChatView.jsx';

class ChatBox extends Component{
  constructor(props){
    super(props)

    this.state = {
      currMessage: '',
      messageList: [],
    }
    props.socket.on('newMessage', (message) => {
      this.setState({
        messageList: this.state.messageList.concat([message])
    });
  });
  }

  handleChange = (e) => {
    this.setState({
      currMessage: e.target.value,
    })
  }
  handleSubmit = (e) => {
    e.preventDefault()
    this.props.socket.emit('message', this.state.currMessage);
    this.setState({
      currMessage: '',
    })
  }
render(){
  return(
    <div className="chat-box">
      <ChatView socket={this.props.socket} messages={this.state.messageList} />
      <form onSubmit={this.handleSubmit}>
        <input className="messageInput" placeholder="Write Something" onChange={this.handleChange} value={this.state.currMessage}></input>
      </form>
    </div>
  );
}
}


export default ChatBox;
