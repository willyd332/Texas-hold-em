import React, { useState, useContext } from 'react';




function PlayerBox(props){


  let playerClass = "player-box"
  if (props.middle === "true"){
    playerClass = "player-box-tall"
  }

  return(
    <div className={playerClass}>

    </div>
  );
}



export default PlayerBox;
