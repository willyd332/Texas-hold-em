import React, { useState, useContext } from 'react';

// Components


// Context
import {SocketContext} from '../App.jsx';



const defaultPlayer = {
  socketId: null,
  name: "PLAYER MISSING",
  hand: {card1: null, card2: null,},
  money: 0,
  bettingRoundStatus: null,
  betAmount: null,
  cardValue: null,
  status: null,
};


function PlayerBox(props){

// DEFINING VARIABLES FOR EASE
  const io      = useContext(SocketContext);
  const game    = props.game;
  const setGame = props.setGame;
  let   player;
  if (game.users[props.playerNum]) {
        player  = game.users[props.playerNum];
  } else {
        player  = defaultPlayer;
  }

// DEFINES CLASS OF PLAYER BOX
  let playerClass = "player-box"
  if (props.middle === "true"){
    playerClass = "player-box-tall"
  }
  if (player.socketId === io.socket.id){
    playerClass += " currentUser"
  }
  if (player.status){
    playerClass += " playing"
  } else if (game.round) {
    playerClass += " sittingOut"
  }


  console.log(game.round + ' ' + props.playerNum + ' ' + game.turnNumber )

  return(
    <div className={playerClass}>

      <div className="player-display">
        <p className="player-info"><strong>{player.name}</strong></p>
        <p className="player-info"><strong>${player.money}</strong></p>
        {player.status && <div><img  className="card-back" src="https://cdn.shopify.com/s/files/1/0200/7616/products/playing-cards-bicycle-rider-back-1_grande.png?v=1535755695"></img>
          <img  className="card-back" src="https://cdn.shopify.com/s/files/1/0200/7616/products/playing-cards-bicycle-rider-back-1_grande.png?v=1535755695"></img></div>}
      </div>
    </div>
  );
}



export default PlayerBox;
