import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const protect = async (req, res, next) => {
  let token;

  console.log('--- Auth Debug ---');
  console.log('Content-Type:', req.headers['content-type']);
  console.log('Authorization Header:', req.headers.authorization);
  console.log('Body:', req.body);

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.body && req.body.meetId) {
    token = req.body.meetId;
  }

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id).select('-password');
      
      if (!user) {
        console.warn('Authentication failed: User not found in database for token ID:', decoded.id);
        return res.status(401).json({ message: 'User no longer exists. Please sign up or log in again.' });
      }

      req.user = user;
      console.log('Token Verified for User:', req.user._id);
      return next();
    } catch (error) {
      console.error('JWT Verification Error:', error.message);
      return res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  console.log('No token found in either header or body');
  return res.status(401).json({ message: 'Not authorized, no token' });
};

export { protect };
