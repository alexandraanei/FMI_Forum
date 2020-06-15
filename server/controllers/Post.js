const express = require("express");
const router = express.Router();
const Post = require('../models/Post');
const multer = require('multer');

const DIR = './uploads/comments';

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, DIR);
  },
  filename: function(req, file, cb) {
    cb(null, Date.now() + file.originalname.toLowerCase().split(' ').join('-'));
  }
});

const fileFilter = (req, file, cb) => {
  // reject a file
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

router.post('/create', upload.single('photo'), async (req, res) => {
    const { content, userId, threadId } = req.body;
    const url = req.protocol + '://' + req.get('host');
    let newPost = Post({
        photo: req.file ? url + '/' + req.file.path : '',
        content,
        createdAt: Date.now(),
        threadId,
        userId
    });

    newPost.save(function(err, post) {
        Post.findOne(post).populate('userId').exec(function (err, post) {
            res.send(post);
        });
    });
});


router.get('/thread/:id', async (req, res) => {
    const page = req.query.page;
    const perPage = 10;
    const posts = await Post.find({ threadId: req.params.id }).limit(perPage).skip(perPage * (page - 1)).populate('userId');
    res.send(posts);
})

module.exports = router;