const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const session = require('express-session')
const socketIo = require("socket.io");
const authController = require('./controllers/authController');
const axios = require('axios')
const dotenv = require('dotenv')
dotenv.config();
const Hand = require('pokersolver').Hand;

require('dotenv').config()
require('./db/db');

const corsOptions = {
  origin: process.env.REACT_ADDRESS,
  credentials: true,
  optionsSuccessStatus: 200,
}

app.use(cors(corsOptions))

app.use(session({
  secret: process.env.sessionSecret,
  resave: false,
  saveUninitialized: false
}));


app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(bodyParser.json());
app.use('/api/v1/auth', authController);



const server = app.listen(process.env.PORT || 9000, () => {
  console.log("SERVER IS RUNNING")
})


// SOCKET.IO STUFF -----------------------------------------


const io = socketIo(server);


class Game {
  constructor(room, firstUser) {
    this.deckId = '';
    this.room = room;
    this.users = [firstUser];
    this.turnNumber = 0;
    this.pot = 0;
    this.maxBet = 0;
    this.flop = [{}, {}, {}];
    this.river = {};
    this.turn = {};
    this.round = null;
    this.winners = [];
    this.setup = [0, 1, 2, 3, 4, 5, 6, 7]
  }
}
class User {
  constructor(socket, name) {
    this.socketId = socket.id;
    this.name = name;
    this.hand = [{}, {}]
    this.money = 10000;
    this.bettingRoundStatus = '';
    this.betAmount = null;
    this.cardValue = null;
    this.status = false;
    this.called = false;
  }
}


const currGames = []

const joinGame = (newUser) => {
  let room = false;
  currGames.forEach((game) => {
    if (game.users.length < 8 && !room) {
      console.log('joining')
      room = game.room;
      game.users.push(newUser)
    };
  });
  if (!room) {
    console.log('creating');
    let x = 'x';
    if (currGames[0]) {
      x += currGames[currGames.length - 1].room;
    };
    currGames.push(new Game(x, newUser));
    room = x;
  };
  return (room)
}

const findGame = (room) => {
  for (let i = 0; i < currGames.length; i++) {
    if (currGames[i].room === room) {
      return i
    };
  };
};


const findCardValue = (user, game) => {


  if (user.status && game.turn.code) {

    const hand = [user.hand[0].code, user.hand[1].code, game.flop[0].code, game.flop[1].code, game.flop[2].code, game.river.code, game.turn.code];

    for (let i = 0; i < hand.length; i++) {
      if (hand[i][0] === '0') {
        let newString = 'T';
        newString += hand[i][1];
        hand[i] = newString;
      }
    }

    const solvedHand = Hand.solve(hand);


    solvedHand.userId = user.socketId;


    return solvedHand;

  }

};


rotateSetup = (setup, usersLength) => {

  let rotated = [];
  for (let i = 0; i < usersLength; i++) {
    rotated.push(setup.shift())
  }
  rotated.unshift(rotated.pop());

  newArr = rotated.concat(setup);


  return newArr;

};

rotateUsers = (users) => {

  users.push(users.shift());


  return users;

};


// USER CONNECTS
io.on("connection", (socket) => {



  // RENDER FUNCTION FOR GAME ROOM
  const renderRoom = (room, action) => {
    const game = currGames[findGame(room)];
    io.to(room).emit('renderGame', {
      game: game,
      action: action,
    });
  }


  // CHANGE TH ROUND TO THE NEXT ONE
  const updateRound = (round, updatedGame) => {

    const gameIndex = findGame(updatedGame.room);

    let drawCount = 1;
    if (round === "flop") {
      drawCount = 3;
    };

    axios.get(`https://deckofcardsapi.com/api/deck/${updatedGame.deckId}/draw/?count=${drawCount}`)
      .then(function(res) {

        if (round === 'flop') {
          updatedGame.flop = res.data.cards
        } else if (round === 'river') {
          updatedGame.river = res.data.cards[0];
        } else {
          updatedGame.turn = res.data.cards[0];
        }

        updatedGame.round = 'bet';
        updatedGame.maxBet = 0;
        currGames[gameIndex] = updatedGame;
        renderRoom(updatedGame.room, 'bet')
      })
      .catch(function(error) {
        console.log(error);
      });

  }


  // START A NEW ROUND
  const restartGame = (updatedGame) => {

    console.log("restarting game")

    const gameIndex = findGame(updatedGame.room);


    updatedGame.round = 'ante';
    updatedGame.flop = [{}, {}, {}];
    updatedGame.river = {};
    updatedGame.turn = {};
    updatedGame.maxBet = 0;
    updatedGame.turnNumber = 0;
    updatedGame.winners = [];
    updatedGame.users = updatedGame.users.map((user) => {
      user.hand = [{}, {}];
      user.status = false;
      user.betAmount = 0;
      return user;
    });

    console.log("ROTATING USERS")

    updatedGame.setup = rotateSetup(updatedGame.setup, updatedGame.users.length);
    updatedGame.users = rotateUsers(updatedGame.users);

    currGames[gameIndex] = updatedGame;

    axios.get(`https://deckofcardsapi.com/api/deck/${updatedGame.deckId}/shuffle/`)
      .then(renderRoom(updatedGame.room, 'show'))
      .catch(function(error) {
        console.log(error);
      });

  }


  // SHOW THE CARDS AND CALCULATE WINNER
  const show = (updatedGame) => {

    const gameIndex = findGame(updatedGame.room);

    let solvedHands = [];

    updatedGame.users.forEach((user) => {
      if (user.hand[0].value && user.status === true) {
        const valuedHand = findCardValue(user, updatedGame)
        solvedHands.push(valuedHand)
      }

    });

    let winners = [];
    let winnerIndex = [];


    solvedHands = solvedHands.filter((hand) => {
      return hand
    });

    console.log("***********************SolvedHands****************")

    if (solvedHands.length > 0) {

      winners = Hand.winners(solvedHands);

    }


    if (winners.length === 0) {
      winners = updatedGame.users.filter((user) => {
        return user.status
      });
    }

    console.log("WINNERS ===========================")

    winners.forEach((winner) => {
      updatedGame.users.forEach((user, index) => {
        if (winner.socketId === user.socketId) {
          winnerIndex.push(index);
        };
      });
    });


    winnerIndex.forEach((winnerNum) => {

      updatedGame.users[winnerNum].money += (Math.round(updatedGame.pot / winners.length));


    });


    if (!updatedGame.turn.code) {
      updatedGame.users.forEach((user) => {
        if (user.status) {
          user += updatedGame.pot;
        };
      });
    }

    updatedGame.pot = 0;
    updatedGame.winners = winnerIndex;
    updatedGame.round = 'finished'
    currGames[gameIndex] = updatedGame;
    renderRoom(updatedGame.room, 'finish')


    setTimeout(function() {
      restartGame(updatedGame)
    }, 6000);

  };


  // THE BETTING ROUND HAS ENDED (EITHER SWITCH ROUND OR RESTART BETTING)
  const changeRound = (updatedGame) => {

    const gameIndex = findGame(updatedGame.room);

    const activePlayers = updatedGame.users.filter((user) => {
      return user.status
    });

    if (activePlayers.length <= 1) {

      show(updatedGame);

    } else {

      const allCalled = updatedGame.users.filter((user) => {
        if (user.status) {
          return user.called === false;
        };
      });


      if (allCalled.length == 0) {

        updatedGame.users = updatedGame.users.map((user) => {
          user.called = false;
          user.betAmount = 0;
          return user;
        });

        if (!updatedGame.flop[0].value) {
          updateRound('flop', updatedGame);
        } else if (!updatedGame.river.value) {
          updateRound('river', updatedGame);
        } else if (!updatedGame.turn.value) {
          updateRound('turn', updatedGame);
        } else {
          show(updatedGame);
        };


      } else {
        let firstTurnFinder = 'none';
        updatedGame.users.forEach((user, index) => {
          if (firstTurnFinder === 'none' && user.status) {
            firstTurnFinder = index;
          }
        });
        updatedGame.turnNumber = firstTurnFinder;

        currGames[gameIndex] = updatedGame;
        renderRoom(updatedGame.room, 'bet');
      };
    }
  }




  // USER ENTERS THEIR USERNAME
  socket.on('userJoined', (username) => {
    const room = joinGame(new User(socket, username));
    socket.join(room)
    socket.emit('room', {
      room: room,
      username: username,
    });
  });




  // USER ENTERS A GAME
  socket.on('joinGame', (room) => {
    renderRoom(room);
  })



  // USER SENDS A MESSAGE IN CHAT
  socket.on('message', (messageData) => {
    io.to(messageData.room).emit('newMessage', {
      message: messageData.message,
      user: messageData.user
    });
  });



  // GAME STARTS WHEN TWO USERS JOIN
  socket.on('startGame', (room) => {

    const startGame = (deck) => {
      const gameIndex = findGame(room);
      const updatedGame = currGames[gameIndex];
      updatedGame.round = 'ante';
      updatedGame.deckId = deck.data.deck_id;
      currGames[gameIndex] = updatedGame;
      renderRoom(room);
    }

    axios.get("https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1")
      .then((res) => startGame(res))
      .catch(function(error) {
        console.log(error);
      });

  })



  // DRY MARKER vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv DRY

  // PLAYER SUBMITS ANTE DECISION
  socket.on('ante', (data) => {
    const gameIndex = findGame(data.room);
    const updatedGame = currGames[gameIndex];
    if (data.ante) {
      updatedGame.users[data.index].status = true;
      updatedGame.users[data.index].money -= 100;
      updatedGame.pot += 100;
    }
    if (updatedGame.turnNumber < updatedGame.users.length - 1) {
      updatedGame.turnNumber += 1;
      if (data.ante) {
        axios.get(`https://deckofcardsapi.com/api/deck/${updatedGame.deckId}/draw/?count=2`)
          .then(function(res) {
            updatedGame.users[data.index].hand = res.data.cards
            currGames[gameIndex] = updatedGame;
            renderRoom(data.room, 'ante')
          })
          .catch(function(error) {
            console.log(error);
          });
      } else {
        currGames[gameIndex] = updatedGame;
        renderRoom(data.room, 'ante')
      }
    } else {
      let firstTurnFinder = 'none';
      updatedGame.users.forEach((user, index) => {
        if (firstTurnFinder === 'none' && user.status) {
          firstTurnFinder = index;
        }
      });
      updatedGame.turnNumber = firstTurnFinder;
      console.log("last ante had been anted ---------------")
      updatedGame.round = 'bet';
      if (data.ante) {
        axios.get(`https://deckofcardsapi.com/api/deck/${updatedGame.deckId}/draw/?count=2`)
          .then(function(res) {
            updatedGame.users[data.index].hand = res.data.cards
            currGames[gameIndex] = updatedGame;
            renderRoom(data.room, 'bet')
          })
          .catch(function(error) {
            console.log(error);
          });
      } else if (updatedGame.turnNumber === 'none') {

        show(updatedGame);
      } else {
        currGames[gameIndex] = updatedGame;
        renderRoom(data.room, 'bet')
      }
    }
  });



  // PLAYER SUBMITS BET
  socket.on('bet', (data) => {
    const gameIndex = findGame(data.room);
    const updatedGame = currGames[gameIndex];

    const betAmount = parseInt(data.bet);

    updatedGame.users[data.index].money -= betAmount;
    updatedGame.users[data.index].betAmount = betAmount;

    updatedGame.pot += betAmount;
    if (betAmount > updatedGame.maxBet) {
      updatedGame.maxBet = betAmount;
    }


    if (data.type === 'call') {
      updatedGame.users[data.index].called = true;
    }
    if (data.type === 'raise') {
      updatedGame.users = updatedGame.users.map((user) => {
        user.called = false;
        return user;
      });
      updatedGame.users[data.index].called = true;
    }

    // if the next player exists
    if (updatedGame.turnNumber < updatedGame.users.length - 1) {


      updatedGame.turnNumber += 1;

      console.log("normal turn increase " + updatedGame.turnNumber)

      // if the next (now current) players status is false
      if (!updatedGame.users[updatedGame.turnNumber].status) {
        // if the player after the false player exists
        if (updatedGame.turnNumber < updatedGame.users.length - 1) {

          console.log("Skip Player turn increase")
          updatedGame.turnNumber += 1;

          // the player after the false player does not exist
        } else {
          console.log("last player was false, changing round")

          let firstTurnFinder = 'none';
          updatedGame.users.forEach((user, index) => {
            if (firstTurnFinder === 'none' && user.status) {
              firstTurnFinder = index;
            }
          });
          updatedGame.turnNumber = firstTurnFinder;


          changeRound(updatedGame);

        }
      }

      let going = true;
      while (updatedGame.users[updatedGame.turnNumber].called || !updatedGame.users[updatedGame.turnNumber].status && going) { // Just added or check
        console.log("while loop turn number increase --- line 528")
        updatedGame.turnNumber += 1;

        if (updatedGame.turnNumber === updatedGame.users.length) {
          console.log("Round Has Ended ---While---")
          going = false
          let firstTurnFinder = 'none';
          updatedGame.users.forEach((user, index) => {
            if (firstTurnFinder === 'none' && user.status) {
              firstTurnFinder = index;
            }
          });
          updatedGame.turnNumber = firstTurnFinder;
          changeRound(updatedGame);
        }

      }
      // Turn has been correctly updated
      console.log("updating turnNumber to " + updatedGame.turnNumber)
      currGames[gameIndex] = updatedGame;
      renderRoom(data.room, 'bet');
    } else {
      console.log("Round Has Ended ---ELSE---")
      let firstTurnFinder = 'none';
      updatedGame.users.forEach((user, index) => {
        if (firstTurnFinder === 'none' && user.status) {
          firstTurnFinder = index;
        }
      });
      updatedGame.turnNumber = firstTurnFinder;

      changeRound(updatedGame);

    };
  });

  // HANDLES WHEN A USER FOLDS

  // PLAYER SUBMITS BET
  socket.on('fold', (data) => {

    console.log("FOLDING ---------------------------")

    const gameIndex = findGame(data.room);
    const updatedGame = currGames[gameIndex];
    updatedGame.users[data.index].status = false;
    // if the next player exists
    if (updatedGame.turnNumber < updatedGame.users.length - 1) {

      console.log("normal turn increase")
      updatedGame.turnNumber += 1;

      // if the next (now current) player's status is false
      if (!updatedGame.users[updatedGame.turnNumber].status) {
        // if the player after the false player exists
        if (updatedGame.turnNumber < updatedGame.users.length - 1) {

          console.log("Skip Player turn increase")
          updatedGame.turnNumber += 1;

          // the player after the false player does not exist
        } else {
          console.log("last player was false, changing round")
          let firstTurnFinder = 'none';
          updatedGame.users.forEach((user, index) => {
            if (firstTurnFinder === 'none' && user.status) {
              firstTurnFinder = index;
            }
          });
          updatedGame.turnNumber = firstTurnFinder;

          changeRound(updatedGame);

        };
      };
      // Turn has been correctly updated
      console.log("updating turnNumber to " + updatedGame.turnNumber)
      currGames[gameIndex] = updatedGame;

      if (updatedGame.users.filter((user) => {
          return user.status
        }).length === 1) {
        show(updatedGame)
      } else {
        renderRoom(data.room, 'bet');
      }

    } else {
      console.log("Round Has Ended")
      let firstTurnFinder = 'none';
      updatedGame.users.forEach((user, index) => {
        if (firstTurnFinder === 'none' && user.status) {
          firstTurnFinder = index;
        }
      });
      updatedGame.turnNumber = firstTurnFinder;;

      changeRound(updatedGame);

    };
  });

  // DRY MARKER ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ DRY





  // USER DISCONNECTS
  socket.on("disconnect", () => {
    for (let i = 0; i < currGames.length; i++) {
      if (currGames[i]) {
        for (let x = 0; x < currGames[i].users.length; x++) {
          if (currGames[i].users[x]) {
            if (currGames[i].users[x].socketId === socket.id) {
              currGames[i].users.splice(x, 1);
              currGames[i].turnNumber -= 1;
              renderRoom(currGames[i].room)
              if (currGames[i].users.length === 0) {
                currGames.splice(i, 1);
                break;
              };
            };
          };
        };
      };
    };
  });


  // -------------------- end of socket.io
});
