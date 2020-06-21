const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PostSchema = new Schema({
    createdAt: Date,
    threadId: { type: Schema.Types.ObjectId, ref: 'Thread' },
    content: String,
    photo: { type: String, required: false },
    userId: { type: Schema.Types.ObjectId, ref: 'User' },
    likedBy: { type: [Schema.Types.ObjectId], ref: 'User',  required: false },
});

const Post = mongoose.model('Post', PostSchema);
module.exports = Post;