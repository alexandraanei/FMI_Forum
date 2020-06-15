const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ForumSchema = new Schema({
    title: String,
    createdAt: Date,
    categoryId: { type: Schema.Types.ObjectId, ref: 'Category' }
});

const Forum = mongoose.model('Forum', ForumSchema);
module.exports = Forum;