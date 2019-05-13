import React, { useState, useContext } from 'react';

// Context
import {GameContext} from '../GameContext/GameContext.jsx'


function PlayerBox(props){

  const game = useContext(GameContext)


  let playerClass = "player-box"
  if (props.middle === "true"){
    playerClass = "player-box-tall"
  }

  return(
    <div className={playerClass}>
      { game.game.users[props.player] &&
        <div className={game.game.users[props.player] === game.user &&
          "currentUser"
        }>
          <p><strong>{game.game.users[props.player].name}</strong></p>
          <p>${game.game.users[props.player].money}</p>
        </div>
      }
    </div>
  );
}



export default PlayerBox;
