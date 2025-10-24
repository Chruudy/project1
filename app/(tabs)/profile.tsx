import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { supabase } from '../../services/supabase';

export default function Profile() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      const { data } = await supabase.auth.getSession();
      setUser(data?.session?.user || null);
      setLoading(false);
    };
    fetchUser();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.replace('/(auth)/login');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.emoji}>👤</Text>
      <Text style={styles.title}>Your Profile</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#0077cc" />
      ) : user ? (
        <View style={styles.infoWrapper}>
          <Text style={styles.info}>
            <Text style={styles.label}>Email:</Text> {user.email}
          </Text>
          <Text style={styles.info}>
            <Text style={styles.label}>Created:</Text> {new Date(user.created_at).toLocaleDateString()}
          </Text>
        </View>
      ) : (
        <Text style={styles.error}>Failed to load user info.</Text>
      )}

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutButtonText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
    backgroundColor: '#f9f9f9', // Light gray background for a modern look
  },
  emoji: {
    fontSize: 60,
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 24,
  },
  infoWrapper: {
    marginBottom: 32,
    alignItems: 'center',
  },
  info: {
    fontSize: 16,
    color: '#555',
    marginBottom: 8,
  },
  label: {
    fontWeight: 'bold',
    color: '#0077cc', // Blue for emphasis
  },
  error: {
    fontSize: 16,
    color: '#d9534f', // Red for error messages
    marginBottom: 32,
  },
  logoutButton: {
    backgroundColor: '#d9534f', // Red for logout button
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 8,
    elevation: 3, // Adds a subtle shadow for depth
  },
  logoutButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});