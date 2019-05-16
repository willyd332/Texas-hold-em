const express = require('express');
const router = express.Router();
const User = require('../models/user');

router.post('/register', async (req, res) => {

  try {

    const user = await User.create(req.body);

    req.session.logged = true;
    req.session.username = req.body.username;

    console.log(req.session)

    res.json({
      status: 200,
      data: 'Register Successful'
    });

  } catch(err){
    console.log(err);
    res.send(err);
  }

});


router.post('/login', async (req, res) => {

  try {

    const user = await User.findOne({
      username: req.body.username
      })

      console.log(user)

      if (user && req.body.password === user.password){

        req.session.logged = true;
        req.session.username = req.body.username;

        console.log(req.session)

        res.json({
          status: 200,
          data: 'Login Successful',
          user: user,
        });

      } else{

        res.json({
          status: 200,
          data: 'Login Unsuccesful',
        });

      }

      } catch(err){
        console.log(err);
        res.send(err);
      }

});


module.exports = router;
