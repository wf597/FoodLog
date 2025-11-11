import NavigationRow from '@/components/NavigationRow';
import ScreenContainer from '@/components/ScreenContainer';
import SectionHeader from '@/components/SectionHeader';
import { useQuestionnaire } from '@/context/QuestionnaireContext';
import { Stack } from 'expo-router';
import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

export default function MyGoalsScreen() {
  const { answers } = useQuestionnaire();

  return (
    <>
      <Stack.Screen options={{ title: 'My Goals' }} />
      <ScreenContainer>
        <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
          <SectionHeader title="Nutritional Goal" />
          
          <NavigationRow
            title="Edit calorie goal"
            subtitle="Modify your daily calorie goal"
            onPress={() => {}}
          />
          
          <View style={styles.rowSpacing} />
          
          <NavigationRow
            title="Edit carbs, protein, fat and fiber goals"
            subtitle="Modify your Macronutrients goal"
            onPress={() => {}}
          />

          <SectionHeader title="Weight and Activities" />
          
          <NavigationRow
            title="Weight goal"
            subtitle={answers.goalWeight ? `${answers.goalWeight} kg` : 'Not set'}
            onPress={() => {}}
          />
          
          <View style={styles.rowSpacing} />
          
          <NavigationRow
            title="Activity level"
            subtitle={answers.activityLevel || 'Not set'}
            onPress={() => {}}
          />
        </ScrollView>
      </ScreenContainer>
    </>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 20,
    paddingBottom: 20,
  },
  rowSpacing: {
    height: 12,
  },
});
