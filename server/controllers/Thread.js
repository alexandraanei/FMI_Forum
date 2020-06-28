const express = require("express");
const router = express.Router();
const Thread = require("../models/Thread");
const User = require("../models/User");
const Forum = require("../models/Forum");
const multer = require("multer");

const DIR = "./uploads/threads";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, DIR);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + file.originalname.toLowerCase().split(" ").join("-"));
  },
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 25,
  },
});

router.post("/create", upload.array("files", 10), async (req, res) => {
  const { title, content, userId, forumId, deadline, private } = req.body;
  const url = req.protocol + "://" + req.get("host");
  var filesArray = [];
  var photosArray = [];
  if (req.files) {
    for (let i = 0; i < req.files.length; i++) {
      if (
        req.files[i].originalname.slice(-3) === "png" ||
        req.files[i].originalname.slice(-3) === "jpg" ||
        req.files[i].originalname.slice(-4) === "jpeg" ||
        req.files[i].originalname.slice(-3) === "gif" ||
        req.files[i].originalname.slice(-3) === "bmp"
      ) {
        photosArray.push(req.files[i] ? url + "/" + req.files[i].path : "");
      } else {
        filesArray.push(req.files[i] ? url + "/" + req.files[i].path : "");
      }
    }
  }

  let newThread = Thread({
    title,
    files: filesArray,
    photos: photosArray,
    content,
    createdAt: Date.now(),
    forumId,
    userId,
    approved: false,
    deadline,
    private,
  });

  newThread.save(function (err, thread) {
    Thread.findOne(thread)
      .populate("userId")
      .exec(function (err, thread) {
        res.send(thread);
      });
  });
});

router.get("/unapproved", async (req, res) => {
  const threads = await Thread.find({ approved: false })
    .populate("userId")
    .populate("forumId")
    .populate({ path: "forumId", populate: "categoryId" });
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
  const threads = await Thread.find({
    forumId: req.params.id,
    approved: true,
  }).populate("userId");
  res.send(threads);
});

router.get("/deadlines/:id", async (req, res) => {
  var threads = await Thread.find({
    deadline: { $exists: true },
    $expr: { $eq: [{ $strLenCP: "$deadline" }, 10] },
  });

  const user = await User.findById(req.params.id);
  threads = threads.filter((thread) =>
    user.subscribedThreads.includes(thread._id)
  );

  res.send(threads);
});

router.put("/:id/edit", async (req, res) => {
  Forum.findById(req.params.forumId).then((forum) => {
    forum.lastUpdated = Date.now();
    forum
      .save()
      .then(() => res.json("Forum updated!"))
      .catch((err) => res.status(400).json("Error: " + err));
  });

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
  let threadId, userId;

  Forum.findById(req.params.forumId).then((forum) => {
    forum.lastUpdated = Date.now();
    forum
      .save()
      .then(() => res.json("Forum updated!"))
      .catch((err) => res.status(400).json("Error: " + err));
  });

  Thread.findById(req.params.id)
    .then((thread) => {
      thread.approved = true;
      threadId = thread._id;
      console.log(thread);
      userId = thread.userId;
      thread
        .save()
        .then(() => res.json("Thread approved!"))
        .catch((err) => res.status(400).json("Error: " + err));
    })
    .catch((err) => res.status(400).json("Error: " + err));

  console.log("th us", threadId, userId);
  let newNotification = Notification({
    content: "Postarea ta a fost aprobata.",
    createdAt: Date.now(),
    threadId,
    read: false,
  });

  console.log(newNotification);

  newNotification.save(function (err, notification) {
    User.findById(userId)
      .update({ $push: { notification: newNotification } }, done)

      .exec(function (err, notification) {
        res.send(notification);
      });
  });
});

router.put("/editcontent/:id", upload.array("files", 10), async (req, res) => {
  const { content, deadline, private, unchangedFiles } = req.body;
  const url = req.protocol + "://" + req.get("host");
  var filesArray = [];
  var photosArray = [];
  console.log(req.files);
  if (req.files) {
    for (let i = 0; i < req.files.length; i++) {
      if (
        req.files[i].originalname.slice(-3) === "png" ||
        req.files[i].originalname.slice(-3) === "jpg" ||
        req.files[i].originalname.slice(-4) === "jpeg" ||
        req.files[i].originalname.slice(-3) === "gif" ||
        req.files[i].originalname.slice(-3) === "bmp"
      ) {
        photosArray.push(req.files[i] ? url + "/" + req.files[i].path : "");
      } else {
        filesArray.push(req.files[i] ? url + "/" + req.files[i].path : "");
      }
    }
  }

  Forum.findById(req.params.forumId).then((forum) => {
    forum.lastUpdated = Date.now();
    forum
      .save()
      .then(() => res.json("Forum updated!"))
      .catch((err) => res.status(400).json("Error: " + err));
  });

  Thread.findById(req.params.id)
    .then((thread) => {
      thread.content = content;
      if (deadline !== thread.deadline)
        thread.hasDeadline = !thread.hasDeadline;
      thread.deadline = deadline;
      thread.content = content;
      thread.private = private;
      if (!unchangedFiles) {
        thread.photos = photosArray;
        thread.files = filesArray;
      }
      thread.approved = false;

      thread
        .save()
        .then(() => res.json("Thread updated!"))
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
