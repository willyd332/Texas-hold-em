import React from 'react';
import './App.css';
import { Route, Switch } from 'react-router-dom';


// Components
import MainDiv from './MainDiv/MainDiv.jsx'
import HomeDiv from './HomeDiv/HomeDiv.jsx'

// Contexts
import {socket, SocketContext} from './SocketContext/SocketContext.jsx'

function App() {

  const [user,setUser] = React.useState(false)

  React.useEffect(()=>{
    sendUsername()
  },[user])

  const sendUsername = () => {
    if(user){
    socket.emit('userJoined', user);
  }
  }

  socket.on('connected', (id)=>{
    console.log(id)
    socket.off('connected')
  })

  return (
    <div className="App">
      {/* for animation perhaps <canvas className="background"></canvas> */}
      <SocketContext.Provider value={socket}>
        {user ?
          <MainDiv/>
        :
        <HomeDiv setUser={setUser}/>
        }
      </SocketContext.Provider>
    </div>
  );
}

export {App, socket};
