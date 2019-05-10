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
console.log(io)


io.on("connection", (client) => {

  console.log(client.id + " has connected");

  client.on('message', (message) => {
    io.emit('newMessage', message)
    })

  client.on("disconnect", () => console.log(client.id + " disconnected"));


});

// io.listen(process.env.PORT || 9000, ()=>{
//     console.log("Socket Is On")
// })
