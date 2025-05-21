// app/account/edit.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

const BASE_URL = `http://${process.env.EXPO_PUBLIC_IPV4}:5000`;

export default function EditAccount() {
  const { user } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  useEffect(() => {
    if (!user?.id) return;
    axios.get(`${BASE_URL}/api/users/${user.id}`).then(res => {
      setName(res.data.name);
      setEmail(res.data.email);
    });
  }, [user]);

  const handleSave = async () => {
    try {
      await axios.put(`${BASE_URL}/api/users/${user.id}`, { name, email });
      Alert.alert('Success', 'Profile updated');
    } catch (err) {
      Alert.alert('Error', 'Failed to update profile');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Edit Account</Text>
      <TextInput placeholder="Name" value={name} onChangeText={setName} style={styles.input} />
      <TextInput placeholder="Email" value={email} onChangeText={setEmail} style={styles.input} />
      <Button title="Save Changes" onPress={handleSave} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20 },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 16 },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 12, marginBottom: 16, borderRadius: 8 },
});
