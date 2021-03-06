import React, {useContext} from 'react';

// Components

// Context
import {SocketContext} from '../App.jsx';

const defaultPlayer = {
  socketId: null,
  name: "",
  hand: {
    card1: null,
    card2: null
  },
  money: null,
  bettingRoundStatus: null,
  betAmount: null,
  cardValue: null,
  status: null
};

function PlayerBox(props) {

  // DEFINING VARIABLES FOR EASE
  const io = useContext(SocketContext);
  const game = props.game;
  let player;
  if (game.users[props.playerNum]) {
    player = game.users[props.playerNum];
  } else {
    player = defaultPlayer;
  }

  // DEFINES CLASS OF PLAYER BOX
  let playerClass = "player-box"
  if (props.middle === "true") {
    playerClass = "player-box-tall"
  }
  if (player.socketId === io.socket.id) {
    playerClass += " currentUser"
  }
  if (player.status) {
    playerClass += " playing"
  } else if (game.round) {
    playerClass += " sittingOut"
  }
  if (game.winners.includes(props.playerNum)) {
    playerClass += " winner"
  }

  return (<div className={playerClass}>
    {game.turnNumber === props.playerNum && <img className="poker-chips" src="https://www.pinclipart.com/picdir/middle/104-1041818_chips-png-transparent-image-pngpix-poker-clipart.png" alt="active-player"></img>}
    <div className="player-display">
      <p className="player-info-name">
        <strong>{player.name}</strong>
      </p><br/>
      <p className="player-info-money">
        <strong>${player.money}</strong>
      </p>
      {
        game.round !== "finished" && player.status
          ? (<div className="card-back-div">
            <img className="card-back" src="https://cdn.shopify.com/s/files/1/0200/7616/products/playing-cards-bicycle-rider-back-1_grande.png?v=1535755695" alt="cardBack"></img>
            <img className="card-back" src="https://cdn.shopify.com/s/files/1/0200/7616/products/playing-cards-bicycle-rider-back-1_grande.png?v=1535755695" alt="cardBack"></img>
          </div>)
          : game.round === "finished" && player.status
            ? (<div className="final-card-back-div">
              <img className="final-card-back" src={player.hand[0].image} alt={player.hand[0].code}></img>
              <img className="final-card-back" src={player.hand[1].image} alt={player.hand[1].code}></img>
            </div>)
            : (<div></div>)
      }
    </div>
  </div>);
}

export default PlayerBox;
