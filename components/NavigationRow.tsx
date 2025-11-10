import React from 'react';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import Card from './Card';

interface NavigationRowProps {
  title: string;
  onPress: () => void;
}

export default function NavigationRow({ title, onPress }: NavigationRowProps) {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
      <Card>
        <View style={styles.container}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.arrow}>{'>'}</Text>
        </View>
      </Card>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 16,
  },
  arrow: {
    fontSize: 16,
  },
});

