const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const session = require('express-session')
const socketIo = require("socket.io");
const authController = require('./controllers/authController');
const axios = require('axios')

require('dotenv').config()
require('./db/db');

const corsOptions = {
  origin: process.env.Front_End_URL,
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
app.use('/auth', authController);

app.get('/', (req, res) => {
  res.send('Hello World')
})



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
    this.flop = [{},{},{}];
    this.river = {};
    this.turn =  {};
    this.round = null;
  }
}
class User {
  constructor(socket, name) {
    this.socketId = socket.id;
    this.name = name;
    this.hand = [{},{}]
    this.money = 10000;
    this.bettingRoundStatus = '';
    this.betAmount = null;
    this.cardValue = null;
    this.status = false;
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
  for(let i = 0; i < currGames.length; i++){
    if (currGames[i].room === room) {
      return i
    }
    }
}

  // USER CONNECTS
io.on("connection", (socket) => {




// RENDER FUNCTION FOR GAME ROOM
  const renderRoom = (room,action) => {
    const game = currGames[findGame(room)];
    io.to(room).emit('renderGame', {game:game,action:action,});
  }


// DRAWS CARDS FOR FLOP AND RESTARTS BETTING ROUND
  const flop = (updatedGame) => {

    console.log(updatedGame)

    const gameIndex = findGame(updatedGame.room);

    axios.get(`https://deckofcardsapi.com/api/deck/${updatedGame.deckId}/draw/?count=3`)
    .then(function(res){
      console.log(res.data.cards)
      updatedGame.flop = res.data.cards
      updatedGame.round = 'bet';
      updatedGame.maxBet = 0;
      currGames[gameIndex] = updatedGame;
      renderRoom(updatedGame.room, 'bet')
      })
      .catch(function (error) {
        console.log(error);
        });
  }

  const river = (updatedGame) => {

  }

  const turn = (updatedGame) => {

  }


// USER ENTERS THEIR USERNAME
  socket.on('userJoined', (username) => {
    const room = joinGame(new User(socket, username));
    socket.join(room)
    socket.emit('room', {room: room, username: username,});
  });




// USER ENTERS A GAME
  socket.on('joinGame', (room)=>{
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
    console.log(updatedGame.deckId)
    currGames[gameIndex] = updatedGame;
    renderRoom(room);
    }

    axios.get("https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1")
    .then((res) => startGame(res))
    .catch(function(error){
      console.log(error);
      });

    })

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
        axios.get(`https://deckofcardsapi.com/api/deck/${updatedGame.deckId}/draw/?count=2`)
        .then(function(res){
          console.log(res.data.cards)
          updatedGame.users[data.index].hand = res.data.cards
          currGames[gameIndex] = updatedGame;
          console.log(updatedGame.users[data.index].hand)
          renderRoom(data.room, 'ante')
          })
          .catch(function (error) {
            console.log(error);
            });
      } else {
        updatedGame.turnNumber = 0;
        updatedGame.round = 'bet';
        axios.get(`https://deckofcardsapi.com/api/deck/${updatedGame.deckId}/draw/?count=2`)
        .then(function(res){
          updatedGame.users[data.index].hand = res.data.cards
          currGames[gameIndex] = updatedGame;
          console.log(updatedGame.users[data.index].hand)
          renderRoom(data.room, 'bet')
          })
        .catch(function (error) {
          console.log(error);
          });
      }
    });



// PLAYER SUBMITS BET
  socket.on('bet', (data) => {
    const gameIndex = findGame(data.room);
    const updatedGame = currGames[gameIndex];

    const betAmount = parseInt(data.bet);

    updatedGame.users[data.index].money -= betAmount;
    updatedGame.pot += betAmount;
    if (betAmount > updatedGame.maxBet){
      updatedGame.maxBet = betAmount;
    }

    // if the next player exists
    if (updatedGame.turnNumber < updatedGame.users.length - 1) {

      console.log("normal turn increase")
      updatedGame.turnNumber += 1;

      // if the next (now current) players status is false
      if (!updatedGame.users[updatedGame.turnNumber].status) {
        // if the player after the false player exists
        if (updatedGame.turnNumber < updatedGame.users.length - 1) {

          console.log("Skip Player turn increase")
          updatedGame.turnNumber += 1;

          // the player after the false player does not exist
        } else {
          console.log("last player was false, changing round")
          updatedGame.turnNumber = 0;

          if(!updatedGame.flop[0].value){
            flop(updatedGame);
          } else if (!updatedGame.river.value){
            river(updatedGame);
          } else if (!updatedGame.turn.value){
            turn(updatedGame);
          } else {
            console.log("SHOW YOUR CARDS.......TODO")
          };

        };
      };
      // Turn has been correctly updated
      console.log("updating turnNumber to " + updatedGame.turnNumber)
      currGames[gameIndex] = updatedGame;
      renderRoom(data.room, 'bet');
  } else {
    console.log("Round Has Ended")
    updatedGame.turnNumber = 0;
    console.log(updatedGame)

    if(!updatedGame.flop[0].value){
      flop(updatedGame);
    } else if (!updatedGame.river.value){
      river(updatedGame);
    } else if (!updatedGame.turn.value){
      turn(updatedGame);
    } else {
      console.log("SHOW YOUR CARDS.......TODO")
    };
  };
  });

// HANDLES WHEN A USER FOLDS

// PLAYER SUBMITS BET
  socket.on('fold', (data) => {

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
          updatedGame.turnNumber = 0;
          console.log(updatedGame)

          if(!updatedGame.flop[0].value){
            flop(updatedGame);
          } else if (!updatedGame.river.value){
            river(updatedGame);
          } else if (!updatedGame.turn.value){
            turn(updatedGame);
          } else {
            console.log("SHOW YOUR CARDS.......TODO")
          };

        };
      };
      // Turn has been correctly updated
      console.log("updating turnNumber to " + updatedGame.turnNumber)
      currGames[gameIndex] = updatedGame;
      renderRoom(data.room, 'bet');
  } else {
    console.log("Round Has Ended")
    updatedGame.turnNumber = 0;
    console.log(updatedGame);

    if(!updatedGame.flop[0].value){
      flop(updatedGame);
    } else if (!updatedGame.river.value){
      river(updatedGame);
    } else if (!updatedGame.turn.value){
      turn(updatedGame);
    } else {
      console.log("SHOW YOUR CARDS.......TODO")
    };

  };
  });



// USER DISCONNECTS
  socket.on("disconnect", () => {
    for(let i = 0; i < currGames.length; i++){
      if(currGames[i]){
      for(let x = 0; x < currGames[i].users.length; x++){
        if(currGames[i].users[x]){
          if(currGames[i].users[x].socketId === socket.id){
            currGames[i].users.splice(x,1);
            renderRoom(currGames[i].room)
            if(currGames[i].users.length === 0){
              currGames.splice(i,1); break;
            };
          };
        };
      };
    };
    };
  });


// -------------------- end of socket.io
});
