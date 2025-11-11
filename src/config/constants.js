export const nutritionLimits = {
  daily: {
    calories: 2000, // Default value, should be calculated based on user profile
    protein: 50,    // grams
    carbs: 275,     // grams
    fat: 55,        // grams
    fiber: 28,      // grams
    sugar: 50,      // grams
    sodium: 2300,   // mg
    cholesterol: 300 // mg
  }
};

export const activityLevelMultipliers = {
  sedentary: 1.2,
  lightlyActive: 1.375,
  moderatelyActive: 1.55,
  veryActive: 1.725,
  extraActive: 1.9
};

export const mealTypeCalorieDistribution = {
  breakfast: 0.25,
  lunch: 0.35,
  dinner: 0.30,
  snack: 0.10
};

export const imageUploadConfig = {
  allowedTypes: ['image/jpeg', 'image/png', 'image/jpg'],
  maxSize: 5 * 1024 * 1024, // 5MB
  directory: 'uploads/'
};