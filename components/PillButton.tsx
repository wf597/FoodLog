import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

interface PillButtonProps {
  title: string;
  onPress: () => void;
  isActive: boolean;
}

export default function PillButton({ title, onPress, isActive }: PillButtonProps) {
  return (
    <TouchableOpacity
      style={[
        styles.button,
        {
          backgroundColor: isActive ? '#28B446' : '#F0F0F0',
        },
      ]}
      onPress={onPress}
      activeOpacity={0.7}>
      <Text
        style={[
          styles.text,
          {
            color: isActive ? '#FFFFFF' : '#000000',
          },
        ]}>
        {title}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 20,
    marginHorizontal: 8,
  },
  text: {
    fontSize: 14,
    fontWeight: '600',
  },
});

