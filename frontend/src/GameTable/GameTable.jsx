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
      {game.flop[0].value &&
        <div>
          <img className="card-on-table" src={game.flop[0].image} alt={game.flop[0].value && game.flop[0].value + ' ' + game.flop[0].suit} ></img>

          <img className="card-on-table" src={game.flop[1].image} alt={game.flop[1].value && game.flop[1].value + ' ' + game.flop[1].suit} ></img>

          <img className="card-on-table" src={game.flop[2].image} alt={game.flop[2].value && game.flop[2].value + ' ' + game.flop[2].suit} ></img>
        </div>
      }
    </div>
  );
}


export default GameTable;
