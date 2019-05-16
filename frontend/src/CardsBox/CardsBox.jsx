import React, { useContext } from 'react';

// Components
import CardInHand from '../CardInHand/CardInHand.jsx';

// Context
import { SocketContext } from '../App.jsx';



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
