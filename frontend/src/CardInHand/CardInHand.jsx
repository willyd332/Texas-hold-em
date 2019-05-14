import React, { useState, useContext } from 'react';

function CardInHand(props){

  console.log(props.card)


  return(
    <div className="card-in-hand">

      <h2>{props.card.value}</h2>
      
    </div>
  );
}


export default CardInHand;
