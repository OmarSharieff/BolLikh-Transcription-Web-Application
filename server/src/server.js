import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes.js';
import transcriptionRoutes from './routes/transcriptionRoutes.js';
import errorHandler from './middleware/errorHandler.js';

// Load environment variables
dotenv.config();

const corsOptions = {
  origin: process.env.CORS ? process.env.CORS.split(',') : '*', // Supports multiple origins
  credentials: true, // Allows credentials (useful for auth-related requests)
};
// Express app initialization
const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors(corsOptions));
app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({limit: '50mb', extended: true}))

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/transcriptions', transcriptionRoutes);

// Global error handler
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});