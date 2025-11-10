import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface MacroProgressBarProps {
  label: string;
  progress: number; // 0 to 1
  color: string;
}

export default function MacroProgressBar({ label, progress, color }: MacroProgressBarProps) {
  return (
    <View style={styles.container}>
      {/* Top - Label */}
      <Text style={styles.label}>{label}</Text>

      {/* Bottom - Progress Bar */}
      <View style={styles.progressBarContainer}>
        <View
          style={[
            styles.progressBar,
            {
              width: `${progress * 100}%`,
              backgroundColor: color,
            },
          ]}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  label: {
    fontSize: 12,
    color: 'gray',
  },
  progressBarContainer: {
    height: 6,
    width: '100%',
    backgroundColor: '#F0F0F0',
    borderRadius: 3,
    marginTop: 4,
    overflow: 'hidden',
  },
  progressBar: {
    height: 6,
    borderRadius: 3,
  },
});

