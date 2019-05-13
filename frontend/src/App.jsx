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
  const [namespaceSocket,setNamespaceSocket] = React.useState(false)

  React.useEffect(()=>{
    sendUsername()
    getNamespaceSocket();
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

  const getNamespaceSocket = async () => {
    let namespace = await fetch('http://localhost:9000/namespace', {
      credentials: 'include',
    })
    namespace = await namespace.json()
    console.log(namespace)

    const newSocket = await openSocket(`http://localhost:9000${namespace}`)
    console.log(newSocket)

    setNamespaceSocket(newSocket)
  }

  return (
    <div className="App">
      {/* for animation perhaps <canvas className="background"></canvas> */}
      <SocketContext.Provider value={namespaceSocket}>
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
