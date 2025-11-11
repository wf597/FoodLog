import express from 'express';
import { authenticateUser } from '../middleware/authenticateUser.js';
import FoodLog from '../models/FoodLog.js';
import MealLog from '../models/MealLog.js';
import NutritionRecord from '../models/NutritionRecord.js';
import { startOfDay, endOfDay } from 'date-fns';

const router = express.Router();
router.use(authenticateUser);

async function buildFoodLog(userId, dateObj) {
  const meals = await MealLog.find({
    userId,
    consumedAt: { $gte: startOfDay(dateObj), $lte: endOfDay(dateObj) }
  }).sort({ consumedAt: 1 });

  const mealIds = meals.map(m => m._id);
  // Optionally compute totals snapshot quickly
  const totals = meals.reduce((acc, m) => {
    acc.calories += m.totalNutrition.calories || 0;
    acc.protein += m.totalNutrition.protein || 0;
    acc.carbs += m.totalNutrition.carbs || 0;
    acc.fat += m.totalNutrition.fat || 0;
    acc.fiber += m.totalNutrition.fiber || 0;
    acc.sugar += m.totalNutrition.sugar || 0;
    acc.sodium += m.totalNutrition.sodium || 0;
    return acc;
  }, { calories:0, protein:0, carbs:0, fat:0, fiber:0, sugar:0, sodium:0 });

  const dateStart = startOfDay(dateObj);
  const log = await FoodLog.findOneAndUpdate(
    { userId, date: dateStart },
    { $set: { meals: mealIds, totalsSnapshot: totals } },
    { upsert: true, new: true }
  );
  return { log, meals };
}

// GET /api/food-log/daily/:date
router.get('/daily/:date', async (req, res) => {
  try {
    const date = new Date(req.params.date);
    const { log, meals } = await buildFoodLog(req.user.id, date);

    // Group meals
    const grouped = { breakfast: [], lunch: [], dinner: [], snack: [] };
    meals.forEach(m => grouped[m.mealType]?.push(m));

    res.json({ date: startOfDay(date), log, meals: grouped });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/food-log/daily/:date/sync - force rebuild
router.post('/daily/:date/sync', async (req, res) => {
  try {
    const date = new Date(req.params.date);
    const { log, meals } = await buildFoodLog(req.user.id, date);
    await NutritionRecord.updateDailyRecord(req.user.id, date);
    res.json({ message: 'Synced', logId: log._id, mealCount: meals.length });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
