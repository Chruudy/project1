import Octicons from '@expo/vector-icons/Octicons';
import { Pressable, StyleSheet, View } from 'react-native';

export default function ChatButton({ onPress }: { onPress: () => void }) {
  return (
    <Pressable style={styles.container} onPress={onPress}>
      <View style={styles.iconWrapper}>
        <Octicons name="dependabot" size={28} color="white" />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 80,
    right: 20,
    backgroundColor: '#0077cc',
    padding: 14,
    borderRadius: 100,
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    zIndex: 100,
  },
  iconWrapper: {
    width: 28,
    height: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
// This component is a floating chat button that can be used to navigate to a chat screen.
// It uses Ionicons for the chat icon and is styled to be a circular button with a shadow effect.