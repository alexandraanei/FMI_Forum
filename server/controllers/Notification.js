const express = require("express");
const router = express.Router();
const Notification = require("../models/Notification");
const Thread = require("../models/Thread");
const User = require("../models/User");
const Forum = require("../models/Forum");

// create notification for one user
router.post("/create/:id", async (req, res) => {
  const { content, threadId, forumId, categoryId } = req.body;

  let newNotification = Notification({
    content,
    createdAt: Date.now(),
    threadId,
    forumId,
    categoryId,
    read: false,
  });

  // User.find({
  //   type: "user",
  //   threads: { $exists: true, $not: { $size: 0 } },
  //   forums: { $exists: true, $not: { $size: 0 } },
  //   categories: { $exists: true, $not: { $size: 0 } },['threads', 'forums', 'categories', 'notifications'], function(err, docs) {}
  // });

  //  newNotification.save(function (err, notification) {
  //   User.findById(req.params.id)
  //     .update({ $push: { notifications: newNotification } }, done)

  //     .exec(function (err, notification) {
  //       res.send(notification);
  //     });
  // });

  await newNotification.save();
  res.send(newNotification);
});

router.get("/:id", async (req, res) => {
  const notifications = await Notification.find({
    userId: req.params.id,
  }).populate("userId");
  res.send(notifications);
});

router.delete("/:id", (req, res) => {
  Notification.findByIdAndDelete(req.params.id)
    .then(() => res.json("Notification deleted."))
    .catch((err) => res.status(400).json("Error: " + err));
});

module.exports = router;
