const express        = require('express');
const app            = express();
const bodyParser     = require('body-parser');
const cors           = require('cors');
const session        = require('express-session')
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


const corsOptions = {
  origin: process.env.Front_End_URL,
  credentials: true,
  optionsSuccessStatus: 200,
}

app.use(cors(corsOptions))

app.listen(process.env.PORT || 9000, ()=>{
    console.log("SERVER IS RUNNING")
})
