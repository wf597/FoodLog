import React, { createContext, useContext, useState, ReactNode } from 'react';

export type MealType = 'Breakfast' | 'Lunch' | 'Dinner' | 'Snack';

export interface FoodItem {
  id: string;
  title: string;
  calories: number;
  protein?: number;
  carbs?: number;
  fat?: number;
  fibre?: number;
}

interface MealData {
  foods: FoodItem[];
  totalCalories: number;
}

interface DailyFoodData {
  Breakfast: MealData;
  Lunch: MealData;
  Dinner: MealData;
  Snack: MealData;
}

interface DailyFoodContextType {
  meals: DailyFoodData;
  addFoodToMeal: (mealType: MealType, food: FoodItem) => void;
  removeFoodFromMeal: (mealType: MealType, foodId: string) => void;
  getTotalCalories: () => number;
  getTotalEaten: () => number;
  getTotalAvailable: () => number;
  getMealCalories: (mealType: MealType) => number;
}

const initialState: DailyFoodData = {
  Breakfast: { foods: [], totalCalories: 0 },
  Lunch: { foods: [], totalCalories: 0 },
  Dinner: { foods: [], totalCalories: 0 },
  Snack: { foods: [], totalCalories: 0 },
};

const DailyFoodContext = createContext<DailyFoodContextType | undefined>(undefined);

interface DailyFoodProviderProps {
  children: ReactNode;
}

export function DailyFoodProvider({ children }: DailyFoodProviderProps) {
  const [meals, setMeals] = useState<DailyFoodData>(initialState);

  const addFoodToMeal = (mealType: MealType, food: FoodItem) => {
    setMeals((prev) => {
      const updatedMeals = { ...prev };
      const meal = { ...updatedMeals[mealType] };
      
      // Check if food already exists
      const existingFoodIndex = meal.foods.findIndex((f) => f.id === food.id);
      if (existingFoodIndex >= 0) {
        // If exists, update it
        meal.foods[existingFoodIndex] = food;
      } else {
        // If not exists, add it
        meal.foods = [...meal.foods, food];
      }
      
      // Recalculate total calories for this meal
      meal.totalCalories = meal.foods.reduce((sum, f) => sum + f.calories, 0);
      updatedMeals[mealType] = meal;
      
      return updatedMeals;
    });
  };

  const removeFoodFromMeal = (mealType: MealType, foodId: string) => {
    setMeals((prev) => {
      const updatedMeals = { ...prev };
      const meal = { ...updatedMeals[mealType] };
      
      meal.foods = meal.foods.filter((f) => f.id !== foodId);
      meal.totalCalories = meal.foods.reduce((sum, f) => sum + f.calories, 0);
      updatedMeals[mealType] = meal;
      
      return updatedMeals;
    });
  };

  const getTotalCalories = () => {
    return meals.Breakfast.totalCalories + 
           meals.Lunch.totalCalories + 
           meals.Dinner.totalCalories + 
           meals.Snack.totalCalories;
  };

  const getTotalEaten = () => {
    return getTotalCalories();
  };

  const getTotalAvailable = () => {
    const goalCalories = 2181; // Daily goal
    const eaten = getTotalEaten();
    const burned = 690; // Exercise calories burned
    return goalCalories - eaten + burned;
  };

  const getMealCalories = (mealType: MealType) => {
    return meals[mealType].totalCalories;
  };

  return (
    <DailyFoodContext.Provider
      value={{
        meals,
        addFoodToMeal,
        removeFoodFromMeal,
        getTotalCalories,
        getTotalEaten,
        getTotalAvailable,
        getMealCalories,
      }}
    >
      {children}
    </DailyFoodContext.Provider>
  );
}

export function useDailyFood() {
  const context = useContext(DailyFoodContext);
  if (context === undefined) {
    throw new Error('useDailyFood must be used within a DailyFoodProvider');
  }
  return context;
}

