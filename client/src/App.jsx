import React from 'react';
import './App.css';

// Components
import MainDiv from './MainDiv/MainDiv.jsx'
import HomeDiv from './HomeDiv/HomeDiv.jsx'

// Contexts
const SocketContext = React.createContext(0)

function App(props) {

  const socket = props.socket;
  const [user, setUser] = React.useState(false);
  const [room, setRoom] = React.useState(false);
  const [currUser, setCurrUser] = React.useState(false)

  const createUser = (username) => {
    socket.emit('userJoined', username);
  }

  socket.on('room', (createdUser) => {
    setRoom(createdUser.room);
    setUser(createdUser.username);
    socket.off('room');
  });

  return (<div className="App">
    {/* for animation perhaps <canvas className="background"></canvas> */}
    {
      user && room
        ? (<SocketContext.Provider value={{
            socket: socket,
            room: room,
            user: user
          }}>
          <MainDiv currUser={currUser}/>
        </SocketContext.Provider>)
        : (<HomeDiv setCurrUser={setCurrUser} createUser={createUser}/>)
    }
  </div>);
}

export {
  App,
  SocketContext
};
