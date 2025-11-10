import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import { router } from 'expo-router';
import StyledTextInput from '@/components/StyledTextInput';
import PrimaryButton from '@/components/PrimaryButton';

export default function BirthDateScreen() {
  const [year, setYear] = useState('');
  const [month, setMonth] = useState('');
  const [day, setDay] = useState('');

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Question Text */}
        <Text style={styles.question}>What's your date of birth?</Text>

        {/* Input Fields Group */}
        <View style={styles.inputGroup}>
          <StyledTextInput
            placeholder="Year"
            value={year}
            onChangeText={setYear}
            keyboardType="numeric"
            maxLength={4}
            style={styles.yearInput}
          />
          <StyledTextInput
            placeholder="Month"
            value={month}
            onChangeText={setMonth}
            keyboardType="numeric"
            maxLength={2}
            style={styles.monthInput}
          />
          <StyledTextInput
            placeholder="Day"
            value={day}
            onChangeText={setDay}
            keyboardType="numeric"
            maxLength={2}
            style={styles.dayInput}
          />
        </View>

        {/* Continue Button */}
        <View style={styles.buttonContainer}>
          <PrimaryButton
            title="Continue"
            disabled={!year || !month || !day}
            onPress={() => router.push('/(questionnaire)/height')}
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
    justifyContent: 'space-between',
    marginTop: 24,
  },
  yearInput: {
    flex: 1,
    marginRight: 8,
    width: undefined,
  },
  monthInput: {
    flex: 1,
    marginHorizontal: 8,
    width: undefined,
  },
  dayInput: {
    flex: 1,
    marginLeft: 8,
    width: undefined,
  },
  buttonContainer: {
    flex: 1,
    justifyContent: 'flex-end',
  },
});

