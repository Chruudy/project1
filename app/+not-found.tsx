// This file defines a custom 404 Not Found page for an Expo Router application.
// Running-themed design for users who navigate to a non-existent route.

import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

const runningQuotes = [
  "You ran too far and lost your way...",
  "Looks like you sprinted off the track!",
  "This route isn’t on the map yet.",
  "You’ve outrun the trail markers.",
  "The finish line is nowhere in sight.",
  "This path leads to uncharted territory.",
];

function getRandomQuote() {
  return runningQuotes[Math.floor(Math.random() * runningQuotes.length)];
}

export default function NotFound() {
  const router = useRouter();
  const quote = getRandomQuote();

  return (
    <View style={styles.container}>
      <Text style={styles.emoji}>🏃‍♂️</Text>
      <Text style={styles.title}>You Ran Too Far!</Text>
      <Text style={styles.message}>{quote}</Text>
      <Text style={styles.submessage}>Let’s get you back on track.</Text>

      <Pressable style={styles.button} onPress={() => router.replace('/(tabs)')}>
        <Text style={styles.buttonText}>🏁 Back to the Starting Line</Text>
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
    color: '#333',
  },
  submessage: {
    fontSize: 14,
    marginBottom: 24,
    textAlign: 'center',
    color: '#555',
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