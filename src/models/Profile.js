import mongoose from 'mongoose';

const profileSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  mainGoal: { type: String, enum: ['weightLoss','weightGain','maintenance','muscleGain','healthyEating'], required: true },
  gender: { type: String, enum: ['male','female','other'], required: true },
  dateOfBirth: { type: Date, required: true },
  height: { value: { type: Number, required: true }, unit: { type: String, enum: ['cm','inches'], default: 'cm' } },
  weight: { value: { type: Number, required: true }, unit: { type: String, enum: ['kg','lbs'], default: 'kg' } },
  activityLevel: { type: String, enum: ['sedentary','lightlyActive','moderatelyActive','veryActive','extraActive'], required: true },
  dailyCalorieGoal: { type: Number, required: true }
}, { timestamps: true });

export default mongoose.model('Profile', profileSchema);
