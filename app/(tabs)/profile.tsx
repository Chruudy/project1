import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { supabase } from '../../services/supabase';

export default function Profile() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [preferences, setPreferences] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);

      const { data: sessionData } = await supabase.auth.getSession();
      const userData = sessionData?.session?.user;

      if (userData) {
        setUser(userData);

        // Fetch user profile and preferences from your new tables
        const { data: profileData } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('id', userData.id)
          .single();

        const { data: preferencesData } = await supabase
          .from('user_preferences')
          .select('*')
          .eq('id', userData.id)
          .single();

        setProfile(profileData);
        setPreferences(preferencesData);
      }

      setLoading(false);
    };

    fetchUserData();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.replace('/(auth)/login');
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#0077cc" />
      </View>
    );
  }

  if (!user) {
    return (
      <View style={styles.centered}>
        <Text style={styles.error}>Failed to load user info.</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.emoji}>👤</Text>
      <Text style={styles.title}>Your Profile</Text>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Account</Text>
        <Text style={styles.info}>
          <Text style={styles.label}>Email:</Text> {user.email}
        </Text>
        <Text style={styles.info}>
          <Text style={styles.label}>Joined:</Text>{' '}
          {new Date(user.created_at).toLocaleDateString()}
        </Text>
      </View>

      {profile && (
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Physical Stats</Text>
          <InfoRow label="Full Name" value={profile.full_name} />
          <InfoRow label="Gender" value={profile.gender} />
          <InfoRow label="Age" value={calculateAge(profile.birth_date)} />
          <InfoRow label="Height" value={`${profile.height_cm} cm`} />
          <InfoRow label="Weight" value={`${profile.weight_kg} kg`} />
          <InfoRow
            label="Activity Level"
            value={capitalize(profile.activity_level)}
          />
        </View>
      )}

      {preferences && (
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Preferences</Text>
          <InfoRow label="Language" value={preferences.language} />
          <InfoRow label="Units" value={preferences.units} />
          <InfoRow label="Theme" value={capitalize(preferences.theme)} />
          <InfoRow
            label="Notifications"
            value={preferences.notifications_enabled ? 'Enabled' : 'Disabled'}
          />
        </View>
      )}

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutButtonText}>Logout</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

// Small helper to display rows
const InfoRow = ({ label, value }: { label: string; value: string }) => (
  <View style={styles.infoRow}>
    <Text style={styles.label}>{label}:</Text>
    <Text style={styles.value}>{value || '-'}</Text>
  </View>
);

// Utility: calculate age from birthdate
const calculateAge = (birthDate: string) => {
  if (!birthDate) return '-';
  const diff = Date.now() - new Date(birthDate).getTime();
  const age = new Date(diff).getUTCFullYear() - 1970;
  return age.toString();
};

const capitalize = (str: string) =>
  str ? str.charAt(0).toUpperCase() + str.slice(1) : '-';

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#f9f9f9',
    alignItems: 'center',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emoji: {
    fontSize: 60,
    marginBottom: 12,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
  },
  card: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#0077cc',
    marginBottom: 10,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 4,
  },
  label: {
    fontWeight: '600',
    color: '#555',
  },
  value: {
    color: '#333',
  },
  info: {
    fontSize: 15,
    color: '#444',
    marginBottom: 6,
  },
  logoutButton: {
    backgroundColor: '#d9534f',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 10,
    marginTop: 20,
  },
  logoutButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  error: {
    color: '#d9534f',
    fontSize: 16,
  },
});
