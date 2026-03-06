import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import connectDB from './config/db';

// Load environment variables
dotenv.config();

// Connect to Database
connectDB();

const authRoutes = require('./routes/authRoutes');

const app = express();

// Middleware
app.use(helmet()); //helmet is used to secure the app by setting various HTTP headers 
app.use(cors()); //cors is used to allow cross-origin requests
app.use(express.json()); //express.json() is used to parse the incoming requests with JSON payloads

// Routes
app.use('/api/users', authRoutes);


// Main Route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to the Video Meet API' });
});

// Port configuration
const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
