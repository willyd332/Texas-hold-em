import React from 'react';
import './App.css';
import { Route, Switch } from 'react-router-dom';

// Components
import HelloWorld from './HelloWorld/HelloWorld.jsx'


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
      <Switch>
        <Route exact path="/hello" render={props => <HelloWorld hello="Hello"/> } />
        <Route component={ My404 } />
      </Switch>
    </div>
  );
}

export default App;
