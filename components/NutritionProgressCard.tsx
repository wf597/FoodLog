import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface NutritionProgressCardProps {
  title: string;
  value: string;
  progress: number; // 0 to 1
  color: string;
}

export default function NutritionProgressCard({
  title,
  value,
  progress,
  color,
}: NutritionProgressCardProps) {
  // Convert color to rgba format with 30% opacity (30 in hex = 48 in decimal ≈ 19% opacity)
  // If color is in #RRGGBB format, append '30' for alpha channel
  const getBackgroundColor = () => {
    if (color.startsWith('#')) {
      // If it's a hex color, append '30' for alpha (approximately 19% opacity)
      return color + '30';
    }
    // For named colors or other formats, return as is with opacity
    return color;
  };

  return (
    <View style={[styles.container, { backgroundColor: getBackgroundColor() }]}>
      {/* Top - Title */}
      <Text style={styles.title}>{title}</Text>

      {/* Middle - Value */}
      <Text style={styles.value}>{value}</Text>

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
    borderRadius: 16,
    padding: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
  },
  value: {
    fontSize: 14,
    fontWeight: '500',
    marginTop: 4,
  },
  progressBarContainer: {
    height: 8,
    width: '100%',
    backgroundColor: 'white',
    borderRadius: 4,
    marginTop: 10,
    overflow: 'hidden',
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
  },
});

