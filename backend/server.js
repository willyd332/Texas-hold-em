const express        = require('express');
const app            = express();
const bodyParser     = require('body-parser');
const cors           = require('cors');
const session        = require('express-session')
const socketIo       = require("socket.io");
const authController = require('./controllers/authController');


require('dotenv').config()
require('./db/db');


app.use(session({
  secret: process.env.sessionSecret,
  resave: false,
  saveUninitialized: false
}));


app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use('/auth', authController);

app.get('/', (req,res) => {
  res.send('Hello World')
  })

const corsOptions = {
  origin: process.env.Front_End_URL,
  credentials: true,
  optionsSuccessStatus: 200,
}

app.use(cors(corsOptions))

const server = app.listen(process.env.PORT || 9000, ()=>{
    console.log("SERVER IS RUNNING")
})


// SOCKET.IO STUFF -------


const io = socketIo(server);

let users = []

const findUser = (id) => {
  foundUser = users.filter(user=>user.id == id)
  return foundUser[0]
}

// You must refactor this using namespaces and classes
// IE. on connection you must chec to see if the room is full,
// if so create a new class that the next six socets will join.
// This class will have its own namespace and so will those six sockets
// ** additionally, remember that everything on the react side
// must be fitered based on the socket and its namespace
// (each class will have its own user array and namespace...
// Then you can have it so the users in that class will send data
// betwwen only the other users in that class)

class Game{
  constructor(namespace,firstUser){
    this.namespace = namespace;
    this.users = [firstUser]
  }
  findUser(id){
    foundUser = this.users.filter(user=>user.id == id)
    return foundUser[0]
  }

}


io.on("connection", (socket) => {

  console.log(socket.id + " has connected");
  socket.emit('connected', socket.id)

  socket.on('message', (message) => {
    const user = findUser(socket.id)
    // console.log(users)
    // console.log(user)
    io.sockets.emit('newMessage', {message:message,user:user.name});
    });

  socket.on('userJoined', (username) => {
    users.push({id:socket.id,name:username})
    console.log(socket.id + " is named " + username)
    })

  socket.on("disconnect", () => {
    users = users.filter(user => user.id != socket.id);
    console.log(socket.id + " disconnected")
  });


});
