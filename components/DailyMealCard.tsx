import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Card from './Card';
import IconButton from './IconButton';

interface DailyMealCardProps {
  title: string;
  calories: string;
  onPressAdd: () => void;
}

export default function DailyMealCard({ title, calories, onPressAdd }: DailyMealCardProps) {
  return (
    <Card>
      <View style={styles.container}>
        {/* Left Section */}
        <View style={styles.leftSection}>
          {/* Placeholder Icon */}
          <View style={styles.iconPlaceholder} />
          
          {/* Text Block */}
          <View style={styles.textBlock}>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.calories}>{calories}</Text>
          </View>
        </View>

        {/* Right Section */}
        <IconButton
          name="add"
          size={28}
          color="gray"
          onPress={onPressAdd}
        />
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconPlaceholder: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#E0E0E0',
  },
  textBlock: {
    marginLeft: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
  },
  calories: {
    fontSize: 14,
    color: 'gray',
  },
});

