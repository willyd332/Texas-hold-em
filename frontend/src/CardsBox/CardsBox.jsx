import React, { useState, useContext } from 'react';

// Components
import CardInHand from '../CardInHand/CardInHand.jsx'

function CardsBox(props){

  return(
    <div className="cards-box">
      <CardInHand card='card1' ></CardInHand>
      <CardInHand card='card2' ></CardInHand>
    </div>
  );
}


export default CardsBox;
