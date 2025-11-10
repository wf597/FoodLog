import React from 'react';
import { TextInput, StyleSheet, TextInputProps, StyleProp, TextStyle } from 'react-native';

interface StyledTextInputProps extends TextInputProps {
  style?: StyleProp<TextStyle>;
}

export default function StyledTextInput({ style, ...props }: StyledTextInputProps) {
  return (
    <TextInput
      style={[styles.input, style]}
      {...props}
    />
  );
}

const styles = StyleSheet.create({
  input: {
    backgroundColor: '#F0F0F0',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
    fontSize: 16,
    width: '100%',
  },
});

