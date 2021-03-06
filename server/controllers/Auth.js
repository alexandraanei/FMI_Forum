const express = require("express");
const router = express.Router();
const User = require('../models/User');
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

router.get('/init', async (req, res) => {
    let response = null;
    try {
        const { userId } = jwt.verify(req.query.token, 'app');
        const user = await User.findById(userId).populate('notifications');
        if (user) {
            response = user;
        }
        res.send({user: response});
      } catch(err) {
        console.log(err);
      }

    res.send({ user: response });
});

router.post('/register', async (req, res) => {
    const userEmailExists = await User.findOne({ email: req.body.email });
    const userUsernameExists = await User.findOne({ username: req.body.username });
    if (userEmailExists) {
        res.status(400).send({
            message: 'email_exists'
        });
        return;
    }
    if (userUsernameExists) {
        res.status(400).send({
            message: 'username_exists'
        });
        return;
    }

    const newUser = User({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        username: req.body.username,
        email: req.body.email,
        password: req.body.password,
        createdAt: Date.now(),
        type: "user",
    });

    await newUser.save();
    res.sendStatus(201);
});

router.post('/login', async (req, res) => {
   const user = await User.findOne({ email: req.body.email }).populate('notifications');
   if (!user) {
       res.status(404).send({
           message: 'user_not_found'
       });
       return;
   }

   const isEqual = await bcrypt.compare(req.body.password, user.password);
   if (!isEqual) {
       res.status(401).send({
           message: 'wrong_password'
       });
       return;
   }

   const token = jwt.sign({ userId: user._id, exp: Math.floor(Date.now() / 1000) + (60 * 60 * 2) }, 'app');
   res.send({
       token,
       user
   })
});


module.exports = router;