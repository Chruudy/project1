import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
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

type Profile = {
  full_name: string;
  gender: string;
  birth_date: string;
  height_cm: string;
  weight_kg: string;
  activity_level: string;
};

export default function CompleteProfile() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [profile, setProfile] = useState<Profile>({
    full_name: '',
    gender: '',
    birth_date: '',
    height_cm: '',
    weight_kg: '',
    activity_level: '',
  });
  const [errors, setErrors] = useState<Partial<Profile>>({});

useEffect(() => {
  const fetchUserAndProfile = async () => {
    try {
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

      if (error && error.code === 'PGRST116') {
        // No profile exists, create a new one
        const { error: insertError } = await supabase
          .from('user_profiles')
          .insert({ id: user.id });
        if (insertError) {
          console.error('Error creating profile:', insertError.message);
        }
      } else if (profileData) {
        setProfile(profileData);
      }
    } catch (error) {
      console.error('Unexpected error:', error);
    } finally {
      setLoading(false);
    }
  };

  fetchUserAndProfile();
}, []);

const handleChange = (field: keyof Profile, value: string) => {
  setProfile((prev) => ({
    ...prev,
    [field]: field === 'height_cm' || field === 'weight_kg' ? value.replace(/[^0-9.]/g, '') : value,
  }));
  setErrors((prev) => ({ ...prev, [field]: '' })); // Clear errors on change
};

const validateProfile = (): boolean => {
  const newErrors: Partial<Profile> = {};
  if (!profile.full_name.trim()) newErrors.full_name = 'Full Name is required.';
  if (!String(profile.height_cm || '').trim()) newErrors.height_cm = 'Height is required.';
  if (!String(profile.weight_kg || '').trim()) newErrors.weight_kg = 'Weight is required.';
  if (!profile.gender) newErrors.gender = 'Gender is required.';
  if (!profile.activity_level) newErrors.activity_level = 'Activity Level is required.';
  setErrors(newErrors);
  return Object.keys(newErrors).length === 0;
};

 const handleSave = async () => {
  if (!userId) return;
  if (!validateProfile()) {
    Toast.show({
      type: 'error',
      text1: 'Validation Error',
      text2: 'Please fill in all required fields.',
    });
    return;
  }

  setSaving(true);

  const { error } = await supabase
    .from('user_profiles')
    .update({
      full_name: profile.full_name.trim(),
      gender: profile.gender || null,
      birth_date: profile.birth_date || null,
      height_cm: profile.height_cm ? parseFloat(profile.height_cm) : null,
      weight_kg: profile.weight_kg ? parseFloat(profile.weight_kg) : null,
      activity_level: profile.activity_level || null,
    })
    .eq('id', userId);

  setSaving(false);

  if (error) {
    console.error('Error saving profile:', error.message);
    Toast.show({
      type: 'error',
      text1: 'Update Failed',
      text2: 'Could not save your profile. Please try again.',
    });
  } else {
    Toast.show({
      type: 'success',
      text1: 'Profile Updated',
      text2: 'Your profile has been saved successfully.',
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
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.emoji}>🧾</Text>
        <Text style={styles.title}>Complete Your Profile</Text>

        <LabeledInput
          label="Full Name"
          value={profile.full_name}
          onChangeText={(v) => handleChange('full_name', v)}
          error={errors.full_name}
          required
        />

        <PickerInput
          label="Gender"
          selectedValue={profile.gender}
          onValueChange={(v) => handleChange('gender', v)}
          options={[
            { label: 'Select gender...', value: '' },
            { label: 'Male', value: 'male' },
            { label: 'Female', value: 'female' },
            { label: 'Other', value: 'other' },
          ]}
        />

        <DatePickerInput
          label="Birth Date"
          value={profile.birth_date}
          onChange={(date) => handleChange('birth_date', date)}
        />

        <LabeledInput
          label="Height (cm)"
          value={profile.height_cm}
          keyboardType="numeric"
          onChangeText={(v) => handleChange('height_cm', v)}
          error={errors.height_cm}
          required
        />

        <LabeledInput
          label="Weight (kg)"
          value={profile.weight_kg}
          keyboardType="numeric"
          onChangeText={(v) => handleChange('weight_kg', v)}
          error={errors.weight_kg}
          required
        />

        <PickerInput
          label="Activity Level"
          selectedValue={profile.activity_level}
          onValueChange={(v) => handleChange('activity_level', v)}
          options={[
            { label: 'Select activity level...', value: '' },
            { label: 'Sedentary – little exercise', value: 'sedentary' },
            { label: 'Lightly active – light exercise', value: 'light' },
            { label: 'Moderately active – exercise 3–5 days/week', value: 'moderate' },
            { label: 'Active – exercise daily', value: 'active' },
            { label: 'Very active – intense training', value: 'very_active' },
          ]}
        />

        <TouchableOpacity
          style={[styles.saveButton, saving && { opacity: 0.7 }]}
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

const LabeledInput: React.FC<{
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  error?: string;
  required?: boolean;
  keyboardType?: 'default' | 'numeric';
}> = ({ label, value, onChangeText, error, required = false, keyboardType = 'default' }) => (
  <View style={styles.inputGroup}>
    <Text style={styles.label}>
      {label} {required && <Text style={{ color: '#d9534f' }}>*</Text>}
    </Text>
    <TextInput
      style={[styles.input, error && { borderColor: '#d9534f' }]}
      value={value}
      onChangeText={onChangeText}
      placeholder={label}
      placeholderTextColor="#aaa"
      keyboardType={keyboardType}
    />
    {error && <Text style={styles.errorText}>{error}</Text>}
  </View>
);

const PickerInput: React.FC<{
  label: string;
  selectedValue: string;
  onValueChange: (value: string) => void;
  options: { label: string; value: string }[];
}> = ({ label, selectedValue, onValueChange, options }) => (
  <View style={styles.inputGroup}>
    <Text style={styles.label}>{label}</Text>
    <Picker
      selectedValue={selectedValue}
      onValueChange={onValueChange}
      style={styles.picker}
    >
      {options.map((option) => (
        <Picker.Item key={option.value} label={option.label} value={option.value} />
      ))}
    </Picker>
  </View>
);

const DatePickerInput: React.FC<{
  label: string;
  value: string;
  onChange: (date: string) => void;
}> = ({ label, value, onChange }) => {
  const [showDatePicker, setShowDatePicker] = useState(false);

  return (
    <View style={styles.inputGroup}>
      <Text style={styles.label}>{label}</Text>
      <TouchableOpacity
        style={styles.dateButton}
        onPress={() => setShowDatePicker(true)}
      >
        <Text style={styles.dateText}>
          {value ? new Date(value).toLocaleDateString() : 'Select your birth date'}
        </Text>
      </TouchableOpacity>
      {showDatePicker && (
        <DateTimePicker
          mode="date"
          display="spinner"
          value={value ? new Date(value) : new Date()}
          onChange={(event, date) => {
            setShowDatePicker(false);
            if (date) onChange(date.toISOString().split('T')[0]);
          }}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  scrollContent: { padding: 24 },
  emoji: { fontSize: 60, alignSelf: 'center', marginBottom: 10 },
  title: { fontSize: 24, fontWeight: '700', textAlign: 'center', color: '#333', marginBottom: 20 },
  inputGroup: { marginBottom: 18 },
  label: { fontWeight: '600', marginBottom: 6, color: '#444' },
  input: {
    height: 48,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    backgroundColor: '#fff',
    paddingHorizontal: 12,
    fontSize: 16,
    color: '#333',
  },
  picker: {
    backgroundColor: '#fff',
    borderRadius: 10,
  },
  dateButton: {
    height: 48,
    justifyContent: 'center',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#fff',
    paddingHorizontal: 12,
  },
  dateText: { fontSize: 16, color: '#333' },
  saveButton: {
    backgroundColor: '#0077cc',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 30,
  },
  saveButtonText: { color: '#fff', fontSize: 17, fontWeight: '700' },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  errorText: { color: '#d9534f', fontSize: 14, marginTop: 4 },
});
