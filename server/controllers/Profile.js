const express = require("express");
const router = express.Router();
const Profile = require('../models/User');
const multer = require('multer');

const DIR = './uploads/';

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, DIR);
  },
  filename: function(req, file, cb) {
    cb(null, Date.now() + file.originalname.toLowerCase().split(' ').join('-'));
  }
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === 'image/jpg') {
    cb(null, true);
  } else {
    cb(null, false);
    return cb(new Error('Only .png, .jpg and .jpeg format allowed!'));
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5
  },
  fileFilter: fileFilter
});

router.get('/:id', async (req, res) => {
   const profile = await Profile.findById(req.params.id);
   if (!profile) {
       res.status(404).send({
           message: 'User not found'
       });
       return;
   }

   res.send(profile);
});

router.put('/:id/edit', upload.single('avatar'), async (req, res) => {
  const url = req.protocol + '://' + req.get('host');
    Profile.findById(req.params.id)
    .then(user => {
        if(req.file) user.avatar = url + '/' + req.file.path;
        user.firstName = req.body.firstName;
        user.lastName = req.body.lastName;
        user.username = req.body.username;
        user.email = req.body.email;
  
        user.save()
          .then(() => res.json('User updated!'))
          .catch(err => res.status(400).json('Error: ' + err));
      })
      .catch(err => res.status(400).json('Error: ' + err));
});

router.delete('/:id', (req, res) => {
  Profile.findByIdAndDelete(req.params.id)
  .then(() => res.json('Profile deleted.'))
  .catch(err => res.status(400).json('Error: ' + err));
});

 router.get('/', async (req, res) => {
  const users = await Profile.find({});
  res.send(users);
});

module.exports = router;