const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  subscriptionStatus: {
    type: String,
    default: "inactive",
    enum: ["active", "inactive"] //enum is used to restrict the values of a field means it will only accept the values which are in the enum
  },
  createdAt: {
    type: Date,
    default: Date.now
  }

});

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next(); // Skip if password is not modified
  }
  const salt = await bcrypt.genSalt(10); //salt is a random string
  this.password = await bcrypt.hash(this.password, salt);
});

// Match user-entered password to hashed password in database
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);
module.exports = User;
