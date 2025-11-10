import Avatar from '@/components/Avatar';
import PillButton from '@/components/PillButton';
import ProfileInputRow from '@/components/ProfileInputRow';
import ScreenContainer from '@/components/ScreenContainer';
import { Stack } from 'expo-router';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

export default function MyProfileScreen() {
  const [firstName, setFirstName] = useState<string>('');
  const [birthdate, setBirthdate] = useState<string>('');
  const [height, setHeight] = useState<string>('');
  const [activeGender, setActiveGender] = useState<string | null>(null);

  return (
    <>
      <Stack.Screen
        options={{
          title: 'My Profile',
          headerShadowVisible: false,
          headerStyle: { backgroundColor: '#FAFAFA' },
          headerTitleAlign: 'center',
        }}
      />
      <ScreenContainer>
        <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
          {/* Top Section - Avatar */}
          <View style={styles.avatarContainer}>
            <Avatar
              source={require('../assets/images/icon.png')}
            />
          </View>

          {/* Middle Section - Form */}
          <ProfileInputRow
            label="First Name"
            placeholder="Enter your first name"
            value={firstName}
            onChangeText={setFirstName}
          />

          <ProfileInputRow
            label="Birthdate"
            placeholder="e.g., June 4, 2007"
            value={birthdate}
            onChangeText={setBirthdate}
          />

          <ProfileInputRow
            label="Height"
            placeholder="e.g., 178 cm"
            value={height}
            onChangeText={setHeight}
          />

          {/* Bottom Section - Gender Selection */}
          <Text style={styles.genderLabel}>Gender</Text>
          <View style={styles.genderButtonsContainer}>
            <PillButton
              title="Male"
              isActive={activeGender === 'male'}
              onPress={() => setActiveGender('male')}
            />
            <PillButton
              title="Female"
              isActive={activeGender === 'female'}
              onPress={() => setActiveGender('female')}
            />
            <PillButton
              title="Non binary"
              isActive={activeGender === 'nonbinary'}
              onPress={() => setActiveGender('nonbinary')}
            />
          </View>
        </ScrollView>
      </ScreenContainer>
    </>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 20,
  },
  avatarContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  genderLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    marginTop: 16,
  },
  genderButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
});

