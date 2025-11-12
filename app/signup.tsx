import PrimaryButton from '@/components/PrimaryButton';
import ScreenContainer from '@/components/ScreenContainer';
import SocialLoginButton from '@/components/SocialLoginButton';
import StyledTextInput from '@/components/StyledTextInput';
import { Stack, router } from 'expo-router';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function SignUpScreen() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <>
      <Stack.Screen
        options={{
          headerTransparent: true,
          title: '',
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
          <Text style={styles.title}>Create Your Account</Text>

          {/* Full Name Input */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Full Name</Text>
            <StyledTextInput
              placeholder="Enter Full Name"
              value={fullName}
              onChangeText={setFullName}
            />
          </View>

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

          {/* Sign Up Button */}
          <View style={styles.buttonContainer}>
            <PrimaryButton title="Sign Up" onPress={() => router.push('/(questionnaire)/goal')} />
          </View>

          {/* Log In Link */}
          <TouchableOpacity onPress={() => router.push('/login')}>
            <Text style={styles.loginText}>Already have an account? Log In</Text>
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
  loginText: {
    textAlign: 'center',
    marginTop: 16,
    fontSize: 14,
    color: 'gray',
  },
});

