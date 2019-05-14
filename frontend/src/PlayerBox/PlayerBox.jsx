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

  return(
    <div className={playerClass}>
      <p><strong>{player.name}</strong></p>
      <p><strong>${player.money}</strong></p>
      {game.round === 'ante' ? (
        <h4>ante</h4>
      )
      : game.round === 'bet' ? (
        <h4>bet</h4>
      )
      : game.round === 'flop' ? (
        <h4>flop</h4>
      )
      : game.round === 'river' ? (
        <h4>river</h4>
      )
      : game.round === 'turn' ? (
        <h4>turn</h4>
      )
      : game.round === 'show' ? (
        <h4>show</h4>
      ):(
        <h5>Wait For Players</h5>
      )}
    </div>
  );
}



export default PlayerBox;
