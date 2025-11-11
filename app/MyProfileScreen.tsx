import Avatar from '@/components/Avatar';
import PillButton from '@/components/PillButton';
import ProfileInputRow from '@/components/ProfileInputRow';
import ScreenContainer from '@/components/ScreenContainer';
import { Stack } from 'expo-router';
import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useQuestionnaire } from '@/context/QuestionnaireContext';

export default function MyProfileScreen() {
  const { answers, updateAnswer } = useQuestionnaire();

  // Format birthdate from Context
  const birthdate = `${answers.birthDateYear || ''} / ${answers.birthDateMonth || ''} / ${answers.birthDateDay || ''}`;

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
            value="Sam"
            onChangeText={() => {}}
          />

          <ProfileInputRow
            label="Birthdate"
            placeholder="e.g., June 4, 2007"
            value={birthdate}
            onChangeText={() => {}}
            editable={false}
          />

          <ProfileInputRow
            label="Height"
            placeholder="e.g., 178 cm"
            value={answers.height ? `${answers.height} cm` : ''}
            onChangeText={() => {}}
            editable={false}
          />

          {/* Bottom Section - Gender Selection */}
          <Text style={styles.genderLabel}>Gender</Text>
          <View style={styles.genderButtonsContainer}>
            <PillButton
              title="Male"
              isActive={answers.gender === 'Male'}
              onPress={() => updateAnswer('gender', 'Male')}
            />
            <PillButton
              title="Female"
              isActive={answers.gender === 'Female'}
              onPress={() => updateAnswer('gender', 'Female')}
            />
            <PillButton
              title="Non binary"
              isActive={answers.gender === 'Non binary'}
              onPress={() => updateAnswer('gender', 'Non binary')}
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

