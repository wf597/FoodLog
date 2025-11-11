import express from 'express';
import { authenticateUser } from '../middleware/authenticateUser.js';
import { upload } from '../middleware/uploadHandler.js';
import imageAnalysisService from '../services/imageAnalysis.js';
import FoodItem from '../models/FoodItem.js';

const router = express.Router();
router.use(authenticateUser);

/**
 * @swagger
 * tags:
 *   name: Food
 *   description: Food items & image analysis
 */

// POST /api/food/analyze - upload & analyze image
/**
 * @swagger
 * /api/food/analyze:
 *   post:
 *     summary: Upload and analyze a food image
 *     tags: [Food]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Analysis result
 *       400:
 *         description: Image file required
 */
router.post('/analyze', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'Image file required' });
    const analysis = await imageAnalysisService.analyzeImage(req.file.path);
    res.status(201).json({ message: 'Analysis complete', analysis });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/food/search?query=apple
/**
 * @swagger
 * /api/food/search:
 *   get:
 *     summary: Search food items by text
 *     tags: [Food]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: query
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of matching food items
 */
router.get('/search', async (req, res) => {
  try {
    const { query } = req.query;
    if (!query) return res.json([]);
    const items = await FoodItem.find({ $text: { $search: query } }).limit(25);
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
