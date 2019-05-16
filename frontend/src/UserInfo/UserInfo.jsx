import React, { useState, useContext } from 'react';

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
      if (currBet === 0 && game.maxBet === 0){
        handleCall()
      }
      const bet = parseInt(currBet) + game.maxBet;
      if (bet <= player.money){
      io.socket.emit('bet', {
        room: io.room,
        index: playerIndex,
        bet: bet,
        type: 'raise',
      });
      setCurrBet();
    }
    };
    const handleCall = () => {
      if (game.maxBet <= player.money){
      io.socket.emit('bet', {
        room: io.room,
        index: playerIndex,
        bet: game.maxBet,
        type: 'call',
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
        type: 'call',
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


  const activePlayers = game.users.filter((user) => {
        return user.status
    });


  return(
    <div className="user-info">


      {game.round === 'ante' && game.turnNumber === playerIndex && game.users[game.turnNumber].socketId === io.socket.id ? (
        <div  className="actions-box" >
          <button className="ante-btn" onClick={(e) => handleAnte(e)} value={true} >ANTE UP</button>
          <button className="ante-btn" onClick={(e) => handleAnte(e)}>SIT OUT</button>
        </div>
      )
      : game.round === 'bet' && game.turnNumber === playerIndex && game.users[game.turnNumber].socketId === io.socket.id && player.status && activePlayers.length > 1 ? (
        <div className="actions-box" >
          <form className="bet-form" onSubmit={(e)=>{
            e.preventDefault();
            if (currBet){
              handleBet(e)
            };
          }}>
            <button className="bet-form-input" type="submit">Call {game.maxBet} & Raise By</button>
            <input  className="bet-form-input" type="number" onChange={(e)=>setCurrBet(e.target.value)} placeholder='0' ></input>
          </form>
          <div className="user-actions">
            <button className="action-btn" onClick={handleFold}>Fold</button>
            <button className="action-btn" onClick={handleCall}>Call {game.maxBet}</button>
            <button className="action-btn" onClick={handleCheck}>Check</button>
          </div>
        </div>
      ): activePlayers.length === 1 && activePlayers[0] === player && game.round !== "ante" ? (
        <button className="action-btn">Round Over</button>
      ) : (
        <div className="actions-box" >
          <form className="bet-form">
            <button className="bet-form-input" type="submit" disabled={true} ></button>
          </form>
          <div className="user-actions">
            <button className="action-btn" disabled={true} >Fold</button>
            <button className="action-btn" disabled={true} >Call {game.maxBet}</button>
            <button className="action-btn" disabled={true} >Check</button>
          </div>
        </div>
      )}


    </div>
  );
}


export default UserInfo;
