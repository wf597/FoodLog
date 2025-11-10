import NavigationRow from '@/components/NavigationRow';
import ScreenContainer from '@/components/ScreenContainer';
import { router } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function SettingsScreen() {
  return (
    <ScreenContainer>
      <View style={styles.content}>
        <Text style={styles.title}>Settings</Text>

        <Text style={styles.sectionTitle}>Customization</Text>
        <View style={styles.section}>
          <NavigationRow
            title="My Profile"
            onPress={() => router.push('/MyProfileScreen')}
          />
          <View style={styles.rowSpacing} />
          <NavigationRow
            title="My Goals"
            onPress={() => router.push('/MyGoalsScreen')}
          />
          <View style={styles.rowSpacing} />
          <NavigationRow
            title="My Account"
            onPress={() => {
              // Handle My Account navigation
            }}
          />
        </View>

        <Text style={styles.sectionTitle}>More</Text>
        <View style={styles.section}>
          <NavigationRow
            title="More"
            onPress={() => {
              // Handle More navigation
            }}
          />
          <View style={styles.rowSpacing} />
          <NavigationRow
            title="Log Out"
            onPress={() => {
              // Handle Log Out
            }}
          />
        </View>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    paddingTop: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  section: {
    marginBottom: 24,
  },
  rowSpacing: {
    height: 12,
  },
});

