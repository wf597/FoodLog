import React from 'react';
import { TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface IconButtonProps {
  onPress: () => void;
  name: string;
  size?: number;
  color?: string;
}

export default function IconButton({ 
  onPress, 
  name, 
  size = 24, 
  color = '#000000' 
}: IconButtonProps) {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
      <Ionicons name={name as any} size={size} color={color} />
    </TouchableOpacity>
  );
}

