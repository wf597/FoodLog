import React from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import IconButton from './IconButton';

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
}

export default function SearchBar({
  value,
  onChangeText,
  placeholder = 'Search foods...',
}: SearchBarProps) {
  return (
    <View style={styles.container}>
      {/* Left Section - Search Icon */}
      <Ionicons name="search" size={20} color="gray" />

      {/* Middle Section - TextInput */}
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="gray"
      />

      {/* Right Section - Camera Button */}
      <IconButton
        name="camera-outline"
        size={24}
        color="gray"
        onPress={() => router.push('/(tabs)/scan')}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F0F0',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  input: {
    flex: 1,
    fontSize: 16,
    marginLeft: 8,
  },
});

