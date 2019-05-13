import React from 'react';
import './App.css';
import { Route, Switch } from 'react-router-dom';
import openSocket from 'socket.io-client'

// Components
import MainDiv from './MainDiv/MainDiv.jsx'
import HomeDiv from './HomeDiv/HomeDiv.jsx'

// Contexts
import {socket, SocketContext} from './SocketContext/SocketContext.jsx'

function App() {

  const [user,setUser] = React.useState(false)
  const [room,setRoom] = React.useState('')

  React.useEffect(()=>{
    sendUsername()
  },[user])

  const sendUsername = () => {
    if(user){
      console.log(socket)
    socket.emit('userJoined', user);
  }
  }

  socket.on('connected', (id)=>{
    console.log(id)
    socket.off('connected')
  });

  socket.on('room', (room)=>{
    setRoom(room);
    socket.off('room')
  });

  console.log(room, user)

  return (
    <div className="App">
      {/* for animation perhaps <canvas className="background"></canvas> */}
      {user ?
        <SocketContext.Provider value={{socket: socket, room: room, user: user}}>
          <MainDiv/>
        </SocketContext.Provider>
      :
      <HomeDiv setUser={setUser}/>
        }
    </div>
  );
}

export {App, socket};
