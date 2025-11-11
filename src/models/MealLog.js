import mongoose from 'mongoose';

const mealLogSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  mealType: {
    type: String,
    enum: ['breakfast', 'lunch', 'dinner', 'snack'],
    required: true
  },
  foods: [{
    foodItemId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'FoodItem',
      required: true
    },
    quantity: {
      type: Number,
      required: true,
      min: 0
    },
    unit: {
      type: String,
      enum: ['g', 'ml', 'piece', 'cup', 'tbsp', 'tsp'],
      required: true
    }
  }],
  totalNutrition: {
    calories: { type: Number, default: 0 },
    protein: { type: Number, default: 0 },
    carbs: { type: Number, default: 0 },
    fat: { type: Number, default: 0 },
    fiber: { type: Number, default: 0 },
    sugar: { type: Number, default: 0 },
    sodium: { type: Number, default: 0 }
  },
  consumedAt: {
    type: Date,
    default: Date.now
  },
  notes: {
    type: String,
    maxlength: 500
  },
  imageUrl: {
    type: String
  }
}, { timestamps: true });

// Calculate total nutrition before saving
mealLogSchema.pre('save', async function(next) {
  if (this.isModified('foods')) {
    await this.populate('foods.foodItemId');
    
    const totals = {
      calories: 0,
      protein: 0,
      carbs: 0,
      fat: 0,
      fiber: 0,
      sugar: 0,
      sodium: 0
    };

    this.foods.forEach(food => {
      const multiplier = food.quantity / 100; // assuming nutrition is per 100g
      const nutrition = food.foodItemId.nutritionPer100g;
      
      totals.calories += nutrition.calories * multiplier;
      totals.protein += nutrition.protein * multiplier;
      totals.carbs += nutrition.carbs * multiplier;
      totals.fat += nutrition.fat * multiplier;
      totals.fiber += nutrition.fiber * multiplier;
      totals.sugar += nutrition.sugar * multiplier;
      totals.sodium += nutrition.sodium * multiplier;
    });

    this.totalNutrition = totals;
  }
  next();
});

export default mongoose.model('MealLog', mealLogSchema);