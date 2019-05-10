import React, { useState } from 'react';


function PlayerBox(props){


  let playerClass = "player-box"
  if (props.middle === "true"){
    playerClass = "player-box-tall"
  }

  return(
    <div className={playerClass}>
      I am {props.player} player
    </div>
  );
}



export default PlayerBox;
