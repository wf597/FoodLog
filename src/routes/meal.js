import express from 'express';
import { authenticateUser } from '../middleware/authenticateUser.js';
import MealLog from '../models/MealLog.js';
import NutritionRecord from '../models/NutritionRecord.js';
import { startOfDay, endOfDay } from 'date-fns';

const router = express.Router();
router.use(authenticateUser);

/**
 * @swagger
 * tags:
 *   name: Meal
 *   description: Meal logging and history
 */

// POST /api/meal - create meal log
/**
 * @swagger
 * /api/meal:
 *   post:
 *     summary: Log a meal
 *     tags: [Meal]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               mealType:
 *                 type: string
 *                 enum: [breakfast, lunch, dinner, snack]
 *               foods:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     foodItemId:
 *                       type: string
 *                     quantity:
 *                       type: number
 *                     unit:
 *                       type: string
 *     responses:
 *       201:
 *         description: Meal created
 */
router.post('/', async (req, res) => {
  try {
    const payload = { ...req.body, userId: req.user.id };
    const meal = await MealLog.create(payload);
    await NutritionRecord.updateDailyRecord(req.user.id, meal.consumedAt);
    res.status(201).json(meal);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/meal - list meals with optional date range
/**
 * @swagger
 * /api/meal:
 *   get:
 *     summary: List meals
 *     tags: [Meal]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *     responses:
 *       200:
 *         description: Meals
 */
router.get('/', async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const query = { userId: req.user.id };
    if (startDate && endDate) {
      query.consumedAt = { $gte: new Date(startDate), $lte: new Date(endDate) };
    }
    const meals = await MealLog.find(query).sort({ consumedAt: -1 });
    res.json(meals);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/meal/daily/:date - meals grouped for date
/**
 * @swagger
 * /api/meal/daily/{date}:
 *   get:
 *     summary: Meals for a date grouped by meal type
 *     tags: [Meal]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: date
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *     responses:
 *       200:
 *         description: Grouped meals
 */
router.get('/daily/:date', async (req, res) => {
  try {
    const date = new Date(req.params.date);
    const meals = await MealLog.find({
      userId: req.user.id,
      consumedAt: { $gte: startOfDay(date), $lte: endOfDay(date) }
    }).sort({ consumedAt: 1 });

    const grouped = { breakfast: [], lunch: [], dinner: [], snack: [] };
    meals.forEach(m => grouped[m.mealType]?.push(m));
    res.json({ date, meals: grouped });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
