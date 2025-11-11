import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Stack, router } from 'expo-router';
import ScreenContainer from '@/components/ScreenContainer';
import StyledTextInput from '@/components/StyledTextInput';
import PrimaryButton from '@/components/PrimaryButton';
import SocialLoginButton from '@/components/SocialLoginButton';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <>
      <Stack.Screen
        options={{
          headerTransparent: true,
          title: '',
          headerBackTitleVisible: false,
          headerShadowVisible: false,
        }}
      />
      <ScreenContainer>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Title */}
          <Text style={styles.title}>Log In</Text>

          {/* Email Input */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Email</Text>
            <StyledTextInput
              placeholder="Enter Email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          {/* Password Input */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Password</Text>
            <StyledTextInput
              placeholder="Enter Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={true}
            />
          </View>

          {/* Or Separator */}
          <View style={styles.orContainer}>
            <View style={styles.orLine} />
            <Text style={styles.orText}>Or</Text>
            <View style={styles.orLine} />
          </View>

          {/* Social Login Buttons */}
          <SocialLoginButton title="Continue with Google" iconName="logo-google" onPress={() => {}} />
          <SocialLoginButton title="Continue with Apple" iconName="logo-apple" onPress={() => {}} />

          {/* Log In Button */}
          <View style={styles.buttonContainer}>
            <PrimaryButton title="Log In" onPress={() => router.push('/(tabs)/home')} />
          </View>

          {/* Sign Up Link */}
          <TouchableOpacity onPress={() => router.push('/signup')}>
            <Text style={styles.signupText}>Don't have an account? Sign Up</Text>
          </TouchableOpacity>
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
    paddingBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 24,
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  orContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 16,
  },
  orLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E0E0E0',
  },
  orText: {
    marginHorizontal: 16,
    fontSize: 14,
    color: 'gray',
  },
  buttonContainer: {
    marginTop: 16,
    width: '100%',
  },
  signupText: {
    textAlign: 'center',
    marginTop: 16,
    fontSize: 14,
    color: 'gray',
  },
});

