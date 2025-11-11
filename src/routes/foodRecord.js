import express from 'express';
import { authenticateUser } from '../middleware/authenticateUser.js';
import { upload } from '../middleware/uploadHandler.js';
import { startOfDay, endOfDay } from 'date-fns';
import imageAnalysisService from '../services/imageAnalysis.js';
import FoodRecord from '../models/FoodRecord.js';

const router = express.Router();

router.use(authenticateUser);

/**
 * @swagger
 * /api/food-record/analyze:
 *   post:
 *     summary: Upload and analyze food image
 *     tags: [Food Record]
 *     security:
 *       - BearerAuth: []
 */
router.post('/analyze', upload.single('foodImage'), async (req, res) => {
	try {
		if (!req.file) {
			return res.status(400).json({ error: 'No image file provided' });
		}

		const analysisResult = await imageAnalysisService.analyzeImage(req.file.path);

		const foodRecord = new FoodRecord({
			userId: req.user.id,
			imageUrl: req.file.path, // TODO: Replace with S3 URL
			analyzedIngredients: analysisResult.ingredients,
			nutritionInfo: analysisResult.nutritionInfo,
			mealType: req.body.mealType || 'snack'
		});

		await foodRecord.save();

		res.status(201).json({
			message: 'Food analysis completed',
			foodRecord
		});
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

/**
 * @swagger
 * /api/food-record:
 *   get:
 *     summary: Get all food records
 *     tags: [Food Record]
 *     security:
 *       - BearerAuth: []
 */
router.get('/', async (req, res) => {
	try {
		const { startDate, endDate, mealType } = req.query;
		const query = { userId: req.user.id };

		if (startDate && endDate) {
			query.consumedAt = {
				$gte: new Date(startDate),
				$lte: new Date(endDate)
			};
		}

		if (mealType) {
			query.mealType = mealType;
		}

		const records = await FoodRecord.find(query)
			.sort({ consumedAt: -1 });

		res.json(records);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

/**
 * @swagger
 * /api/food-record/{id}:
 *   get:
 *     summary: Get food record by ID
 *     tags: [Food Record]
 *     security:
 *       - BearerAuth: []
 */
router.get('/:id', async (req, res) => {
	try {
		const record = await FoodRecord.findOne({
			_id: req.params.id,
			userId: req.user.id
		});

		if (!record) {
			return res.status(404).json({ error: 'Food record not found' });
		}

		res.json(record);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

/**
 * @swagger
 * /api/food-record/daily/{date}:
 *   get:
 *     summary: Get food records for a specific date
 *     tags: [Food Record]
 *     security:
 *       - BearerAuth: []
 */
router.get('/daily/:date', async (req, res) => {
	try {
		const date = new Date(req.params.date);
    
		const records = await FoodRecord.find({
			userId: req.user.id,
			consumedAt: {
				$gte: startOfDay(date),
				$lte: endOfDay(date)
			}
		}).sort({ consumedAt: 1 });

		// Group by meal type
		const groupedRecords = {
			breakfast: records.filter(record => record.mealType === 'breakfast'),
			lunch: records.filter(record => record.mealType === 'lunch'),
			dinner: records.filter(record => record.mealType === 'dinner'),
			snack: records.filter(record => record.mealType === 'snack')
		};

		// Calculate daily totals
		const dailyTotals = records.reduce((totals, record) => {
			totals.calories += record.nutritionInfo.calories || 0;
			totals.protein += record.nutritionInfo.protein || 0;
			totals.carbs += record.nutritionInfo.carbs || 0;
			totals.fat += record.nutritionInfo.fat || 0;
			return totals;
		}, {
			calories: 0,
			protein: 0,
			carbs: 0,
			fat: 0
		});

		res.json({
			date: date,
			records: groupedRecords,
			dailyTotals
		});
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

/**
 * @swagger
 * /api/food-record/{id}:
 *   put:
 *     summary: Update food record
 *     tags: [Food Record]
 *     security:
 *       - BearerAuth: []
 */
router.put('/:id', async (req, res) => {
	try {
		const record = await FoodRecord.findOneAndUpdate(
			{ _id: req.params.id, userId: req.user.id },
			req.body,
			{ new: true }
		);

		if (!record) {
			return res.status(404).json({ error: 'Food record not found' });
		}

		res.json(record);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

export default router;