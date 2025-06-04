// This file defines a custom 404 Not Found page for an Expo Router application.
// Acts as an easter egg for users who navigate to a non-existent route.

import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

const npcQuotes = [
  "Looks like you've wandered off the map...",
  "You’ve stepped into an unknown realm.",
  "Nothing here but fog and confusion.",
  "The narrator whispers: “This path leads nowhere.”",
  "This page must’ve been devoured by a mimic.",
  "This area hasn’t been unlocked yet.",
];

function getRandomQuote() {
  return npcQuotes[Math.floor(Math.random() * npcQuotes.length)];
}

export default function NotFound() {
  const router = useRouter();
  const quote = getRandomQuote();

  return (
    <View style={styles.container}>
      <Text style={styles.emoji}>🧭</Text>
      <Text style={styles.title}>Page Not Found</Text>
      <Text style={styles.message}>{quote}</Text>
      <Text style={styles.submessage}>Let’s guide you back to Safety.</Text>

      <Pressable style={styles.button} onPress={() => router.replace('/(tabs)')}>
        <Text style={styles.buttonText}>🏕️Back to Safety</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  emoji: {
    fontSize: 60,
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  message: {
    fontSize: 16,
    fontStyle: 'italic',
    textAlign: 'center',
    marginBottom: 8,
  },
  submessage: {
    fontSize: 14,
    marginBottom: 24,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#0077cc',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
});
