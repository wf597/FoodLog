import React from 'react';
import { View, Text, StyleSheet, TextInput, Keyboard, KeyboardAvoidingView, Platform, TouchableWithoutFeedback } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import PrimaryButton from '@/components/PrimaryButton';
import { useQuestionnaire } from '@/context/QuestionnaireContext';

export default function CurrentWeightScreen() {
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
            <Text style={styles.question}>What's your current weight?</Text>

            {/* Input Field Group */}
            <View style={styles.inputGroup}>
              <TextInput
                placeholder="62.0"
                value={answers.currentWeight || ''}
                onChangeText={(text) => updateAnswer('currentWeight', text)}
                keyboardType="numeric"
                style={styles.input}
              />
              <Text style={styles.unit}>kg</Text>
            </View>

            {/* Continue Button */}
            <View style={styles.buttonContainer}>
              <PrimaryButton
                title="Continue"
                disabled={!answers.currentWeight}
                onPress={() => router.push('/(questionnaire)/goal-weight')}
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

