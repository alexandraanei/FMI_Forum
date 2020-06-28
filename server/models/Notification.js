const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const NotificationSchema = new Schema({
    createdAt: Date,
    threadId: { type: Schema.Types.ObjectId, ref: 'Thread' },
    forumId: { type: Schema.Types.ObjectId, ref: 'Forum' },
    categoryId: { type: Schema.Types.ObjectId, ref: 'Category' },
    content: String,
    read: Boolean,
});

const Notification = mongoose.model('Notification', NotificationSchema);
module.exports = Notification;