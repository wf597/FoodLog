import express from 'express';
import { authenticateUser } from '../middleware/authenticateUser.js';
import Goal from '../models/Goal.js';

const router = express.Router();
router.use(authenticateUser);

// POST /api/goal - create goal
router.post('/', async (req, res) => {
  try {
    const goal = await Goal.create({ ...req.body, userId: req.user.id });
    res.status(201).json(goal);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/goal/current
router.get('/current', async (req, res) => {
  try {
    const current = await Goal.findCurrent(req.user.id);
    if (!current) return res.status(404).json({ error: 'No active goal' });
    res.json(current);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/goal - list all goals
router.get('/', async (req, res) => {
  try {
    const goals = await Goal.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json(goals);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/goal/:id - update goal
router.put('/:id', async (req, res) => {
  try {
    const goal = await Goal.findOneAndUpdate({ _id: req.params.id, userId: req.user.id }, req.body, { new: true });
    if (!goal) return res.status(404).json({ error: 'Goal not found' });
    res.json(goal);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/goal/:id - delete goal
router.delete('/:id', async (req, res) => {
  try {
    const goal = await Goal.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    if (!goal) return res.status(404).json({ error: 'Goal not found' });
    res.json({ message: 'Goal deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
