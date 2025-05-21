// app/account/favorites.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

const BASE_URL = `http://${process.env.EXPO_PUBLIC_IPV4}:5000`;

export default function FavoritesScreen() {
  const { user } = useAuth();
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    if (!user?.id) return;
    axios.get(`${BASE_URL}/api/favorites/user/${user.id}`).then(res => {
      setFavorites(res.data);
    });
  }, [user]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your Favorites</Text>
      <FlatList
        data={favorites}
        keyExtractor={(item, index) => item._id || index.toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.name}>{item.title || 'No Title'}</Text>
            <Text style={styles.detail}>{item.description || 'No Description'}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20 },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 16 },
  card: { padding: 16, backgroundColor: '#f4f4f4', borderRadius: 8, marginBottom: 12 },
  name: { fontWeight: '600', fontSize: 16 },
  detail: { fontSize: 14, color: '#666' },
});
