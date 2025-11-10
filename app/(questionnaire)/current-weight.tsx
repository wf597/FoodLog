import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TextInput } from 'react-native';
import { router } from 'expo-router';
import PrimaryButton from '@/components/PrimaryButton';

export default function CurrentWeightScreen() {
  const [currentWeight, setCurrentWeight] = useState('');

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Question Text */}
        <Text style={styles.question}>What's your current weight?</Text>

        {/* Input Field Group */}
        <View style={styles.inputGroup}>
          <TextInput
            placeholder="62.0"
            value={currentWeight}
            onChangeText={setCurrentWeight}
            keyboardType="numeric"
            style={styles.input}
          />
          <Text style={styles.unit}>kg</Text>
        </View>

        {/* Continue Button */}
        <View style={styles.buttonContainer}>
          <PrimaryButton
            title="Continue"
            disabled={!currentWeight}
            onPress={() => router.push('/(questionnaire)/goal-weight')}
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
    marginTop: 24,
  },
  inputGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#CCC',
  },
  input: {
    flex: 1,
    fontSize: 18,
    paddingVertical: 12,
  },
  unit: {
    fontSize: 18,
    color: 'gray',
  },
  buttonContainer: {
    flex: 1,
    justifyContent: 'flex-end',
  },
});

