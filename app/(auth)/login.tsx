import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity
} from 'react-native';
import Toast from 'react-native-toast-message';
import { supabase } from '../../services/supabase';

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);

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
  
    const { data, error } = isSignUp
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
  
    const user = data?.user;
  
    if (isSignUp && user) {
      // Create blank profile and preferences
      await supabase.from('user_profiles').insert({ id: user.id });
      await supabase.from('user_preferences').insert({ id: user.id });
  
      Toast.show({
        type: 'success',
        text1: 'Account created!',
        text2: 'Please complete your profile.',
      });
  
      router.replace('./complete-profile');
      return;
    }
  
    // Existing user — check if profile is complete
    if (user) {
      const { data: profileData } = await supabase
        .from('user_profiles')
        .select('height_cm, weight_kg, activity_level')
        .eq('id', user.id)
        .single();
  
      const incomplete =
        !profileData?.height_cm || !profileData?.weight_kg || !profileData?.activity_level;
  
      if (incomplete) {
        Toast.show({
          type: 'info',
          text1: 'Almost done!',
          text2: 'Please complete your profile to get personalized plans.',
        });
        router.replace('./complete-profile');
      } else {
        Toast.show({
          type: 'success',
          text1: 'Welcome!',
          text2: `Signed in as ${user.email}`,
        });
        router.replace('/(tabs)');
      }
    }
  };
  

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.container}
    >
      <Text style={styles.emoji}>{isSignUp ? '🚀' : '💪'}</Text>
      <Text style={styles.title}>
        {isSignUp ? 'Create Account' : 'Welcome Back'}
      </Text>

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
        <ActivityIndicator size="large" color="#0077cc" style={{ marginTop: 16 }} />
      ) : (
        <TouchableOpacity style={styles.authButton} onPress={handleAuth}>
          <Text style={styles.authButtonText}>
            {isSignUp ? 'Sign Up' : 'Login'}
          </Text>
        </TouchableOpacity>
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
    alignItems: 'center',
    paddingHorizontal: 24,
    backgroundColor: '#f9f9f9',
  },
  emoji: {
    fontSize: 60,
    marginBottom: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 30,
  },
  input: {
    width: '100%',
    height: 50,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 14,
    marginBottom: 16,
    backgroundColor: '#fff',
    fontSize: 16,
  },
  authButton: {
    width: '100%',
    backgroundColor: '#0077cc',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 6,
  },
  authButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  toggleText: {
    marginTop: 20,
    color: '#0077cc',
    textAlign: 'center',
    fontSize: 14,
  },
});
