import mongoose from 'mongoose';

const goalSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  goalType: { type: String, enum: ['weight','maintenance','recomposition','customMacros'], required: true },
  targetWeight: { type: Number },
  calorieGoal: { type: Number },
  carbGoal: { type: Number },
  proteinGoal: { type: Number },
  fatGoal: { type: Number },
  fiberGoal: { type: Number },
  startDate: { type: Date, required: true },
  targetDate: { type: Date },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

// Helper static to find current active goal
goalSchema.statics.findCurrent = async function(userId, today = new Date()) {
  return this.findOne({
    userId,
    isActive: true,
    startDate: { $lte: today },
    $or: [
      { targetDate: { $exists: false } },
      { targetDate: { $gte: today } }
    ]
  }).sort({ createdAt: -1 });
};

export default mongoose.model('Goal', goalSchema);
