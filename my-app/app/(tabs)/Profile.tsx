// --- React Native User Profile Page ---
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, ScrollView, TouchableOpacity } from 'react-native';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

const BASE_URL = `http://${process.env.EXPO_PUBLIC_IPV4}:5000`;

interface UserData {
  name: string;
  email: string;
  is_subscribed?: boolean;
  stripe_customer_id?: string;
  createdAt?: string;
}

export default function ProfileScreen() {
  const { user } = useAuth();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.id) return;
    axios.get(`${BASE_URL}/api/users/${user.id}`)
      .then(res => setUserData(res.data))
      .catch(err => console.error('Failed to load profile:', err))
      .finally(() => setLoading(false));
  }, [user]);

  if (loading) {
    return <View style={styles.center}><ActivityIndicator size="large" /></View>;
  }

  if (!userData) {
    return <View style={styles.center}><Text>Unable to load user profile.</Text></View>;
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Profile</Text>
      <View style={styles.card}>
        <Text style={styles.label}>Name:</Text>
        <Text style={styles.value}>{userData.name}</Text>

        <Text style={styles.label}>Email:</Text>
        <Text style={styles.value}>{userData.email}</Text>

        {userData.stripe_customer_id && (
          <>
            <Text style={styles.label}>Stripe ID:</Text>
            <Text style={styles.value}>{userData.stripe_customer_id}</Text>
          </>
        )}

        <Text style={styles.label}>Subscription:</Text>
        <Text style={styles.value}>{userData.is_subscribed ? 'Active' : 'Inactive'}</Text>

        {userData.createdAt && (
          <>
            <Text style={styles.label}>Joined:</Text>
            <Text style={styles.value}>{new Date(userData.createdAt).toLocaleDateString()}</Text>
          </>
        )}
      </View>

      <TouchableOpacity style={styles.button}><Text style={styles.buttonText}>Edit Profile</Text></TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 16 },
  card: { backgroundColor: '#f4f4f4', padding: 16, borderRadius: 8, marginBottom: 20 },
  label: { fontWeight: '600', color: '#444' },
  value: { marginBottom: 12, fontSize: 16 },
  button: { backgroundColor: '#6B46C1', padding: 12, borderRadius: 6 },
  buttonText: { color: '#fff', textAlign: 'center', fontWeight: 'bold' }
});