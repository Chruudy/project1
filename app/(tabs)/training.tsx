import { StyleSheet, Text, View } from 'react-native';

export default function TrainingScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.icon}>💪</Text>
      <Text style={styles.title}>Training</Text>
      <Text style={styles.description}>Plan and track your workouts here.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#fff',
  },
  icon: {
    fontSize: 48,
    marginBottom: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  description: {
    fontSize: 16,
    color: '#555',
    textAlign: 'center',
  },
});
