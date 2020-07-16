const express = require("express");
const router = express.Router();
const Notification = require("../models/Notification");
const Thread = require("../models/Thread");
const User = require("../models/User");
const Forum = require("../models/Forum");

// create notification
router.post("/create", async (req, res) => {
  const { content, threadId, forumId, categoryId } = req.body;

  let newNotification = Notification({
    content,
    createdAt: Date.now(),
    threadId,
    forumId,
    categoryId,
    read: false,
  });

  await newNotification.save();
  res.send(newNotification);
});

router.put("/addtouser/:id", async (req, res) => {
  User.findById(req.params.id)
    .then((user) => {
      user.notifications.push(req.body.notificationId);
      user
        .save()
        .then(() => res.json("user updated!"))
        .catch((err) => res.status(400).json("Error: " + err.response));
    })
    .catch((err) => res.status(400).json("Error: " + err.response));
});

router.put("/read/:id", async (req, res) => {
  Notification.findById(req.params.id)
    .then((notification) => {
      notification.read = true;
      notification
        .save()
        .then(() => res.json("notification updated!"))
        .catch((err) => res.status(400).json("Error: " + err.response));
    })
    .catch((err) => res.status(400).json("Error: " + err.response));
});

router.get("/:id", async (req, res) => {
  const notification = await Notification.findById(req.params.id);
  res.send(notification);
});

router.delete("/:id", (req, res) => {
  Notification.findByIdAndDelete(req.params.id)
    .then(() => res.json("Notification deleted."))
    .catch((err) => res.status(400).json("Error: " + err));
});

module.exports = router;
