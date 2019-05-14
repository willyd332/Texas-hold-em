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

// STATE
const [currBet,setCurrBet] = useState(0)

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

// HANDLES THE ANTE DECISION (EMITS ANTE)
  const handleAnte = (ante) => {
    console.log('anteeeeeeeeeeeeeeeeeeeeeeeeee')
    io.socket.emit('ante', {
      room: io.room,
      index: props.playerNum,
      ante: ante,
    });
  };


  const handleBet = (e) => {
    e.preventDefault()
    console.log('BETTTTTIIINNNGGG')
    io.socket.emit('bet', {
      room: io.room,
      index: props.playerNum,
      bet: currBet,
    });
  };


  console.log(game.round + ' ' + props.playerNum + ' ' + game.turnNumber )

  return(
    <div className={playerClass}>
      <p><strong>{player.name}</strong></p>
      <p><strong>${player.money}</strong></p>
      {game.round === 'ante' && game.turnNumber === props.playerNum && game.users[game.turnNumber].socketId === io.socket.id ? (
        <div>
          <button onClick={(e) => handleAnte(e.target.value)} value={true} >Ante</button>
          <button onClick={(e) => handleAnte(e.target.value)}>Dont Ante</button>
        </div>
      )
      : game.round === 'bet' && game.turnNumber === props.playerNum && game.users[game.turnNumber].socketId === io.socket.id ? (
        <form onSubmit={(e)=>handleBet(e)}>
          <input type="number" onChange={(e)=>setCurrBet(e.target.value)} value={currBet}></input>
          <input type="submit"></input>
        </form>
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
