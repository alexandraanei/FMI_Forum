const express = require("express");
const router = express.Router();
const Forum = require('../models/Forum');

router.post('/create', async (req, res) => {
   const { title, categoryId } = req.body;
   const newForum = Forum({
       title,
       createdAt: Date.now(),
       categoryId,
       lastUpdated: Date.now()
   });

   await newForum.save();
   res.send(newForum);
});

router.get('/:id', async (req, res) => {
   const forum = await Forum.findById(req.params.id);
   if (!forum) {
       res.status(404).send({
           message: 'Forum not found'
       });
       return;
   }

   res.send(forum);
});

router.get('/category/:id', async (req, res) => {
    const forums = await Forum.find({ categoryId: req.params.id });
    res.send(forums);
});

router.put('/:id/edit', async (req, res) => {
    Forum.findById(req.params.id)
    .then(forum => {
        forum.title = req.body.title;
        forum.lastUpdated = Date.now();
  
        forum.save()
          .then(() => res.json('Forum updated!'))
          .catch(err => res.status(400).json('Error: ' + err));
      })
      .catch(err => res.status(400).json('Error: ' + err));
});

router.delete('/:id', (req, res) => {
    Forum.findByIdAndDelete(req.params.id)
    .then(() => res.json('Forum deleted.'))
    .catch(err => res.status(400).json('Error: ' + err));
});

router.put('/addtopinned/:id', async (req, res) => {
    Forum.findById(req.params.id)
    .then(forum => {
        forum.pinnedPosts.push(req.body.thread);
        forum.lastUpdated = Date.now();
        forum.save()
          .then(() => res.json('Forum updated!'))
          .catch(err => res.status(400).json('Error: ' + err.response));
        
    })
    .catch(err => res.status(400).json('Error: ' + err.response));
});

router.put('/removepinned/:id', async (req, res) => {
    Forum.findById(req.params.id)
    .then(forum => {
        forum.pinnedPosts.pull(req.body.thread);
        forum.lastUpdated = Date.now();
        forum.save()
          .then(() => res.json('Forum updated!'))
          .catch(err => res.status(400).json('Error: ' + err.response));
        
    })
    .catch(err => res.status(400).json('Error: ' + err.response));
});

module.exports = router;