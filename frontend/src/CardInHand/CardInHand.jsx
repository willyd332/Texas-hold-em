import React, { useState, useContext } from 'react';

// Context
import { GameContext } from '../GameContext/GameContext.jsx'

function CardInHand(props){

const game = useContext(GameContext);


  return(
    <div className="card-in-hand">
      {game.user &&
        <h2>{game.user.hand[props.card]}</h2>
      }
    </div>
  );
}


export default CardInHand;
