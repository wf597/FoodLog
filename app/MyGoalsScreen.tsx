import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import ScreenContainer from '@/components/ScreenContainer';

export default function MyGoalsScreen() {
  return (
    <ScreenContainer>
      <View style={styles.container}>
        <Text style={styles.title}>My Goals</Text>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
});

