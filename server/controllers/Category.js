const express = require("express");
const router = express.Router();
const Category = require('../models/Category');

router.post('/create', async (req, res) => {
   const { title } = req.body;
   const newCategory = Category({
       title,
       createdAt: Date.now()
   });

   await newCategory.save();
   res.send(newCategory);
});

router.get('/:id', async (req, res) => {
   const cat = await Category.findById(req.params.id);
   if (!cat) {
       res.status(404).send({
           message: 'Category not found'
       });
       return;
   }

   res.send(cat);
});

router.put('/:id/edit', async (req, res) => {
    Category.findById(req.params.id)
    .then(category => {
        category.title = req.body.name;
  
        category.save()
          .then(() => res.json('Category updated!'))
          .catch(err => res.status(400).json('Error: ' + err));
      })
      .catch(err => res.status(400).json('Error: ' + err));
});

router.delete('/:id', (req, res) => {
    Category.findByIdAndDelete(req.params.id)
    .then(() => res.json('Category deleted.'))
    .catch(err => res.status(400).json('Error: ' + err));
});

router.get('/', async (req, res) => {
    const cats = await Category.find({});
    res.send(cats);
});

module.exports = router;