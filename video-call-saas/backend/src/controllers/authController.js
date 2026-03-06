import { findOne, create } from '../models/User';
import generateToken from '../utils/generateToken';


const loginUser = async (req, res) => {
  const { email, password } = req.body;
  const user = await findOne({ email });

  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      subscriptionStatus: user.subscriptionStatus,
      token: generateToken(user._id),
    });
  } else {
    res.status(401).json({ message: 'Invalid email or password' });
  }
};
const registerUser = async (req, res) => {
  const { name, email, password } = req.body;
  const userExists = await findOne({ email });

  if (userExists) {
    return res.status(400).json({ message: 'User already exists' });
  }

  const user = await create({
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

export default { registerUser, loginUser };


