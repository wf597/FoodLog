import express from 'express';
import { authenticateUser } from '../middleware/authenticateUser.js';
import Questionnaire from '../models/Questionnaire.js';
import Profile from '../models/Profile.js';
import { activityLevelMultipliers } from '../config/constants.js';

const router = express.Router();
router.use(authenticateUser);

function calculateDerived({ height, currentWeight }) {
  const heightM = height / 100;
  const bmi = +(currentWeight / (heightM * heightM)).toFixed(2);
  return { bmi };
}

function estimateCalories({ gender, birthDate, height, currentWeight, activityLevel }) {
  const age = new Date().getFullYear() - new Date(birthDate).getFullYear();
  const bmr = gender === 'male'
    ? (10 * currentWeight) + (6.25 * height) - (5 * age) + 5
    : (10 * currentWeight) + (6.25 * height) - (5 * age) - 161;
  const multiplier = activityLevelMultipliers[activityLevel] || 1.2;
  return Math.round(bmr * multiplier);
}

// POST /api/questionnaire
router.post('/', async (req, res) => {
  try {
    const data = req.body;
    const derived = calculateDerived(data);
    derived.estimatedCalorieNeeds = estimateCalories(data);

    const questionnaire = await Questionnaire.create({ ...data, userId: req.user.id, derived });

    // Sync profile snapshot (latest answers)
    const age = new Date().getFullYear() - new Date(data.birthDate).getFullYear();
    await Profile.findOneAndUpdate(
      { userId: req.user.id },
      {
        mainGoal: data.mainGoal,
        gender: data.gender,
        dateOfBirth: data.birthDate,
        height: { value: data.height, unit: 'cm' },
        weight: { value: data.currentWeight, unit: 'kg' },
        activityLevel: data.activityLevel,
        dailyCalorieGoal: derived.estimatedCalorieNeeds,
        age // optional if you want age stored separately
      },
      { upsert: true }
    );

    res.status(201).json({ questionnaire });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/questionnaire/latest
router.get('/latest', async (req, res) => {
  try {
    const q = await Questionnaire.findOne({ userId: req.user.id }).sort({ createdAt: -1 });
    if (!q) return res.status(404).json({ error: 'No questionnaire found' });
    res.json(q);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/questionnaire/history?limit=20
router.get('/history', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit || '20', 10);
    const list = await Questionnaire.find({ userId: req.user.id })
      .sort({ createdAt: -1 })
      .limit(limit);
    res.json(list);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
