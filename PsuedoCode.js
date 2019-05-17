/*

// user opens website

// JOINING A GAME

// They enter their name and click submit

  // On the server side
    // server checks the current games (maybe youll have to use a factory)
      // if a game isn't full, the server sends back that namespace
        // The React app then creates a socket for that namespace
        // and send the inputed username to the server
            // The server adds that user to the namespace (class with user array)
            // The server emits the game data bac to the player
                // ** in other words, the server/namespace class will act as a
                // ** shared state with all the players. It will need their
                // ** names, money, cards, pot, flop/river, etc... The game
                // ** logic will be filtered through the socket
                        // EX.
                          // Player bets (bet # is sent to server)
                          // Server adds bet to pot and sends over info to all
                          // Server also sends "turn" to next player
                          // when player receives turn, their turn state is true
                          // then they get to make a bet (if (turn){render <bet>}
   // If the game is full it checks the next game.
   // If all games are full, it creates a new Game class and namespace.

 // On the React side
   // Receives game data from server and updates tha game board accordingly
   // This state will probably be done in the main div Component, or a context object
      // poker ensuse (being filtered with sockets constantly)


// PLAYING POKER

// up to 8 players in a game
// All players can see the others' names and money
// All players start off with $10,000

// MVP:
  // Each player is delt two cards
    --> SOCKET
      // Yours are visible, the others aren't


  // BETTING ROUND
    // First player (determined in server) makes a move
      // If he bets,
          // the money is moved to the pot in the middle
          // and that amount is removed from his player
          --> SOCKET
      // If he folds,
          // he is out of the rotation until the next hand
          --> SOCKET
      // If he checks,
          // Nothing changes
          --> SOCKET

    // The next player does the same

    // This rotation goes around the circle until all players have:
        // if one bets, all must call it or fold
        // if all check, then the round moves on
        // if all fold, the round ends


  // The first three cards are placed in the center (The Flop)
      --> SOCKET
    // Another BETTING ROUND ENSUES


  // The River
    // Another BETTING ROUND ENSUES

  // The Turn
    // Another BETTING ROUND ENSUES

  // The remaining players show their cards
    --> SOCKET
    // The cards are then assigned a value based on the
    // Rules of Texas Holdem

    // The player with the highest card value takes the pot
    --> SOCKET
      // if it is a tie, the pot is split evenly amongst winners

  // REPEAT

// AFTER MVP:
  // * ALL OF THIS WILL BE MUCH EASIER TO IMPLEMENT
  // * AFTER THE BASIC FUNCTIONALITY HAS BEEN ACHEIVED
    // Players Kicked from the game when money is gone
    // All In functionality
    // Antes
    // Rotating starting better
    // etc...



GAME CLASSES IN SERVER



const PLAYER{
socket:
name: String,
hand: {card1: FROMAPI, card2: FROMAPI,}
money: Number,
bettingRoundStatus: 'bet' 'fold' or 'checked'
betAmount: Number,
cardValue: Number,

}

const GAME{
namespace: String,
players: [PLAYER,PLAYER,PLAYER,PLAYER,PLAYER,PLAYER,PLAYER],
pot: Number,
maxBet: Number,
flop: {card1: FROMAPI, card2: FROMAPI, card3: FROMAPI,}
river: {card1: FROMAPI}
turn: {card1: FROMAPI}

}



*/
