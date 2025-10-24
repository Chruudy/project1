// Displays a login or sign-up screen using Supabase for authentication.
// This screen allows users to log in or create a new account, with error handling and feedback using Toast messages.

import { useRouter } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, Button, KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, TouchableOpacity } from 'react-native';
import Toast from 'react-native-toast-message';
import { supabase } from '../../services/supabase';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleAuth = async () => {
    if (!email || !password) {
      Toast.show({
        type: 'error',
        text1: 'Missing info',
        text2: 'Please enter both email and password.',
      });
      return;
    }

  setLoading(true);

  const { error, data } = isSignUp
    ? await supabase.auth.signUp({ email, password })
    : await supabase.auth.signInWithPassword({ email, password });

  setLoading(false);

  if (error) {
    const msg = error.message.toLowerCase();

    if (msg.includes('invalid login credentials')) {
      Toast.show({
        type: 'error',
        text1: 'Login failed',
        text2: 'Incorrect email or password.',
      });
    } else if (msg.includes('email not confirmed')) {
      Toast.show({
        type: 'info',
        text1: 'Email not confirmed',
        text2: 'Check your inbox to activate your account.',
      });
    } else {
      Toast.show({
        type: 'error',
        text1: 'Something went wrong',
        text2: error.message,
      });
    }

    return;
  }

  if (isSignUp) {
    Toast.show({
      type: 'success',
      text1: 'Signed up!',
      text2: 'Check your email to confirm your account.',
    });
  } else {
    Toast.show({
      type: 'success',
      text1: 'Welcome!',
      text2: `Signed in as ${data.user?.email}`,
    });
    router.replace('/(tabs)');
  }
};


  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.container}
    >
      <Text style={styles.title}>{isSignUp ? 'Create Account' : 'Welcome Back'}</Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#888"
        keyboardType="email-address"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor="#888"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      {loading ? (
        <ActivityIndicator size="large" color="#007AFF" style={{ marginTop: 16 }} />
      ) : (
        <Button
          title={isSignUp ? 'Sign Up' : 'Login'}
          onPress={handleAuth}
          disabled={loading}
        />
      )}

      <TouchableOpacity onPress={() => setIsSignUp(!isSignUp)}>
        <Text style={styles.toggleText}>
          {isSignUp
            ? 'Already have an account? Log in'
            : "Don't have an account? Sign up"}
        </Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 32,
    textAlign: 'center',
    color: '#333',
  },
  input: {
    height: 48,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 16,
    backgroundColor: '#f9f9f9',
    color: '#000',
  },
  toggleText: {
    marginTop: 24,
    color: '#007AFF',
    textAlign: 'center',
    fontSize: 14,
  },
});
