import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

// Auth & Onboarding Screens
import LandingScreen from '../pages/auth/LandingScreen';
import ProfileCreationScreen from '../pages/auth/ProfileCreationScreen';
import ReadingAssessmentScreen from '../pages/auth/ReadingAssessmentScreen';

// Main App Screens
import DashboardScreen from '../pages/dashboard/DashboardScreen';
import StorySelectionScreen from '../pages/reading/StorySelectionScreen';
import ReadingSessionScreen from '../pages/reading/ReadingSessionScreen';
import WildlifeExplorationScreen from '../pages/wildlife/WildlifeExplorationScreen';
import ChallengesScreen from '../pages/challenges/ChallengesScreen';
import ProgressReviewScreen from '../pages/progress/ProgressReviewScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const MainTabs = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen 
        name="Dashboard" 
        component={DashboardScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="home" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen 
        name="Stories" 
        component={StorySelectionScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="book" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen 
        name="Wildlife" 
        component={WildlifeExplorationScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="paw" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen 
        name="Challenges" 
        component={ChallengesScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="trophy" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen 
        name="Progress" 
        component={ProgressReviewScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="chart-line" color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Landing">
        {/* Onboarding Flow */}
        <Stack.Screen 
          name="Landing" 
          component={LandingScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen 
          name="ProfileCreation" 
          component={ProfileCreationScreen}
          options={{ title: 'Create Your Profile' }}
        />
        <Stack.Screen 
          name="ReadingAssessment" 
          component={ReadingAssessmentScreen}
          options={{ title: 'Reading Assessment' }}
        />
        
        {/* Main App Flow */}
        <Stack.Screen
          name="MainApp"
          component={MainTabs}
          options={{ headerShown: false }}
        />
        
        {/* Modal Screens */}
        <Stack.Screen
          name="ReadingSession"
          component={ReadingSessionScreen}
          options={{ 
            presentation: 'modal',
            title: 'Reading Session'
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator; 