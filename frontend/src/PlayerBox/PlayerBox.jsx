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
  const turn    = props.turn;
  const setTurn    = props.setTurn;
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
  if (player.status){
    playerClass += " playing"
  } else if (game.round) {
    playerClass += " sittingOut"
  }

  const ante = (ante) => {
    console.log('anteeeeeeeeeeeeeeeeeeeeeeeeee')
    io.socket.emit('ante', {room: io.room, index: props.playerNum, ante: ante,})
  };


  console.log(game.round + ' ' + props.playerNum + ' ' + turn )

  return(
    <div className={playerClass}>
      <p><strong>{player.name}</strong></p>
      <p><strong>${player.money}</strong></p>
      {game.round === 'ante' && turn === props.playerNum ? (
        <div>
          <button onClick={(e) => ante(e.target.value)} value={true} >Ante</button>
          <button onClick={(e) => ante(e.target.value)}>Dont Ante</button>
        </div>
      )
      : game.round === 'bet' ? (
        <p>bet</p>
      )
      : game.round === 'flop' ? (
        <p>flop</p>
      )
      : game.round === 'river' ? (
        <p>river</p>
      )
      : game.round === 'turn' ? (
        <p>turn</p>
      )
      : game.round === 'show' ? (
        <p>show</p>
      ):(
        <h5>Wait For Players</h5>
      )}
    </div>
  );
}



export default PlayerBox;
