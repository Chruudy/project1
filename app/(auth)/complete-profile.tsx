import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import Toast from 'react-native-toast-message';
import { supabase } from '../../services/supabase';

export default function CompleteProfile() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [profile, setProfile] = useState<any>({
    full_name: '',
    gender: '',
    birth_date: '',
    height_cm: '',
    weight_kg: '',
    activity_level: '',
  });

  useEffect(() => {
    const fetchUserAndProfile = async () => {
      setLoading(true);
      const { data: sessionData } = await supabase.auth.getSession();
      const user = sessionData?.session?.user;

      if (!user) {
        router.replace('/(auth)/login');
        return;
      }

      setUserId(user.id);

      const { data: profileData, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) console.warn(error);
      if (profileData) setProfile(profileData);
      setLoading(false);
    };

    fetchUserAndProfile();
  }, []);

  const handleChange = (field: string, value: string) => {
    setProfile((prev: any) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    if (!userId) return;
    setSaving(true);

    const { error } = await supabase
      .from('user_profiles')
      .update({
        full_name: profile.full_name,
        gender: profile.gender,
        birth_date: profile.birth_date || null,
        height_cm: profile.height_cm ? parseFloat(profile.height_cm) : null,
        weight_kg: profile.weight_kg ? parseFloat(profile.weight_kg) : null,
        activity_level: profile.activity_level,
      })
      .eq('id', userId);

    setSaving(false);

    if (error) {
      console.error(error);
      Toast.show({
        type: 'error',
        text1: 'Update failed',
        text2: 'Could not save your profile.',
      });
    } else {
      Toast.show({
        type: 'success',
        text1: 'Profile updated!',
        text2: 'Your profile information was saved successfully.',
      });
      router.replace('/(tabs)');
    }
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#0077cc" />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.container}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.emoji}>📝</Text>
        <Text style={styles.title}>Complete Your Profile</Text>

        <InputField
          label="Full Name"
          value={profile.full_name}
          onChangeText={(v) => handleChange('full_name', v)}
        />

        <InputField
          label="Gender (male / female / other)"
          value={profile.gender}
          onChangeText={(v) => handleChange('gender', v)}
        />

        <InputField
          label="Birth Date (YYYY-MM-DD)"
          value={profile.birth_date || ''}
          onChangeText={(v) => handleChange('birth_date', v)}
        />

        <InputField
          label="Height (cm)"
          keyboardType="numeric"
          value={profile.height_cm?.toString() || ''}
          onChangeText={(v) => handleChange('height_cm', v)}
        />

        <InputField
          label="Weight (kg)"
          keyboardType="numeric"
          value={profile.weight_kg?.toString() || ''}
          onChangeText={(v) => handleChange('weight_kg', v)}
        />

        <InputField
          label="Activity Level (sedentary / light / moderate / active / very_active)"
          value={profile.activity_level}
          onChangeText={(v) => handleChange('activity_level', v)}
        />

        <TouchableOpacity
          style={[styles.saveButton, saving && { opacity: 0.6 }]}
          onPress={handleSave}
          disabled={saving}
        >
          {saving ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.saveButtonText}>Save Profile</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

// Reusable input field component
const InputField = ({
  label,
  value,
  onChangeText,
  keyboardType = 'default',
}: {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  keyboardType?: 'default' | 'numeric';
}) => (
  <View style={styles.inputGroup}>
    <Text style={styles.label}>{label}</Text>
    <TextInput
      style={styles.input}
      value={value}
      onChangeText={onChangeText}
      placeholder={label}
      placeholderTextColor="#999"
      keyboardType={keyboardType}
    />
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
  },
  scrollContent: {
    alignItems: 'center',
    paddingVertical: 32,
    paddingHorizontal: 24,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emoji: {
    fontSize: 60,
    marginBottom: 10,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 24,
  },
  inputGroup: {
    width: '100%',
    marginBottom: 16,
  },
  label: {
    fontWeight: '600',
    color: '#444',
    marginBottom: 6,
  },
  input: {
    width: '100%',
    height: 48,
    backgroundColor: '#fff',
    borderRadius: 8,
    borderColor: '#ddd',
    borderWidth: 1,
    paddingHorizontal: 12,
    fontSize: 16,
    color: '#333',
  },
  saveButton: {
    width: '100%',
    backgroundColor: '#0077cc',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
