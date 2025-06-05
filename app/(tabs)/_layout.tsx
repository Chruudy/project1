// This layout file defines the tab navigation for the app.
// It checks the authentication state using the AuthProvider and redirects to the login screen if the user is not authenticated.

import ChatButton from '@/components/ChatButton';
import ChatPopup from '@/components/ChatPopup';
import { Ionicons } from '@expo/vector-icons';
import { Redirect, Tabs } from 'expo-router';
import React from 'react';
import { Pressable, StyleSheet } from 'react-native';
import { useAuth } from '../../providers/AuthProvider';

const DISABLE_AUTH = process.env.EXPO_PUBLIC_DISABLE_AUTH === 'true'; // Disable auth for development purpose

export default function TabsLayout() {
  const [chatVisible, setChatVisible] = React.useState(false);
  const { session, loading } = useAuth();

  if (loading) return null;
  if (!session && !DISABLE_AUTH) return <Redirect href="/(auth)/login" />; // Remove "&& !DISABLE_AUTH" in production

  return (
    <>
      <Tabs
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarActiveTintColor: '#3b82f6',
          tabBarInactiveTintColor: '#888',
          tabBarStyle: {
            backgroundColor: '#fff',
            borderTopWidth: 0.5,
            borderTopColor: '#ddd',
            paddingBottom: 6,
            paddingTop: 6,
            height: 70,
          },
          tabBarLabelStyle: {
            fontSize: 12,
            fontWeight: '500',
          },
          tabBarIcon: ({ color, size, focused }) => {
            let iconName: keyof typeof Ionicons.glyphMap;

            if (route.name === 'index') {
              iconName = focused ? 'home' : 'home-outline';
            } else if (route.name === 'training') {
              iconName = focused ? 'barbell' : 'barbell-outline';
            } else if (route.name === 'shopping') {
              iconName = focused ? 'cart' : 'cart-outline';
            } else if (route.name === 'profile') {
              iconName = focused ? 'person' : 'person-outline';
            } else {
              iconName = 'ellipse';
            }

            return <Ionicons name={iconName} size={size} color={color} />;
          },
        })}
      >
        <Tabs.Screen name="index" options={{ title: 'Home' }} />
        <Tabs.Screen name="training" options={{ title: 'Training' }} />
        <Tabs.Screen name="shopping" options={{ title: 'Shopping' }} />
        <Tabs.Screen name="profile" options={{ title: 'Profile' }} />
      </Tabs>

      {/* Chat popup and toggle buttons */}
      <ChatPopup visible={chatVisible} onClose={() => setChatVisible(false)} />

      {!chatVisible ? (
        <ChatButton onPress={() => setChatVisible(true)} />
      ) : (
        <Pressable style={styles.minimizeBtn} onPress={() => setChatVisible(false)}>
          <Ionicons name="chevron-down" size={28} color="#fff" />
        </Pressable>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  minimizeBtn: {
    position: 'absolute',
    bottom: 80,
    right: 20,
    backgroundColor: '#0077cc',
    padding: 14,
    borderRadius: 100,
    zIndex: 1000,
    elevation: 10,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
  },
});
