import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import aiRoutes from './routes/aiRoutes.js';
import mongoose from 'mongoose';
import petRoutes from './routes/petRoutes.js';
import authRoutes from './routes/authRoutes.js';
import { protect, allowRoles } from './middleware/auth.js';
import adminRoutes from './routes/adminRoutes.js';

dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('MongoDB Connected Successfully!');
  })
  .catch((error) => {
    console.error('MongoDB Connection Error:', error.message);
  });

const app = express();

// Allow both local Vite dev server and deployed frontend
const allowedOrigins = [
  'http://localhost:5173',
  process.env.CLIENT_URL,
].filter(Boolean);

app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));

app.use(express.json());

app.use('/api/ai', aiRoutes);

app.use('/api/pets', petRoutes);

app.use('/api/auth', authRoutes);

app.use('/api/admin', adminRoutes);

app.get('/', (req, res) => {
  res.send('PawsomeAdapt AI Backend is running!');
});

app.get(
  '/api/auth/protected',
  protect,
  (req, res) => {
    res.json({
      message: 'Authentication successful!',
      user: req.user
    });
  }
);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Backend running at http://localhost:${PORT}`);
});
