import React, { useState, useEffect, useContext } from 'react';

// Reactstrap


// Context
import { SocketContext } from '../App.jsx'

function GameTable(props){
  const game = props.game;
  const io   = useContext(SocketContext);


  return(
    <div>
      <h1>${game.pot}</h1>
    </div>
  );
}


export default GameTable;
