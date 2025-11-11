import PrimaryButton from '@/components/PrimaryButton';
import StyledTextInput from '@/components/StyledTextInput';
import { useQuestionnaire } from '@/context/QuestionnaireContext';
import { router } from 'expo-router';
import React from 'react';
import { Keyboard, KeyboardAvoidingView, Platform, StyleSheet, Text, TouchableWithoutFeedback, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function BirthDateScreen() {
  const { answers, updateAnswer } = useQuestionnaire();

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
          <View style={styles.content}>
            {/* Question Text */}
            <Text style={styles.question}>What's your date of birth?</Text>

            {/* Input Fields Group */}
            <View style={styles.inputGroup}>
              <StyledTextInput
                placeholder="Year"
                value={answers.birthDateYear || ''}
                onChangeText={(text) => updateAnswer('birthDateYear', text)}
                keyboardType="numeric"
                maxLength={4}
                style={styles.yearInput}
              />
              <StyledTextInput
                placeholder="Month"
                value={answers.birthDateMonth || ''}
                onChangeText={(text) => updateAnswer('birthDateMonth', text)}
                keyboardType="numeric"
                maxLength={2}
                style={styles.monthInput}
              />
              <StyledTextInput
                placeholder="Day"
                value={answers.birthDateDay || ''}
                onChangeText={(text) => updateAnswer('birthDateDay', text)}
                keyboardType="numeric"
                maxLength={2}
                style={styles.dayInput}
              />
            </View>

            {/* Continue Button */}
            <View style={styles.buttonContainer}>
              <PrimaryButton
                title="Continue"
                disabled={!answers.birthDateYear || !answers.birthDateMonth || !answers.birthDateDay}
                onPress={() => router.push('/(questionnaire)/height')}
              />
            </View>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
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

