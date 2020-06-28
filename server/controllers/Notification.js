const express = require("express");
const router = express.Router();
const Notification = require("../models/Notification");
const Thread = require("../models/Thread");
const User = require("../models/User");
const Forum = require("../models/Forum");

// router.post('/create', async (req, res) => {
//    const { title } = req.body;
//    const newCategory = Category({
//        title,
//        createdAt: Date.now()
//    });

//    await newCategory.save();
//    res.send(newCategory);
// });

router.get("/:id", async (req, res) => {
  const notifications = await Notification.find({
    userId: req.params.id,
  }).populate("userId");
  res.send(notifications);
});

// router.put('/:id/edit', async (req, res) => {
//     Category.findById(req.params.id)
//     .then(category => {
//         category.title = req.body.name;

//         category.save()
//           .then(() => res.json('Category updated!'))
//           .catch(err => res.status(400).json('Error: ' + err));
//       })
//       .catch(err => res.status(400).json('Error: ' + err));
// });

// router.delete('/:id', (req, res) => {
//     Category.findByIdAndDelete(req.params.id)
//     .then(() => res.json('Category deleted.'))
//     .catch(err => res.status(400).json('Error: ' + err));
// });

// router.get('/', async (req, res) => {
//     const cats = await Category.find({});
//     res.send(cats);
// });

module.exports = router;
