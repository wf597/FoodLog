import React from 'react';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import Card from './Card';

interface NavigationRowProps {
  title: string;
  onPress: () => void;
  subtitle?: string;
}

export default function NavigationRow({ title, onPress, subtitle }: NavigationRowProps) {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
      <Card>
        <View style={styles.container}>
          <View style={styles.textContainer}>
            <Text style={styles.title}>{title}</Text>
            {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
          </View>
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
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
  },
  subtitle: {
    fontSize: 14,
    color: 'gray',
    marginTop: 4,
  },
  arrow: {
    fontSize: 16,
  },
});

