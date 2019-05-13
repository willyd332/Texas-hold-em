const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const session = require('express-session')
const socketIo = require("socket.io");
const authController = require('./controllers/authController');


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


// SOCKET.IO STUFF -------


const io = socketIo(server);

class Game {
  constructor(room, firstUser) {
    this.room = room;
    this.users = [firstUser]
    this.pot = 0;
    this.maxBet = 0;
    this.flop = {card1: 'ace', card2: 'ace', card3: 'ace',};
    this.river = {card1: 'king'};
    this.turn = {card1: 'king'};
    this.status = false;
  }
}
class User {
  constructor(socket, name) {
    this.socketId = socket.id;
    this.name = name;
    this.hand = {card1: 'Ace', card2: 'Ace',};
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
      console.log(game)
      game.users.push(newUser)
    }
  });
  if (!room) {
    console.log('creating')
    let x = 'x'
    x = x.repeat(currGames.length + 1)
    currGames.push(new Game(x, newUser))
    room = x
  }
  //   if(currGames[0]){
  //   console.log(currGames[0])
  // }
  console.log(currGames)
  return (room)
}

const findGame = (room) => {
  console.log(currGames)
  const foundGame = currGames.filter(game => game.room === room);
  console.log(foundGame)
  return foundGame[0];
}

io.on("connection", (socket) => {

  console.log(socket.id + " has connected");

  socket.emit('connected', socket.id)

  socket.on('message', (messageData) => {
    console.log(messageData)
    io.to(messageData.room).emit('newMessage', {
      message: messageData.message,
      user: messageData.user
    });
  });

  socket.on('userJoined', (username) => {
    const room = joinGame(new User(socket, username));
    socket.join(room)
    console.log(room)
    socket.emit('room', room);
    const game = findGame(room);
    io.to(room).emit('renderGame', game);
    io.to(room).emit('gameStart')
  })

  socket.on('updateGame', (game) => {

    currGames[game.room.length - 1] = game;

    io.to(game.room).emit('renderGame', currGames[game.room.length - 1]);

    })


  socket.on("disconnect", () => {
    console.log(socket.id + " disconnected")

    let thisGame;
    currGames.forEach((game) => {
      game.users.forEach((user, index) => {
        if (user.socketId === socket.id) {
          game.users.splice(index, 1);
          thisGame = game;
        };
      });
    });
    if (thisGame){
    io.to(thisGame.room).emit('renderGame', thisGame);
  }
  });


// -------------------- end of socket.io
});
