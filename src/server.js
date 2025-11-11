import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import swaggerUi from 'swagger-ui-express';
import { specs } from './config/swagger.js';

// Route imports
import authRoutes from './routes/auth.js';
import userRoutes from './routes/user.js';
import profileRoutes from './routes/profile.js';
import foodRoutes from './routes/food.js';
import mealRoutes from './routes/meal.js';
import dashboardRoutes from './routes/dashboard.js';
import questionnaireRoutes from './routes/questionnaire.js';
import goalRoutes from './routes/goal.js';
import foodLogRoutes from './routes/foodLog.js';

// Middleware imports
import { errorHandler } from './middleware/errorHandler.js';

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Swagger Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

// Test route
app.get('/', (req, res) => {
  res.json({ 
    message: 'Food Log API is running!',
    status: 'healthy',
    timestamp: new Date(),
    docs: 'Visit /api-docs for API documentation'
  });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/food', foodRoutes);
app.use('/api/meal', mealRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/questionnaire', questionnaireRoutes);
app.use('/api/goal', goalRoutes);
app.use('/api/food-log', foodLogRoutes);

// Error handling
app.use(errorHandler);

// Database connection will be handled when starting the server

// Start server
const PORT = process.env.PORT || 4001;

mongoose.connect(process.env.MONGODB_URI)
  .then((connection) => {
    console.log('\x1b[32m%s\x1b[0m', '✅ MongoDB connected');
    console.log('\x1b[32m%s\x1b[0m', `📊 Database name: ${connection.connection.name}`);
    
    app.listen(PORT, () => {
      console.log('\x1b[34m%s\x1b[0m', `🚀 Food Log API Server running at http://localhost:${PORT}`);
      console.log('\x1b[36m%s\x1b[0m', `📘 Swagger docs available at http://localhost:${PORT}/api-docs`);
      console.log('\x1b[33m%s\x1b[0m', '✨ Available API endpoints:');
      console.log('\x1b[33m%s\x1b[0m', '   AUTH:      POST /api/auth/register, /api/auth/login');
      console.log('\x1b[33m%s\x1b[0m', '   USER:      GET|PUT|DELETE /api/user');
      console.log('\x1b[33m%s\x1b[0m', '   PROFILE:   POST|GET|PUT /api/profile');
  console.log('\x1b[33m%s\x1b[0m', '   FOOD:         POST /api/food/analyze, GET /api/food/search');
  console.log('\x1b[33m%s\x1b[0m', '   MEAL:         POST|GET /api/meal, GET /api/meal/daily/:date');
  console.log('\x1b[33m%s\x1b[0m', '   DASHBOARD:    GET /api/dashboard/daily/:date, /api/dashboard/weekly');
  console.log('\x1b[33m%s\x1b[0m', '   QUESTIONNAIRE: POST /api/questionnaire, GET /api/questionnaire/latest');
  console.log('\x1b[33m%s\x1b[0m', '   GOAL:         POST /api/goal, GET /api/goal/current');
  console.log('\x1b[33m%s\x1b[0m', '   FOOD-LOG:     GET /api/food-log/daily/:date, POST /api/food-log/daily/:date/sync');
    });
  })
  .catch((err) => {
    console.error('\x1b[31m%s\x1b[0m', '❌ MongoDB connection error:', err);
    process.exit(1);
  });