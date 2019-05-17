const express = require('express');
const router = express.Router();
const User = require('../models/user');

// Encryption
const bcrypt = require('bcryptjs');
const saltiness = 10;


router.post('/register', async (req, res) => {

  try {
    console.log("START OF REGISTER");
    console.log(req.body);
    const existingUser = await User.findOne({
      username: req.body.username
    });

    console.log(req.body)

    if (!existingUser) {


      const encryptedPassword = await bcrypt.hashSync(req.body.password, saltiness);

      console.log(encryptedPassword)

      const user = await User.create({
        username: req.body.username,
        password: encryptedPassword,
      });

      console.log(user)

      req.session.logged = true;
      req.session.username = req.body.username;

      console.log(req.session)

      res.json({
        status: 200,
        data: 'Register Successful'
      });

    } else {

      res.json({
        status: 200,
        data: 'User Already Exists'
      });

    }

  } catch (err) {
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

    const passwordTest = await bcrypt.compareSync(req.body.password, user.password)

    if (passwordTest) {

      req.session.logged = true;
      req.session.username = req.body.username;

      console.log(req.session)

      res.json({
        status: 200,
        data: 'Login Successful',
        user: user,
      });

    } else {

      res.json({
        status: 200,
        data: 'Login Unsuccesful',
      });

    }

  } catch (err) {
    console.log(err);
    res.send(err);
  }

});

router.get('/session', async (req, res) => {

  try {

    console.log(req.session)

    if (req.session.logged) {
      res.json({
        status: 200,
        data: true,
        name: req.session.username,
      });
    } else {
      res.json({
        status: 200,
        data: false,
        name: "",
      });
    }


  } catch (err) {
    console.log(err);
    res.send(err);
  }
});


module.exports = router;
