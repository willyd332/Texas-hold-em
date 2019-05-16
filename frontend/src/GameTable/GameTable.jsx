import React from 'react';

// Reactstrap


// Context

function GameTable(props){
  const game = props.game;


  return(
    <div>
      <h1 id="pot" >${game.pot}</h1>
      {game.flop[0].value &&
        <div className="table-cards" >
          <img className="card-on-table" src={game.flop[0].image} alt={game.flop[0].value && game.flop[0].value + ' ' + game.flop[0].suit} ></img>

          <img className="card-on-table" src={game.flop[1].image} alt={game.flop[1].value && game.flop[1].value + ' ' + game.flop[1].suit} ></img>

          <img className="card-on-table" src={game.flop[2].image} alt={game.flop[2].value && game.flop[2].value + ' ' + game.flop[2].suit} ></img>
        </div>
      }
      {game.river.value &&
        <div className="table-cards" >
          <img className="card-on-table" src={game.river.image} alt={game.river.value && game.river.value + ' ' + game.river.suit} ></img>
        </div>
      }
      {game.turn.value &&
        <div className="table-cards" >
          <img className="card-on-table" src={game.turn.image} alt={game.turn.value && game.turn.value + ' ' + game.turn.suit} ></img>
        </div>
      }
    </div>
  );
}


export default GameTable;
