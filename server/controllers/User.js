const express = require("express");
const router = express.Router();
const User = require('../models/User');

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

module.exports = router;