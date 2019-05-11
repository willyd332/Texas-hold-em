import React from 'react';
import './App.css';
import { Route, Switch } from 'react-router-dom';


// Components
import MainDiv from './MainDiv/MainDiv.jsx'
import HomeDiv from './HomeDiv/HomeDiv.jsx'
import NavBar from './NavBar/NavBar.jsx'

// Contexts
import {socket, SocketContext} from './SocketContext/SocketContext.jsx'

const My404 = () => {
  return(
    <div>
      404 page not found
    </div>
    )
}

function App() {
  return (
    <div className="App">
      {/* for animation perhaps <canvas className="background"></canvas> */}
      <SocketContext.Provider>
        <NavBar />
        <Switch>
          <Route exact path="/" render={props => <HomeDiv/> } />
          <Route exact path="/game" render={props => <MainDiv socket={socket}/> } />
          <Route component={ My404 } />
        </Switch>
      </SocketContext.Provider>

    </div>
  );
}

export {App, socket};
