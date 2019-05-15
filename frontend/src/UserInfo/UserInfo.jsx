import React, { useState, useContext, useEffect } from 'react';

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


function UserInfo(props){



  // STATE
  const [currBet,setCurrBet] = useState(props.game.maxBet)



  const io      = useContext(SocketContext);
  const game    = props.game;
  const setGame = props.setGame;
  let   player;
  let   playerIndex;
  game.users.forEach((user,index)=>{
      if (io.socket.id === user.socketId){
        player = user;
        playerIndex = index;
      };
  })

  if(!player){
        player  = defaultPlayer;
  }



  // HANDLES THE ANTE DECISION (EMITS ANTE)
    const handleAnte = (e) => {
      console.log('anteeeeeeeeeeeeeeeeeeeeeeeeee')
      e.target.disabled = true;
      io.socket.emit('ante', {
        room: io.room,
        index: playerIndex,
        ante: e.target.value,
      });
    };


    const handleBet = (e) => {
      e.preventDefault()

      if (currBet >= game.maxBet && currBet <= player.money){
      io.socket.emit('bet', {
        room: io.room,
        index: playerIndex,
        bet: currBet,
      });
      setCurrBet(0);
    }
    };

    const handleFold = () => {
      io.socket.emit('fold', {
        room: io.room,
        index: playerIndex,
      });
    }

    console.log(game)

  return(
    <div className="user-info">


      {game.round === 'ante' && game.turnNumber === playerIndex && game.users[game.turnNumber].socketId === io.socket.id ? (
        <div>
          <button onClick={(e) => handleAnte(e)} value={true} >Ante</button>
          <button onClick={(e) => handleAnte(e)}>Dont Ante</button>
        </div>
      )
      : game.round === 'bet' && game.turnNumber === playerIndex && game.users[game.turnNumber].socketId === io.socket.id ? (
        <form onSubmit={(e)=>handleBet(e)}>
          <input type="number" onChange={(e)=>setCurrBet(e.target.value)} value={currBet}></input>
          <button onClick={handleFold}>Fold</button>
          <input type="submit"></input>
        </form>
      ):(
        <h5>Wait For Players</h5>
      )}


    </div>
  );
}


export default UserInfo;
