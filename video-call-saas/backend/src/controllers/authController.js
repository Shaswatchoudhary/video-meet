import User from '../models/User.js';
import generateToken from '../utils/generateToken.js';


const loginUser = async (req, res) => {
  const { email, password } = req.body;
  console.log('--- Auth Debug: Login Attempt ---');
  console.log('Email:', email);
  
  const user = await User.findOne({ email });
  console.log('User found:', user ? 'Yes' : 'No');

  if (user) {
    const isMatch = await user.matchPassword(password);
    console.log('Password match:', isMatch ? 'Yes' : 'No');
    
    if (isMatch) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        subscriptionStatus: user.subscriptionStatus,
        token: generateToken(user._id),
      });
      return;
    }
  }
  
  res.status(401).json({ message: 'Invalid email or password' });
};
const registerUser = async (req, res) => {
  const { name, email, password } = req.body;
  const userExists = await User.findOne({ email });

  if (userExists) {
    return res.status(400).json({ message: 'User already exists' });
  }

  const user = await User.create({
    name,
    email,
    password,
  });

  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
    });
  } else {
    return res.status(400).json({ message: 'Invalid user data' });
  }
};

export { registerUser, loginUser };


