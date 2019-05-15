import React, { useState, useContext } from 'react';

function CardInHand(props){

  return(
    <div className="card-in-hand">

      <img className="card-in-hand" src={props.card.image} alt={props.card.value && props.card.value + ' ' + props.card.suit} ></img>

    </div>
  );
}


export default CardInHand;
