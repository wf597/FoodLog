import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';

// Import screens
import HomeScreen from './screens/HomeScreen';
import SettingsScreen from './screens/SettingsScreen';
import MyProfileScreen from './screens/MyProfileScreen';
import MyGoalsScreen from './screens/MyGoalsScreen';
import AIScanScreen from './screens/AIScanScreen';
import ScanResultScreen from './screens/ScanResultScreen';

// Create navigators
const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();
const RootStack = createStackNavigator();

// Settings Stack Navigator
function SettingsStackNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="SettingsMain" 
        component={SettingsScreen}
        options={{ title: 'Settings' }}
      />
      <Stack.Screen 
        name="MyProfile" 
        component={MyProfileScreen}
        options={{ title: 'My Profile' }}
      />
      <Stack.Screen 
        name="MyGoals" 
        component={MyGoalsScreen}
        options={{ title: 'My Goals' }}
      />
    </Stack.Navigator>
  );
}

// Main Bottom Tab Navigator
function MainTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Settings') {
            iconName = focused ? 'settings' : 'settings-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: 'gray',
        headerShown: false,
      })}>
      <Tab.Screen 
        name="Home" 
        component={HomeScreen}
        options={{ title: 'Home' }}
      />
      <Tab.Screen 
        name="Settings" 
        component={SettingsStackNavigator}
        options={{ title: 'Settings' }}
      />
    </Tab.Navigator>
  );
}

// Root Navigator (includes modals)
export default function AppNavigator() {
  return (
    <NavigationContainer>
      <RootStack.Navigator>
        <RootStack.Screen 
          name="Main" 
          component={MainTabNavigator}
          options={{ headerShown: false }}
        />
        <RootStack.Screen 
          name="AIScan" 
          component={AIScanScreen}
          options={{ 
            presentation: 'modal',
            title: 'AI Scan',
            headerShown: true,
          }}
        />
        <RootStack.Screen 
          name="ScanResult" 
          component={ScanResultScreen}
          options={{ 
            presentation: 'modal',
            title: 'Scan Result',
            headerShown: true,
          }}
        />
      </RootStack.Navigator>
    </NavigationContainer>
  );
}

