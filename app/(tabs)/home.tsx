import React from 'react';
import { FlatList, View, Text, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import ScreenContainer from '@/components/ScreenContainer';
import DailyMealCard from '@/components/DailyMealCard';
import DateSelector from '@/components/DateSelector';
import StatDisplay from '@/components/StatDisplay';
import CircularProgress from '@/components/CircularProgress';
import MacroProgressBar from '@/components/MacroProgressBar';

const dailyMeals = [
  { id: '1', title: 'Breakfast', calories: '0 / 456 Cal' },
  { id: '2', title: 'Lunch', calories: '0 / 456 Cal' },
  { id: '3', title: 'Dinner', calories: '0 / 456 Cal' },
  { id: '4', title: 'Snack', calories: '0 / 456 Cal' },
  { id: '5', title: 'Water', calories: '0 L' },
  { id: '6', title: 'Exercise', calories: 'Daily Goal: 30min' },
];

export default function HomeScreen() {
  const renderListHeader = () => {
    return (
      <View>
        {/* Top Statistics Area */}
        <View style={styles.topStatisticsArea}>
          {/* A. Top Row - Circular Progress */}
          <View style={styles.topRow}>
            <StatDisplay iconName="flame-outline" value="690" label="burn" />
            <CircularProgress
              value="1645"
              label="Kcal available"
              progress={0.75}
              size={150}
              strokeWidth={15}
              color="#28B446"
            />
            <StatDisplay iconName="close-outline" value="536" label="eaten" />
          </View>

          {/* B. Middle Row - Total Goal */}
          <View style={styles.middleRow}>
            <Text style={styles.goalValue}>2181</Text>
            <Text style={styles.goalLabel}>Kcal Goal</Text>
          </View>

          {/* C. Bottom Row - Progress Bars */}
          <View style={styles.bottomRow}>
            <MacroProgressBar label="Fat" progress={0.3} color="#FCD269" />
            <MacroProgressBar label="Protein" progress={0.5} color="#28B446" />
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
            onPressAdd={() => router.push('/AddFoodScreen')}
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
