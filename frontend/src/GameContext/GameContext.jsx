import React from 'react';


const defaultGame = {
  room: '',
  users: [],
  pot: 10,
  maxBet: 0,
  flop: {card1: 'ace', card2: 'ace', card3: 'ace',},
  river: {card1: 'king'},
  turn: {card1: 'king'},
  status: false,
}

export const GameContext = React.createContext(defaultGame);
