import React from 'react';
import { Image, StyleSheet, ImageStyle, ImageSourcePropType } from 'react-native';

interface AvatarProps {
  source: ImageSourcePropType;
  style?: ImageStyle;
}

export default function Avatar({ source, style }: AvatarProps) {
  return (
    <Image
      source={source}
      style={[styles.avatar, style]}
    />
  );
}

const styles = StyleSheet.create({
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#E0E0E0',
    borderWidth: 3,
    borderColor: '#FFFFFF',
    overflow: 'hidden',
  },
});

