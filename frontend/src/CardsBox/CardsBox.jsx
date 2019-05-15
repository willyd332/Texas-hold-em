import React, { useState, useContext } from 'react';

// Components
import CardInHand from '../CardInHand/CardInHand.jsx';

// Context
import { SocketContext } from '../App.jsx';


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



function CardsBox(props){

  const io = useContext(SocketContext);

  const user = props.game.users.filter((user) => {
    return user.socketId === io.socket.id;
  })

  return(
    <div className="cards-box">
      <CardInHand card={user[0].hand[0]} ></CardInHand>
      <CardInHand card={user[0].hand[1]} ></CardInHand>
    </div>
  );
}


export default CardsBox;
