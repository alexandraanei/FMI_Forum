const express = require("express");
const router = express.Router();
const Post = require("../models/Post");
const multer = require("multer");

const DIR = "./uploads/comments";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, DIR);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + file.originalname.toLowerCase().split(" ").join("-"));
  },
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/jpeg" ||
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/gif" ||
    file.mimetype === "image/bmp"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
    return cb(new Error("Only .png, .jpg and .jpeg format allowed!"));
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 25,
  },
  fileFilter: fileFilter,
});

router.post("/create", upload.single("photo"), async (req, res) => {
  const { content, userId, threadId } = req.body;
  const url = req.protocol + "://" + req.get("host");
  let newPost = Post({
    photo: req.file ? url + "/" + req.file.path : "",
    content,
    createdAt: Date.now(),
    threadId,
    userId,
  });

  console.log(newPost);

  newPost.save(function (err, post) {
    Post.findOne(post)
      .populate("userId")
      .exec(function (err, post) {
        res.send(post);
      });
  });
});

router.get("/thread/:id", async (req, res) => {
  const page = req.query.page;
  const posts = await Post.find({ threadId: req.params.id })
    .populate("userId");
  res.send(posts);
});

router.delete("/:id", (req, res) => {
  Post.findByIdAndDelete(req.params.id)
    .then(() => res.json("Post deleted."))
    .catch((err) => res.status(400).json("Error: " + err));
});

router.put("/like/:id", async (req, res) => {
  Post.findById(req.params.id)
    .then((post) => {
      post.likedBy.push(req.body.user);
      post
        .save()
        .then(() => res.json("post updated!"))
        .catch((err) => res.status(400).json("Error: " + err.response));
    })
    .catch((err) => res.status(400).json("Error: " + err.response));
});

router.put("/unlike/:id", async (req, res) => {
  Post.findById(req.params.id)
    .then((post) => {
      post.likedBy.pull(req.body.user);
      post
        .save()
        .then(() => res.json("post updated!"))
        .catch((err) => res.status(400).json("Error: " + err.response));
    })
    .catch((err) => res.status(400).json("Error: " + err.response));
});

router.put("/:id/edit", upload.single("photo"), async (req, res) => {
  const url = req.protocol + "://" + req.get("host");
  console.log(req.file)
  Post.findById(req.params.id)
    .then((post) => {
      post.content = req.body.content;
      post.photo = req.file ? url + "/" + req.file.path : "";
      console.log(post.photo);

      post
        .save()
        .then(() => res.json("Post updated!"))
        .catch((err) => res.status(400).json("Error: " + err));
    })
    .catch((err) => res.status(400).json("Error: " + err));
});

module.exports = router;
