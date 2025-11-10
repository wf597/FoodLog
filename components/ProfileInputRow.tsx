import React from 'react';
import { View, Text, StyleSheet, TextInputProps } from 'react-native';
import StyledTextInput from './StyledTextInput';

interface ProfileInputRowProps extends TextInputProps {
  label: string;
}

export default function ProfileInputRow({ label, ...textInputProps }: ProfileInputRowProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <StyledTextInput {...textInputProps} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
});

