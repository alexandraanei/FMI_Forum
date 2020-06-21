const express = require("express");
const router = express.Router();
const User = require('../models/User');
const bcrypt = require("bcryptjs");

router.put('/:id/edit', async (req, res) => {
    User.findById(req.params.id)
    .then(user => {
        user.type = req.body.type;
  
        user.save()
          .then(() => res.json('User updated!'))
          .catch(err => res.status(400).json('Error: ' + err));
      })
      .catch(err => res.status(400).json('Error: ' + err));
});

router.put('/:id/editPassword', async (req, res) => {
    User.findById(req.params.id)
    .then(user => {
        const isEqual = bcrypt.compare(req.body.oldPassword, user.password);
        if (!isEqual) {
            res.status(401).send({
                message: 'wrong_password'
            });
            return;
        }
        user.password = req.body.newPassword;
  
        user.save()
          .then(() => res.json('User updated!'))
          .catch(err => res.status(400).json('Error: ' + err));
      })
      .catch(err => res.status(400).json('Error: ' + err));
});

router.put("/subscribecategory/:id", async (req, res) => {
    User.findById(req.params.id)
      .then((user) => {
        user.subscribedCategories.push(req.body.category);
        user
          .save()
          .then(() => res.json("user updated!"))
          .catch((err) => res.status(400).json("Error: " + err.response));
      })
      .catch((err) => res.status(400).json("Error: " + err.response));
  });
  
  router.put("/unsubscribecategory/:id", async (req, res) => {
    User.findById(req.params.id)
    .then((user) => {
        user.subscribedCategories.pull(req.body.category);
        user
          .save()
          .then(() => res.json("user updated!"))
          .catch((err) => res.status(400).json("Error: " + err.response));
      })
      .catch((err) => res.status(400).json("Error: " + err.response));
  });

module.exports = router;