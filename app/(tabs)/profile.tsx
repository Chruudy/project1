import { useRouter } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  RefreshControl,
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
  const [refreshing, setRefreshing] = useState(false);

  const fetchUserData = useCallback(async () => {
    try {
      setLoading(true);
      const { data: sessionData } = await supabase.auth.getSession();
      const userData = sessionData?.session?.user;

      if (!userData) {
        router.replace('/(auth)/login');
        return;
      }

      setUser(userData);

      const [{ data: profileData }, { data: preferencesData }] = await Promise.all([
        supabase.from('user_profiles').select('*').eq('id', userData.id).single(),
        supabase.from('user_preferences').select('*').eq('id', userData.id).single(),
      ]);

      setProfile(profileData || {});
      setPreferences(preferencesData || {});
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);

  // Pull to refresh support
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchUserData();
    setRefreshing(false);
  }, [fetchUserData]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.replace('/(auth)/login');
  };

  const isIncomplete =
    !profile?.height_cm || !profile?.weight_kg || !profile?.activity_level;

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
    <ScrollView
      contentContainerStyle={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <Text style={styles.emoji}>👤</Text>
      <Text style={styles.title}>Your Profile</Text>

      {/* ⚠️ Incomplete Profile Warning */}
      {isIncomplete && (
        <View style={styles.warningBox}>
          <Text style={styles.warningText}>
            ⚠️ Your profile is incomplete. Some features may not work correctly.
          </Text>
          <TouchableOpacity
            style={styles.completeButton}
            onPress={() => router.push('/complete-profile' as any)}
          >
            <Text style={styles.completeButtonText}>Complete Now</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* 🧾 Account Info */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Account</Text>
        <InfoRow label="Email" value={user.email} />
        <InfoRow
          label="Joined"
          value={new Date(user.created_at).toLocaleDateString()}
        />
      </View>

      {/* 🏋️ Physical Stats */}
      {profile && (
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Physical Stats</Text>
          <InfoRow label="Full Name" value={profile.full_name} />
          <InfoRow label="Gender" value={capitalize(profile.gender)} />
          <InfoRow label="Age" value={calculateAge(profile.birth_date)} />
          <InfoRow
            label="Height"
            value={
              profile.height_cm
                ? `${profile.height_cm} ${getUnit(preferences?.units, 'height')}`
                : '-'
            }
          />
          <InfoRow
            label="Weight"
            value={
              profile.weight_kg
                ? `${profile.weight_kg} ${getUnit(preferences?.units, 'weight')}`
                : '-'
            }
          />
          <InfoRow
            label="Activity Level"
            value={capitalize(profile.activity_level)}
          />
        </View>
      )}

      {/* ⚙️ Preferences */}
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

      {/* 🚪 Logout */}
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutButtonText}>Logout</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

// 🔹 Helpers
const InfoRow = ({ label, value }: { label: string; value: string }) => (
  <View style={styles.infoRow}>
    <Text style={styles.label}>{label}:</Text>
    <Text style={styles.value}>{value || '-'}</Text>
  </View>
);

const calculateAge = (birthDate: string) => {
  if (!birthDate) return '-';
  const diff = Date.now() - new Date(birthDate).getTime();
  const age = new Date(diff).getUTCFullYear() - 1970;
  return age.toString();
};

const capitalize = (str: string) =>
  str ? str.charAt(0).toUpperCase() + str.slice(1) : '-';

const getUnit = (units: string, type: 'height' | 'weight') => {
  if (units === 'imperial') return type === 'height' ? 'in' : 'lbs';
  return type === 'height' ? 'cm' : 'kg';
};

// 🎨 Styles
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
  warningBox: {
    width: '100%',
    backgroundColor: '#fff3cd',
    borderLeftWidth: 4,
    borderLeftColor: '#ffcc00',
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
  },
  warningText: {
    color: '#856404',
    fontSize: 14,
    marginBottom: 8,
    textAlign: 'center',
  },
  completeButton: {
    alignSelf: 'center',
    backgroundColor: '#0077cc',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
  },
  completeButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
});
