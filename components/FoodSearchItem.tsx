import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import IconButton from './IconButton';

interface FoodSearchItemProps {
  title: string;
  subtitle: string;
  type: 'fruit' | 'fastfood' | 'other';
  isAdded: boolean;
  onPressAdd: () => void;
  onPressRemove?: () => void;
  showRemoveButton?: boolean;
}

export default function FoodSearchItem({
  title,
  subtitle,
  type,
  isAdded,
  onPressAdd,
  onPressRemove,
  showRemoveButton = false,
}: FoodSearchItemProps) {
  // Get dot color based on type
  const getDotColor = () => {
    switch (type) {
      case 'fruit':
        return '#5ECD8B'; // Green
      case 'fastfood':
        return '#FF4444'; // Red
      case 'other':
        return '#808080'; // Gray
      default:
        return '#808080';
    }
  };

  return (
    <View style={styles.container}>
      {/* Left Section */}
      <View style={styles.leftSection}>
        {/* Title Row */}
        <View style={styles.titleRow}>
          <Text style={styles.title}>{title}</Text>
          {isAdded && (
            <Ionicons
              name="checkmark-circle"
              size={18}
              color="#5ECD8B"
              style={styles.checkmark}
            />
          )}
        </View>

        {/* Subtitle Row */}
        <View style={styles.subtitleRow}>
          <View style={[styles.dot, { backgroundColor: getDotColor() }]} />
          <Text style={styles.subtitle}>{subtitle}</Text>
        </View>
      </View>

      {/* Right Section */}
      {!isAdded && (
        <IconButton
          name="add-circle-outline"
          size={28}
          color="green"
          onPress={onPressAdd}
        />
      )}
      {isAdded && showRemoveButton && onPressRemove && (
        <IconButton
          name="close-circle-outline"
          size={28}
          color="gray"
          onPress={onPressRemove}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  leftSection: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
  },
  checkmark: {
    marginLeft: 6,
  },
  subtitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  subtitle: {
    fontSize: 14,
    color: 'gray',
  },
});

