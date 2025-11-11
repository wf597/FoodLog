// Placeholder nutrition API utility
// In production, map ingredients to a nutrition database like USDA.
export async function getNutritionForFood(name, amountInGrams) {
  // Simple mocked macro estimation
  const per100g = {
    calories: 52,
    protein: 0.3,
    carbs: 14,
    fat: 0.2
  };
  const factor = amountInGrams / 100;
  return {
    calories: Math.round(per100g.calories * factor),
    protein: +(per100g.protein * factor).toFixed(1),
    carbs: +(per100g.carbs * factor).toFixed(1),
    fat: +(per100g.fat * factor).toFixed(1)
  };
}
