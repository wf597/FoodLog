import mongoose from 'mongoose';

const questionnaireSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  mainGoal: { type: String, enum: ['weightLoss','weightGain','maintenance','muscleGain','healthyEating'], required: true },
  gender: { type: String, enum: ['male','female','other'], required: true },
  birthDate: { type: Date, required: true },
  height: { type: Number, required: true }, // cm
  currentWeight: { type: Number, required: true }, // kg
  goalWeight: { type: Number }, // kg
  activityLevel: { type: String, enum: ['sedentary','lightlyActive','moderatelyActive','veryActive','extraActive'], required: true },
  derived: {
    bmi: { type: Number },
    estimatedCalorieNeeds: { type: Number }
  }
}, { timestamps: true });

export default mongoose.model('Questionnaire', questionnaireSchema);
