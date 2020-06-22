const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ThreadSchema = new Schema({
    title: String,
    createdAt: Date,
    forumId: { type: Schema.Types.ObjectId, ref: 'Forum' },
    content: String,
    userId: { type: Schema.Types.ObjectId, ref: 'User' },
    likedBy: { type: [Schema.Types.ObjectId], ref: 'User' },
});

const Thread = mongoose.model('Thread', ThreadSchema);
module.exports = Thread;