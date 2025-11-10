import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import IconButton from './IconButton';

interface StatDisplayProps {
  iconName: string;
  value: string;
  label: string;
}

export default function StatDisplay({ iconName, value, label }: StatDisplayProps) {
  return (
    <View style={styles.container}>
      {/* Top - Icon */}
      <IconButton
        name={iconName}
        color="black"
        size={24}
        onPress={() => {}}
      />

      {/* Middle - Value */}
      <Text style={styles.value}>{value}</Text>

      {/* Bottom - Label */}
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  value: {
    fontSize: 22,
    fontWeight: 'bold',
    marginTop: 8,
  },
  label: {
    fontSize: 14,
    color: 'gray',
  },
});

