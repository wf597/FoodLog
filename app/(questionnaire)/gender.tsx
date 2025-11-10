import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { router } from 'expo-router';
import PrimaryButton from '@/components/PrimaryButton';

export default function GenderScreen() {
  const [selectedGender, setSelectedGender] = useState<string | null>(null);

  const genders = ['Female', 'Male', 'Non binary'];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Question Text */}
        <Text style={styles.question}>What is your gender?</Text>

        {/* Options List */}
        <ScrollView
          style={styles.optionsContainer}
          contentContainerStyle={styles.optionsContent}
          showsVerticalScrollIndicator={false}
        >
          {genders.map((item, index) => {
            const isSelected = item === selectedGender;
            return (
              <TouchableOpacity
                key={index}
                style={[
                  styles.optionButton,
                  isSelected && styles.optionButtonSelected,
                ]}
                onPress={() => setSelectedGender(item)}
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
            disabled={selectedGender === null}
            onPress={() => router.push('/(questionnaire)/birth-date')}
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

