import express from 'express';
import { authenticateUser } from '../middleware/authenticateUser.js';
import Profile from '../models/Profile.js';
import { activityLevelMultipliers } from '../config/constants.js';

const router = express.Router();
router.use(authenticateUser);

/**
 * @swagger
 * tags:
 *   name: Profile
 *   description: User health profile and questionnaire
 */

// POST /api/profile/survey
/**
 * @swagger
 * /api/profile/survey:
 *   post:
 *     summary: Submit health questionnaire
 *     tags: [Profile]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [mainGoal, gender, dateOfBirth, height, weight, activityLevel]
 *             properties:
 *               mainGoal:
 *                 type: string
 *               gender:
 *                 type: string
 *               dateOfBirth:
 *                 type: string
 *                 format: date
 *               height:
 *                 oneOf:
 *                   - type: number
 *                   - type: object
 *                     properties:
 *                       value:
 *                         type: number
 *               weight:
 *                 oneOf:
 *                   - type: number
 *                   - type: object
 *                     properties:
 *                       value:
 *                         type: number
 *               activityLevel:
 *                 type: string
 *     responses:
 *       201:
 *         description: Survey saved
 */
router.post('/survey', async (req, res) => {
  try {
    const { mainGoal, gender, dateOfBirth, height, weight, activityLevel } = req.body;

    const dob = new Date(dateOfBirth);
    const age = new Date().getFullYear() - dob.getFullYear();
    const heightInCm = typeof height === 'number' ? height : height?.value;
    const weightInKg = typeof weight === 'number' ? weight : weight?.value;

    let bmr = (10 * weightInKg) + (6.25 * heightInCm) - (5 * age) + (gender === 'male' ? 5 : -161);
    const dailyCalorieGoal = Math.round(bmr * (activityLevelMultipliers[activityLevel] || 1.2));

    const profile = await Profile.findOneAndUpdate(
      { userId: req.user.id },
      { mainGoal, gender, dateOfBirth: dob, height: { value: heightInCm, unit: 'cm' }, weight: { value: weightInKg, unit: 'kg' }, activityLevel, dailyCalorieGoal },
      { new: true, upsert: true }
    );

    res.status(201).json({ message: 'Survey saved', profile });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/profile
/**
 * @swagger
 * /api/profile:
 *   get:
 *     summary: Get current user's profile
 *     tags: [Profile]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Profile
 *       404:
 *         description: Not found
 */
router.get('/', async (req, res) => {
  try {
    const profile = await Profile.findOne({ userId: req.user.id });
    if (!profile) return res.status(404).json({ error: 'Profile not found' });
    res.json(profile);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/profile
/**
 * @swagger
 * /api/profile:
 *   put:
 *     summary: Update profile
 *     tags: [Profile]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Updated profile
 *       404:
 *         description: Not found
 */
router.put('/', async (req, res) => {
  try {
    const updates = req.body;
    if (updates.gender || updates.dateOfBirth || updates.height || updates.weight || updates.activityLevel) {
      const dob = new Date(updates.dateOfBirth);
      const age = new Date().getFullYear() - dob.getFullYear();
      const heightInCm = typeof updates.height === 'number' ? updates.height : updates.height?.value;
      const weightInKg = typeof updates.weight === 'number' ? updates.weight : updates.weight?.value;
      const bmr = (10 * weightInKg) + (6.25 * heightInCm) - (5 * age) + (updates.gender === 'male' ? 5 : -161);
      updates.dailyCalorieGoal = Math.round(bmr * (activityLevelMultipliers[updates.activityLevel] || 1.2));
    }

    const profile = await Profile.findOneAndUpdate({ userId: req.user.id }, updates, { new: true });
    if (!profile) return res.status(404).json({ error: 'Profile not found' });
    res.json(profile);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
