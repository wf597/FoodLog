import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Card from './Card';

interface FoodItemCardProps {
  title: string;
  details: string;
}

export default function FoodItemCard({ title, details }: FoodItemCardProps) {
  return (
    <Card>
      <View style={styles.container}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.details}>{details}</Text>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
  },
  details: {
    fontSize: 14,
    color: 'gray',
    marginTop: 4,
  },
});

