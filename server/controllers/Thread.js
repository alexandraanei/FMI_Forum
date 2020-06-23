const express = require("express");
const router = express.Router();
const Thread = require("../models/Thread");
const multer = require("multer");

const DIR = "./uploads/post";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, DIR);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + file.originalname.toLowerCase().split(" ").join("-"));
  },
});

const fileFilter = (req, file, cb) => {
  // reject a file
  if (
    file.mimetype === "image/jpeg" ||
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg"
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
  // fileFilter: fileFilter,
});

router.post("/create", upload.array('photos', 10), async (req, res) => {
  const { title, content, userId, forumId } = req.body;
  const url = req.protocol + "://" + req.get("host");
  let newThread = Thread({
    title,
    photos: photos.push(req.file ? url + "/" + req.file.path : ""),
    content,
    createdAt: Date.now(),
    forumId,
    userId,
    approved: false,
  });

  // await newThread.save();
  newThread.save(function (err, thread) {
    Thread.findOne(thread)
      .populate("userId")
      .exec(function (err, thread) {
        res.send(thread);
      });
  });
  // res.send(newThread);
});

router.get("/unapproved", async (req, res) => {
  const threads = await Thread.find({ approved: false }).populate("userId").populate("forumId").populate({ path: 'forumId', populate: 'categoryId' });
  res.send(threads);
});

router.get("/:id", async (req, res) => {
  const thread = await Thread.findById(req.params.id).populate("userId");
  if (!thread) {
    res.status(404).send({
      message: "Thread not found",
    });
    return;
  }

  res.send(thread);
});

router.get("/forum/:id", async (req, res) => {
  const threads = await Thread.find({ forumId: req.params.id, approved: true }).populate("userId");
  res.send(threads);
});

router.put("/:id/edit", async (req, res) => {
  Thread.findById(req.params.id)
    .then((thread) => {
      thread.title = req.body.title;

      thread
        .save()
        .then(() => res.json("Thread updated!"))
        .catch((err) => res.status(400).json("Error: " + err));
    })
    .catch((err) => res.status(400).json("Error: " + err));
});

router.put("/approve/:id", async (req, res) => {
  Thread.findById(req.params.id)
    .then((thread) => {
      thread.approved = true;

      thread
        .save()
        .then(() => res.json("Thread approved!"))
        .catch((err) => res.status(400).json("Error: " + err));
    })
    .catch((err) => res.status(400).json("Error: " + err));
});

router.delete("/:id", (req, res) => {
  Thread.findByIdAndDelete(req.params.id)
    .then(() => res.json("Thread deleted."))
    .catch((err) => res.status(400).json("Error: " + err));
});

router.put("/like/:id", async (req, res) => {
  Thread.findById(req.params.id)
    .then((thread) => {
      thread.likedBy.push(req.body.user);
      thread
        .save()
        .then(() => res.json("thread updated!"))
        .catch((err) => res.status(400).json("Error: " + err.response));
    })
    .catch((err) => res.status(400).json("Error: " + err.response));
});

router.put("/unlike/:id", async (req, res) => {
  Thread.findById(req.params.id)
    .then((thread) => {
      thread.likedBy.pull(req.body.user);
      thread
        .save()
        .then(() => res.json("thread updated!"))
        .catch((err) => res.status(400).json("Error: " + err.response));
    })
    .catch((err) => res.status(400).json("Error: " + err.response));
});

module.exports = router;
