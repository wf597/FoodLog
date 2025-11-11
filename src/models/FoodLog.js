import mongoose from 'mongoose';

const foodLogSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: Date, required: true }, // normalized to start of day
  meals: [{ type: mongoose.Schema.Types.ObjectId, ref: 'MealLog' }],
  totalsSnapshot: {
    calories: { type: Number, default: 0 },
    protein: { type: Number, default: 0 },
    carbs: { type: Number, default: 0 },
    fat: { type: Number, default: 0 },
    fiber: { type: Number, default: 0 },
    sugar: { type: Number, default: 0 },
    sodium: { type: Number, default: 0 }
  }
}, { timestamps: true });

foodLogSchema.index({ userId: 1, date: 1 }, { unique: true });

export default mongoose.model('FoodLog', foodLogSchema);
