import express from 'express';
import { authenticateUser } from '../middleware/authenticateUser.js';
import NutritionRecord from '../models/NutritionRecord.js';
import { startOfDay, subDays } from 'date-fns';

const router = express.Router();
router.use(authenticateUser);

/**
 * @swagger
 * tags:
 *   name: Dashboard
 *   description: Nutrition summaries and trends
 */

// GET /api/dashboard/daily/:date
/**
 * @swagger
 * /api/dashboard/daily/{date}:
 *   get:
 *     summary: Get daily nutrition summary
 *     tags: [Dashboard]
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
 *         description: Daily record
 */
router.get('/daily/:date', async (req, res) => {
  try {
    const date = startOfDay(new Date(req.params.date));
    const record = await NutritionRecord.updateDailyRecord(req.user.id, date);
    res.json(record);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/dashboard/weekly
/**
 * @swagger
 * /api/dashboard/weekly:
 *   get:
 *     summary: Get last 7 days records
 *     tags: [Dashboard]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Weekly records
 */
router.get('/weekly', async (req, res) => {
  try {
    const today = startOfDay(new Date());
    const sevenDaysAgo = startOfDay(subDays(today, 6));

    const records = await NutritionRecord.find({
      userId: req.user.id,
      date: { $gte: sevenDaysAgo, $lte: today }
    }).sort({ date: 1 });

    res.json(records);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
