import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
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
          {/* Meal Image */}
          <Image 
            source={require('@/assets/images/dailymeal.jpg')} 
            style={styles.mealImage}
            resizeMode="cover"
          />
          
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
  mealImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
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

