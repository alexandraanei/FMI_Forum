const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");

const config = require('./config');

mongoose.connect(config.mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});
mongoose.connection.on('connected', () => console.log('Connected to MongoDB'));

const app = express();
app.use('/uploads', express.static('uploads'));
app.use(bodyParser.json());
app.use(cors());

app.use('/api/auth', require("./controllers/Auth"));
app.use('/api/category', require("./controllers/Category"));
app.use('/api/forum', require("./controllers/Forum"));
app.use('/api/thread', require("./controllers/Thread"));
app.use('/api/post', require("./controllers/Post"));
app.use('/api/profile', require("./controllers/Profile"));
app.use('/api/user', require("./controllers/User"));
app.use('/api/notification', require("./controllers/Notification"));

const PORT = 5005;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));