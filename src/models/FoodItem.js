import mongoose from 'mongoose';

const foodItemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  brand: {
    type: String,
    trim: true
  },
  barcode: {
    type: String,
    unique: true,
    sparse: true // allows multiple null values
  },
  category: {
    type: String,
    enum: ['fruits', 'vegetables', 'grains', 'protein', 'dairy', 'fats', 'beverages', 'snacks', 'other'],
    default: 'other'
  },
  servingSize: {
    amount: {
      type: Number,
      required: true,
      default: 100
    },
    unit: {
      type: String,
      enum: ['g', 'ml', 'piece', 'cup', 'tbsp', 'tsp'],
      default: 'g'
    }
  },
  nutritionPer100g: {
    calories: {
      type: Number,
      required: true
    },
    protein: {
      type: Number,
      default: 0
    },
    carbs: {
      type: Number,
      default: 0
    },
    fat: {
      type: Number,
      default: 0
    },
    fiber: {
      type: Number,
      default: 0
    },
    sugar: {
      type: Number,
      default: 0
    },
    sodium: {
      type: Number,
      default: 0
    },
    cholesterol: {
      type: Number,
      default: 0
    },
    vitamins: {
      a: { type: Number, default: 0 },
      c: { type: Number, default: 0 },
      d: { type: Number, default: 0 },
      e: { type: Number, default: 0 }
    },
    minerals: {
      calcium: { type: Number, default: 0 },
      iron: { type: Number, default: 0 },
      potassium: { type: Number, default: 0 }
    }
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  source: {
    type: String,
    enum: ['user_input', 'ai_recognition', 'barcode_scan', 'database'],
    default: 'user_input'
  }
}, { timestamps: true });

// Index for search
foodItemSchema.index({ name: 'text', brand: 'text' });

export default mongoose.model('FoodItem', foodItemSchema);