import React from 'react';
import { FlatList, View, Text, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import ScreenContainer from '@/components/ScreenContainer';
import DailyMealCard from '@/components/DailyMealCard';
import DateSelector from '@/components/DateSelector';
import StatDisplay from '@/components/StatDisplay';
import CircularProgress from '@/components/CircularProgress';
import MacroProgressBar from '@/components/MacroProgressBar';
import { useDailyFood, MealType } from '@/context/DailyFoodContext';

const mealGoalCalories = 456; // Goal calories per meal

export default function HomeScreen() {
  const { getMealCalories, getTotalEaten, getTotalAvailable } = useDailyFood();
  
  // Calculate meal data dynamically
  const getMealData = () => {
    const mealTypes: MealType[] = ['Breakfast', 'Lunch', 'Dinner', 'Snack'];
    return mealTypes.map((mealType, index) => {
      const calories = getMealCalories(mealType);
      return {
        id: String(index + 1),
        title: mealType,
        calories: `${calories} / ${mealGoalCalories} Cal`,
        mealType,
      };
    });
  };

  const dailyMeals = [
    ...getMealData(),
    { id: '5', title: 'Water', calories: '0 L', mealType: null as MealType | null },
    { id: '6', title: 'Exercise', calories: 'Daily Goal: 30min', mealType: null as MealType | null },
  ];

  // Calculate statistics
  const totalEaten = getTotalEaten();
  const totalAvailable = getTotalAvailable();
  const goalCalories = 2181;
  const burned = 690;
  const progress = goalCalories > 0 ? Math.min(totalEaten / goalCalories, 1) : 0;
  const renderListHeader = () => {
    return (
      <View>
        {/* Top Statistics Area */}
        <View style={styles.topStatisticsArea}>
          {/* A. Top Row - Circular Progress */}
          <View style={styles.topRow}>
            <StatDisplay iconName="flame-outline" value={String(burned)} label="burn" />
            <CircularProgress
              value={String(Math.max(0, totalAvailable))}
              label="Kcal available"
              progress={progress}
              size={150}
              strokeWidth={15}
              color="#5ECD8B"
            />
            <StatDisplay iconName="close-outline" value={String(totalEaten)} label="eaten" />
          </View>

          {/* B. Middle Row - Total Goal */}
          <View style={styles.middleRow}>
            <Text style={styles.goalValue}>{goalCalories}</Text>
            <Text style={styles.goalLabel}>Kcal Goal</Text>
          </View>

          {/* C. Bottom Row - Progress Bars */}
          <View style={styles.bottomRow}>
            <MacroProgressBar label="Fat" progress={0.3} color="#FCD269" />
            <MacroProgressBar label="Protein" progress={0.5} color="#5ECD8B" />
            <MacroProgressBar label="Carbs" progress={0.8} color="#FD8F6F" />
            <MacroProgressBar label="Fiber" progress={0.6} color="#9D9D9D" />
          </View>
        </View>

        {/* Date Selector */}
        <DateSelector date="2 May, Monday" />
      </View>
    );
  };

  return (
    <ScreenContainer>
      <FlatList
        data={dailyMeals}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <DailyMealCard
            title={item.title}
            calories={item.calories}
            onPressAdd={() => {
              if (item.mealType) {
                router.push({ pathname: '/AddFoodScreen', params: { mealType: item.mealType } });
              } else {
                router.push('/AddFoodScreen');
              }
            }}
          />
        )}
        ListHeaderComponent={renderListHeader}
        ItemSeparatorComponent={() => <View style={{ height: 16 }} />}
        contentContainerStyle={{ paddingTop: 20, paddingBottom: 20 }}
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  topStatisticsArea: {
    marginBottom: 16,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  middleRow: {
    alignItems: 'center',
    marginVertical: 10,
  },
  goalValue: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  goalLabel: {
    fontSize: 14,
    color: 'gray',
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 10,
  },
});
