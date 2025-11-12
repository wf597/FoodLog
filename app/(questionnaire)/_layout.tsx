import { Stack, router } from 'expo-router';
import { Text, TouchableOpacity } from 'react-native';

export default function QuestionnaireLayout() {
  return (
    <Stack
      screenOptions={{
        title: '', // No title
        headerShadowVisible: false, // No shadow
        headerStyle: { backgroundColor: 'white' }, // White background
        headerLeft: () => null, // Hide Return Button
        headerRight: () => (
          <TouchableOpacity onPress={() => router.replace('/(tabs)/home')}>
            <Text style={{ color: 'gray', fontSize: 16, marginRight: 10 }}>
              SKIP
            </Text>
          </TouchableOpacity>
        ),
      }}
    />
  );
}

