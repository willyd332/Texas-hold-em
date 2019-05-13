import React, { useState, useContext, useEffect } from 'react';

import {GameContext} from '../GameContext/GameContext.jsx'
import {SocketContext} from '../SocketContext/SocketContext.jsx'

function UserInfo(props){

  const game = useContext(GameContext)
  const socketContext  = useContext(SocketContext)


  console.log(game.game.status)

    socketContext.socket.on('gameStart', () => {
      if (game.game.users.length > 1 && !game.game.status){
        props.startGame()
      }
        socketContext.socket.off('gameStart')
    });


  return(
    <div className="user-info">
      I am the user info/actions
    </div>
  );
}


export default UserInfo;
