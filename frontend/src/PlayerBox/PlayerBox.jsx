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

  const io      = useContext(SocketContext);
  const game    = props.game;
  const setGame = props.setGame;
  let   player;
  if (game.users[props.playerNum]) {
        player  = game.users[props.playerNum];
  } else {
        player  = defaultPlayer;
  }


  let playerClass = "player-box"
  if (props.middle === "true"){
    playerClass = "player-box-tall"
  }
  if (player.socketId === io.socket.id){
    playerClass += " currentUser"
  }

  console.log(player)

  return(
    <div className={playerClass}>
      <p><strong>{player.name}</strong></p>
      <p><strong>${player.money}</strong></p>
      {game.round === 'draw' ? (
        <h4>Draw</h4>
      )
      : game.round === 'bet' ? (
        <h4>Draw</h4>
      ) : (
        <h3>Wait For Players</h3>
      )
        }
    </div>
  );
}



export default PlayerBox;
