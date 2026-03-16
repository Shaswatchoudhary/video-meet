import { Schema, model } from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new Schema({
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
    enum: ["active", "inactive"]
  },
  subscriptionPlan: {
    type: String,
    enum: ["none", "aarambh", "samraat"],
    default: "none"
  },
  subscriptionStart: {
    type: Date,
    default: null
  },
  subscriptionEnd: {
    type: Date,
    default: null
  },
  planName: {
    type: String,
    default: "Free"
  },
  nextBillingDate: {
    type: Date
  },
  createdAt: {
    type: Date,
    default: Date.now
  }

});

// Hash password before saving
userSchema.pre('save', async function () {
  console.log('--- Pre-save Hook ---');
  console.log('User:', this.email);
  console.log('Is password modified?', this.isModified('password'));
  
  if (!this.isModified('password')) {
    console.log('Password not modified, skipping hash.');
    return; // Skip if password is not modified
  }
  
  console.log('Password modified, hashing...');
  const salt = await bcrypt.genSalt(10); //salt is a random string
  this.password = await bcrypt.hash(this.password, salt);
  console.log('Password hashed successfully.');
});

// Match user-entered password to hashed password in database
userSchema.methods.matchPassword = async function (enteredPassword) {
  console.log('Comparing passwords for:', this.email);
  const isMatch = await bcrypt.compare(enteredPassword, this.password);
  return isMatch;
};

const User = model('User', userSchema);
export default User;
