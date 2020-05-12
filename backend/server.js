const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// const uri = process.env.ATLAS_URI;
const uri = 'mongodb+srv://Alexandra:fmiforum@mycluster-p1t0g.gcp.mongodb.net/test?retryWrites=true&w=majority';

mongoose.connect(uri, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true }
);

const connection = mongoose.connection;
connection.once('open', () => {
  console.log("MongoDB database connection established successfully");
})


// const MongoClient = require('mongodb').MongoClient
// MongoClient.connect(dbConnection, {
//   useUnifiedTopology: true
// }) 
//   .then(client => {
//     console.log('Connected to Database');
//     const db = client.db('forum');
//   })
//   .catch(error => console.error(error))

const postsRouter = require('./routes/posts');
const usersRouter = require('./routes/users');

app.use('/posts', postsRouter);
app.use('/users', usersRouter);

app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});

// app.get('/', (req, res) => {
//   res.sendFile('/../frontend/src' + '/index.tsx');
// })
