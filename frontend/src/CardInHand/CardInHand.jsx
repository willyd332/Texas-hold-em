import React from 'react';

function CardInHand(props){

  return(
    <div className="card-in-hand">

      {props.card.image &&
        <img className="card-in-hand-img" src={props.card.image} alt={props.card.value && props.card.value + ' ' + props.card.suit} ></img>
      }
        </div>
  );
}


export default CardInHand;
