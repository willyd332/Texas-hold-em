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
  const [currBet,setCurrBet] = useState()



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


    const handleBet = () => {
      const bet = parseInt(currBet) + game.maxBet;
      if (bet <= player.money){
      io.socket.emit('bet', {
        room: io.room,
        index: playerIndex,
        bet: bet,
      });
      setCurrBet(0);
    }
    };
    const handleCall = () => {
      if (game.maxBet <= player.money){
      io.socket.emit('bet', {
        room: io.room,
        index: playerIndex,
        bet: game.maxBet,
      });
      setCurrBet();
    }
    };
    const handleCheck = () => {
      if (game.maxBet === 0){
      io.socket.emit('bet', {
        room: io.room,
        index: playerIndex,
        bet: 0,
      });
      setCurrBet();
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
      : game.round === 'bet' && game.turnNumber === playerIndex && game.users[game.turnNumber].socketId === io.socket.id && player.status ? (
        <div>
          <form onSubmit={(e)=>{
            e.preventDefault();
            if (currBet.length > 0){
              handleBet(e)
            };
          }}>
            <input type="number" onChange={(e)=>setCurrBet(e.target.value)} value={currBet} placeholder={game.maxBet} ></input>
            <button type="submit">Raise</button>
          </form>
          <button onClick={handleFold}>Fold</button>
          <button onClick={handleCall}>Call</button>
          <button onClick={handleCheck}>Check</button>
        </div>
      ):(
        <h5>Not Playing</h5>
      )}


    </div>
  );
}


export default UserInfo;
