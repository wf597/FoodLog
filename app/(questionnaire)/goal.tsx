import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { router } from 'expo-router';
import PrimaryButton from '@/components/PrimaryButton';

export default function GoalScreen() {
  const [selectedGoal, setSelectedGoal] = useState<string | null>(null);

  const goals = ['Losing Weight', 'Gaining muscle and losing fat', 'Eating healthier and maintain weight'];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Question Text */}
        <Text style={styles.question}>What is your main goal?</Text>

        {/* Options List */}
        <ScrollView 
          style={styles.optionsContainer}
          contentContainerStyle={styles.optionsContent}
          showsVerticalScrollIndicator={false}
        >
          {goals.map((item, index) => {
            const isSelected = item === selectedGoal;
            return (
              <TouchableOpacity
                key={index}
                style={[
                  styles.optionButton,
                  isSelected && styles.optionButtonSelected,
                ]}
                onPress={() => setSelectedGoal(item)}
              >
                <Text
                  style={[
                    styles.optionText,
                    isSelected && styles.optionTextSelected,
                  ]}
                >
                  {item}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Continue Button */}
        <View style={styles.buttonContainer}>
          <PrimaryButton
            title="Continue"
            disabled={selectedGoal === null}
            onPress={() => router.push('/(questionnaire)/gender')}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  question: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
  },
  optionsContainer: {
    flex: 1,
  },
  optionsContent: {
    paddingBottom: 20,
  },
  optionButton: {
    padding: 16,
    borderWidth: 1,
    borderRadius: 12,
    marginBottom: 12,
    borderColor: '#E0E0E0',
    backgroundColor: 'transparent',
  },
  optionButtonSelected: {
    borderColor: '#28B446',
    backgroundColor: '#F0F9F2',
  },
  optionText: {
    fontSize: 16,
    color: '#333333',
  },
  optionTextSelected: {
    color: '#28B446',
    fontWeight: '600',
  },
  buttonContainer: {
    flex: 1,
    justifyContent: 'flex-end',
  },
});

