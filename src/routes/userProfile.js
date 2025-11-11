import express from 'express';
import { authenticateUser } from '../middleware/authenticateUser.js';
import UserProfile from '../models/UserProfile.js';
import { activityLevelMultipliers } from '../config/constants.js';

const router = express.Router();

router.use(authenticateUser);

/**
 * @swagger
 * /api/user-profile/survey:
 *   post:
 *     summary: Submit health questionnaire
 *     tags: [User Profile]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - mainGoal
 *               - gender
 *               - dateOfBirth
 *               - height
 *               - weight
 *               - activityLevel
 *             properties:
 *               mainGoal:
 *                 type: string
 *                 enum: [weightLoss, weightGain, maintenance, muscleGain, healthyEating]
 *               gender:
 *                 type: string
 *                 enum: [male, female, other]
 *               dateOfBirth:
 *                 type: string
 *                 format: date
 *               height:
 *                 type: number
 *               weight:
 *                 type: number
 *               activityLevel:
 *                 type: string
 *                 enum: [sedentary, lightlyActive, moderatelyActive, veryActive, extraActive]
 */
router.post('/survey', async (req, res) => {
	try {
		const {
			mainGoal,
			gender,
			dateOfBirth,
			height,
			weight,
			activityLevel
		} = req.body;

		// Calculate BMR and daily calorie goal
		const age = new Date().getFullYear() - new Date(dateOfBirth).getFullYear();
		const heightInCm = typeof height === 'number' ? height : height.value;
		const weightInKg = typeof weight === 'number' ? weight : weight.value;

		// Calculate BMR using Mifflin-St Jeor Equation
		let bmr;
		if (gender === 'male') {
			bmr = (10 * weightInKg) + (6.25 * heightInCm) - (5 * age) + 5;
		} else {
			bmr = (10 * weightInKg) + (6.25 * heightInCm) - (5 * age) - 161;
		}

		// Apply activity level multiplier
		const multiplier = activityLevelMultipliers[activityLevel] || 1.2;
		const dailyCalorieGoal = Math.round(bmr * multiplier);

		// Create or update profile
		const profile = await UserProfile.findOneAndUpdate(
			{ userId: req.user.id },
			{
				mainGoal,
				gender,
				dateOfBirth,
				height: { value: heightInCm, unit: 'cm' },
				weight: { value: weightInKg, unit: 'kg' },
				activityLevel,
				dailyCalorieGoal
			},
			{ new: true, upsert: true }
		);

		res.status(201).json({
			message: 'Survey submitted successfully',
			profile
		});
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

/**
 * @swagger
 * /api/user-profile:
 *   get:
 *     summary: Get user profile
 *     tags: [User Profile]
 *     security:
 *       - BearerAuth: []
 */
router.get('/', async (req, res) => {
	try {
		const profile = await UserProfile.findOne({ userId: req.user.id });
		if (!profile) {
			return res.status(404).json({ error: 'Profile not found' });
		}
		res.json(profile);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

/**
 * @swagger
 * /api/user-profile:
 *   put:
 *     summary: Update user profile
 *     tags: [User Profile]
 *     security:
 *       - BearerAuth: []
 */
router.put('/', async (req, res) => {
	try {
		const updates = req.body;
    
		// Recalculate daily calorie goal if relevant fields are updated
		if (updates.gender || updates.dateOfBirth || updates.height || 
				updates.weight || updates.activityLevel) {
			const age = new Date().getFullYear() - new Date(updates.dateOfBirth || dateOfBirth).getFullYear();
			const heightInCm = typeof updates.height === 'number' ? updates.height : updates.height?.value;
			const weightInKg = typeof updates.weight === 'number' ? updates.weight : updates.weight?.value;

			let bmr;
			if (updates.gender === 'male') {
				bmr = (10 * weightInKg) + (6.25 * heightInCm) - (5 * age) + 5;
			} else {
				bmr = (10 * weightInKg) + (6.25 * heightInCm) - (5 * age) - 161;
			}

			const multiplier = activityLevelMultipliers[updates.activityLevel] || 1.2;
			updates.dailyCalorieGoal = Math.round(bmr * multiplier);
		}

		const profile = await UserProfile.findOneAndUpdate(
			{ userId: req.user.id },
			updates,
			{ new: true }
		);

		if (!profile) {
			return res.status(404).json({ error: 'Profile not found' });
		}

		res.json(profile);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

export default router;