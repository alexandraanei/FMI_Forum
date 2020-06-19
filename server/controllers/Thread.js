const express = require("express");
const router = express.Router();
const Thread = require('../models/Thread');

router.post('/create', async (req, res) => {
   const { title, content, userId, forumId } = req.body;
   const newThread = Thread({
       title,
       content,
       createdAt: Date.now(),
       forumId,
       userId
   });

   await newThread.save();
   res.send(newThread);
});

router.get('/:id', async (req, res) => {
   const thread = await Thread.findById(req.params.id);
   if (!thread) {
       res.status(404).send({
           message: 'Thread not found'
       });
       return;
   }

   res.send(thread);
});

router.get('/forum/:id', async (req, res) => {
    const threads = await Thread.find({ forumId: req.params.id });
    res.send(threads);
});

router.put('/:id/edit', async (req, res) => {
    Thread.findById(req.params.id)
    .then(thread => {
        thread.title = req.body.title;
  
        thread.save()
          .then(() => res.json('Thread updated!'))
          .catch(err => res.status(400).json('Error: ' + err));
      })
      .catch(err => res.status(400).json('Error: ' + err));
});

router.delete('/:id', (req, res) => {
    Thread.findByIdAndDelete(req.params.id)
    .then(() => res.json('Thread deleted.'))
    .catch(err => res.status(400).json('Error: ' + err));
});

module.exports = router;