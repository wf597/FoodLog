# Food Log Application

A modern food logging application with AI-powered image analysis for nutrition tracking.

## Features

- User Authentication
- Personal Profile & Health Questionnaire
- AI-Powered Food Image Analysis
- Nutrition Tracking
- Meal Categorization (Breakfast/Lunch/Dinner/Snacks)
- Detailed Calorie Information

## Tech Stack

- Node.js
- Express.js
- MongoDB
- JWT Authentication
- AI Image Analysis
- AWS S3 for Image Storage

## Getting Started

1. Clone the repository
2. Copy `.env.example` to `.env` and update the values
3. Install dependencies:
   ```bash
   npm install
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```

## API Documentation

### Authentication
- POST `/api/auth/register` - Register new user
- POST `/api/auth/login` - Login user

### Profile
- POST `/api/profile/survey` - Submit health questionnaire
- GET `/api/profile` - Get user profile
- PUT `/api/profile` - Update user profile

### Food
- POST `/api/food/analyze` - Upload and analyze food image
- GET `/api/food/search?query=` - Search food items

### Meal
- POST `/api/meal` - Log a meal
- GET `/api/meal` - Get meal history (optional date range)
- GET `/api/meal/daily/:date` - Get meals grouped for a specific date

### Dashboard
- GET `/api/dashboard/daily/:date` - Daily nutrition summary
- GET `/api/dashboard/weekly` - Last 7 days nutrition records

## Environment Variables

See `.env.example` for required environment variables.

## License

MIT