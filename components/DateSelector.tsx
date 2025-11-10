import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import IconButton from './IconButton';

interface DateSelectorProps {
  date: string;
  onPressPrevious?: () => void;
  onPressNext?: () => void;
}

export default function DateSelector({ date, onPressPrevious, onPressNext }: DateSelectorProps) {
  return (
    <View style={styles.container}>
      {/* Left Section - Previous Button */}
      <IconButton
        name="chevron-back"
        size={24}
        onPress={onPressPrevious || (() => {})}
      />

      {/* Middle Section - Date Text */}
      <Text style={styles.dateText}>{date}</Text>

      {/* Right Section - Next Button */}
      <IconButton
        name="chevron-forward"
        size={24}
        onPress={onPressNext || (() => {})}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: 16,
  },
  dateText: {
    fontSize: 16,
    fontWeight: '600',
  },
});

