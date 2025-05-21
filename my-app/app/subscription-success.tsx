
import { View, Text, StyleSheet } from 'react-native';

export default function SubscriptionSuccessScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>🎉 Subscription Successful!</Text>
      <Text style={styles.text}>You can now add events and grow your business.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 12 },
  text: { fontSize: 16, textAlign: 'center' },
});
