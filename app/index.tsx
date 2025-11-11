import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Dimensions } from 'react-native';
import { router } from 'expo-router';
import PrimaryButton from '@/components/PrimaryButton';

const { height: screenHeight } = Dimensions.get('window');

export default function OnboardingScreen() {
  return (
    <View style={styles.container}>
      {/* Top Logo */}
      <Text style={styles.logo}>CalLens</Text>

      {/* Middle Illustration */}
      <Image 
        source={require('@/assets/images/Onboarding.jpg')} 
        style={styles.illustration}
        resizeMode="contain"
      />

      {/* Bottom Content */}
      <View style={styles.bottomContent}>
        <Text style={styles.title}>Track Your Meals</Text>
        <Text style={styles.subtitle}>Your smart companion for mindful eating.</Text>

        {/* Get Started Button */}
        <PrimaryButton 
          title="Get Started" 
          onPress={() => router.push('/signup')} 
        />

        {/* Log In Link */}
        <TouchableOpacity onPress={() => router.push('/login')}>
          <Text style={styles.loginText}>Already Have An Account? Log In</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
    alignItems: 'center',
    justifyContent: 'space-around',
    padding: 20,
  },
  logo: {
    fontSize: 32,
    fontWeight: 'bold',
  },
  illustration: {
    width: '100%',
    height: screenHeight * 0.5,
  },
  bottomContent: {
    alignItems: 'center',
    width: '100%',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: 'gray',
    textAlign: 'center',
    marginBottom: 24,
  },
  loginText: {
    marginTop: 16,
    fontSize: 14,
    color: 'gray',
  },
});

