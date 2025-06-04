import { Slot } from 'expo-router';
import Toast from 'react-native-toast-message';
import { AuthProvider } from '../providers/AuthProvider';

export default function RootLayout() {
  return (
    <AuthProvider>
      <Slot />
      <Toast />
    </AuthProvider>
  );
}
// This is the root layout for the app, wrapping all screens with the AuthProvider to manage authentication state.