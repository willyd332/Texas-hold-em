import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import './App.css';
import {App} from './App.jsx';
import * as serviceWorker from './serviceWorker';
import { BrowserRouter } from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css'
import openSocket from 'socket.io-client'


const socket = openSocket(process.env.REACT_APP_BACKEND_ADDRESS);
// const socket = openSocket('http://100.70.16.169:9000');



ReactDOM.render(
  <BrowserRouter>
  <App className="App" socket={socket}/>
  </BrowserRouter>
  , document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
