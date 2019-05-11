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


io.on("connection", (socket) => {

  console.log(socket.id + " has connected");
  socket.emit('sendId', socket.id)

  socket.on('message', (message) => {
    io.sockets.emit('newMessage', message);
    });

  socket.on("disconnect", () => console.log(socket.id + " disconnected"));


});

// io.listen(process.env.PORT || 9000, ()=>{
//     console.log("Socket Is On")
// })
