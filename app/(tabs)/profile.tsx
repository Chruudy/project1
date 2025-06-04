import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';
import { supabase } from '../../services/supabase';

export default function Profile() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const session = supabase.auth.getSession().then(({ data }) => {
      setUser(data?.session?.user || null);
    });
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.replace('/(auth)/login');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.emoji}>👤</Text>
      <Text style={styles.title}>Your Profile</Text>
      {user ? (
        <>
          <Text style={styles.info}><Text style={styles.label}>Email:</Text> {user.email}</Text>
          <Text style={styles.info}><Text style={styles.label}>Created:</Text> {new Date(user.created_at).toLocaleDateString()}</Text>
        </>
      ) : (
        <Text style={styles.loading}>Loading user info...</Text>
      )}

      <View style={styles.buttonWrapper}>
        <Button title="Logout" onPress={handleLogout} color="#d9534f" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
    backgroundColor: '#fff',
  },
  emoji: {
    fontSize: 48,
    marginBottom: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 16,
  },
  info: {
    fontSize: 14,
    color: '#333',
    marginBottom: 4,
  },
  label: {
    fontWeight: 'bold',
  },
  loading: {
    fontSize: 14,
    color: '#888',
    marginBottom: 8,
  },
  buttonWrapper: {
    marginTop: 24,
    width: '100%',
  },
});
