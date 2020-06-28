const mongoose = require("mongoose");
const bcrypt = require('bcryptjs');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    firstName: String,
    lastName: String,
    username: String,
    email: String,
    password: String,
    avatar: { type: String, required: false },
    createdAt: Date,
    type: 'admin' | 'mod' | 'user',
    subscribedCategories: { type: [Schema.Types.ObjectId], ref: 'Category',  required: false },
    subscribedForums: { type: [Schema.Types.ObjectId], ref: 'Forum',  required: false },
    subscribedThreads: { type: [Schema.Types.ObjectId], ref: 'Thread',  required: false },
    notifications: { type: [Schema.Types.ObjectId], ref: 'Notification' },
});

UserSchema.pre('save', async function(next) {
   const user = this;
   if (!user.isModified('password')) return next();

   const hash = await bcrypt.hash(user.password, 10);
   user.password = hash;
   next();
});

const User = mongoose.model('User', UserSchema);
module.exports = User;