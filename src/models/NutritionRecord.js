import mongoose from 'mongoose';

const nutritionRecordSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  dailyTotals: {
    calories: { type: Number, default: 0 },
    protein: { type: Number, default: 0 },
    carbs: { type: Number, default: 0 },
    fat: { type: Number, default: 0 },
    fiber: { type: Number, default: 0 },
    sugar: { type: Number, default: 0 },
    sodium: { type: Number, default: 0 }
  },
  mealBreakdown: {
    breakfast: {
      calories: { type: Number, default: 0 },
      protein: { type: Number, default: 0 },
      carbs: { type: Number, default: 0 },
      fat: { type: Number, default: 0 }
    },
    lunch: {
      calories: { type: Number, default: 0 },
      protein: { type: Number, default: 0 },
      carbs: { type: Number, default: 0 },
      fat: { type: Number, default: 0 }
    },
    dinner: {
      calories: { type: Number, default: 0 },
      protein: { type: Number, default: 0 },
      carbs: { type: Number, default: 0 },
      fat: { type: Number, default: 0 }
    },
    snack: {
      calories: { type: Number, default: 0 },
      protein: { type: Number, default: 0 },
      carbs: { type: Number, default: 0 },
      fat: { type: Number, default: 0 }
    }
  },
  goals: {
    calories: { type: Number },
    protein: { type: Number },
    carbs: { type: Number },
    fat: { type: Number }
  },
  achievements: {
    calorieGoalMet: { type: Boolean, default: false },
    proteinGoalMet: { type: Boolean, default: false },
    waterGoalMet: { type: Boolean, default: false }
  }
}, { timestamps: true });

// Compound index for efficient querying
nutritionRecordSchema.index({ userId: 1, date: 1 }, { unique: true });

// Static method to calculate or update daily record
nutritionRecordSchema.statics.updateDailyRecord = async function(userId, date) {
  const MealLog = mongoose.model('MealLog');
  const Profile = mongoose.model('Profile');
  let Goal;
  try { Goal = mongoose.model('Goal'); } catch (e) { /* model may not be registered yet in some contexts */ }
  
  // Get all meals for the day
  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);
  const endOfDay = new Date(date);
  endOfDay.setHours(23, 59, 59, 999);
  
  const meals = await MealLog.find({
    userId,
    consumedAt: { $gte: startOfDay, $lte: endOfDay }
  });
  
  // Calculate totals
  const dailyTotals = {
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
    fiber: 0,
    sugar: 0,
    sodium: 0
  };
  
  const mealBreakdown = {
    breakfast: { calories: 0, protein: 0, carbs: 0, fat: 0 },
    lunch: { calories: 0, protein: 0, carbs: 0, fat: 0 },
    dinner: { calories: 0, protein: 0, carbs: 0, fat: 0 },
    snack: { calories: 0, protein: 0, carbs: 0, fat: 0 }
  };
  
  meals.forEach(meal => {
    // Add to daily totals
    Object.keys(dailyTotals).forEach(key => {
      dailyTotals[key] += meal.totalNutrition[key] || 0;
    });
    
    // Add to meal breakdown
    const mealType = meal.mealType;
    Object.keys(mealBreakdown[mealType]).forEach(key => {
      mealBreakdown[mealType][key] += meal.totalNutrition[key] || 0;
    });
  });
  
  // Choose goals: prefer active Goal at the given date, fallback to Profile.dailyCalorieGoal
  let goals;
  if (Goal) {
    const goalAtDate = await Goal.findOne({
      userId,
      isActive: true,
      startDate: { $lte: startOfDay },
      $or: [ { targetDate: { $exists: false } }, { targetDate: { $gte: startOfDay } } ]
    }).sort({ createdAt: -1 });
    if (goalAtDate) {
      goals = {
        calories: goalAtDate.calorieGoal ?? undefined,
        protein: goalAtDate.proteinGoal ?? undefined,
        carbs: goalAtDate.carbGoal ?? undefined,
        fat: goalAtDate.fatGoal ?? undefined
      };
    }
  }
  if (!goals || (!goals.calories && !goals.protein && !goals.carbs && !goals.fat)) {
    const profile = await Profile.findOne({ userId });
    const base = profile?.dailyCalorieGoal || 2000;
    goals = {
      calories: base,
      protein: base * 0.15 / 4, // 15% calories from protein
      carbs: base * 0.50 / 4,   // 50% calories from carbs
      fat: base * 0.35 / 9      // 35% calories from fat
    };
  }
  
  // Check achievements
  const achievements = {
    calorieGoalMet: dailyTotals.calories >= goals.calories * 0.9 && dailyTotals.calories <= goals.calories * 1.1,
    proteinGoalMet: dailyTotals.protein >= goals.protein * 0.8,
    waterGoalMet: false // TODO: implement water tracking
  };
  
  // Update or create record
  return await this.findOneAndUpdate(
    { userId, date: startOfDay },
    {
      dailyTotals,
      mealBreakdown,
      goals,
      achievements
    },
    { upsert: true, new: true }
  );
};

export default mongoose.model('NutritionRecord', nutritionRecordSchema);