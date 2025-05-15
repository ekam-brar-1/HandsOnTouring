import { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  StyleSheet,
  TextInput,
} from 'react-native';
import { useRouter } from 'expo-router';
import axios from 'axios';
import { Ionicons } from '@expo/vector-icons';
import * as network from 'expo-network';

export default function HomeScreen() {
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    axios
      .get(`http://${process.env.EXPO_PUBLIC_IPV4}:5000/api/locations`)
      .then(async (res) => {
        const locs = res.data;
       
        const updatedLocations = await Promise.all(
  locs.map(async (loc) => {
    try {
      const reviewRes = await axios.get(`http://${process.env.EXPO_PUBLIC_IPV4}:5000/api/reviews/${loc._id}`);
      const reviews = reviewRes.data;
      const averageRating =
        reviews.length > 0
          ? (reviews.reduce((acc, cur) => acc + cur.rating, 0) / reviews.length).toFixed(1)
          : "No reviews yet";
      return { ...loc, rating: averageRating };
    } catch (error) {
      console.error("Error fetching reviews for", loc._id, error);
      return { ...loc, rating: "No reviews yet" };
    }
  })
);

        setLocations(updatedLocations);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  console.log(process.env.EXPO_PUBLIC_IPV4);

  if (loading)
    return <ActivityIndicator size="large" style={{ marginTop: 100 }} />;

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Hands on Touring</Text>

      <View style={styles.searchBar}>
        <Ionicons name="search" size={18} color="#aaa" style={{ marginRight: 8 }} />
        <TextInput placeholder="Search" placeholderTextColor="#aaa" style={styles.searchInput} />
      </View>

      <Text style={styles.subHeader}>TOP PLACES</Text>

      <FlatList
        data={locations}
        keyExtractor={(item) => item._id}
        contentContainerStyle={{ paddingBottom: 100 }}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => router.push(`./place/${item._id}`)}>
            <View style={styles.card}>
              <Image source={{ uri: item.media[0] }} style={styles.cardImage} />
              <View style={{ flex: 1 }}>
                <Text style={styles.cardTitle}>{item.name}</Text>
                <View style={styles.iconRow}>
                  <Ionicons name="location" size={16} color="tomato" />
                  <Text style={styles.cardText}>{item.location}</Text>
                </View>
                <View style={styles.iconRow}>
                  <Ionicons name="star" size={16} color="tomato" />
                  <Text style={styles.cardText}>{item.rating}</Text>
                </View>
              </View>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#F7F7F7',
  },
  header: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    marginTop: 20,
  },
  searchBar: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 10,
    paddingLeft: 14,
    marginVertical: 14,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    elevation: 2,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#333',
  },
  subHeader: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 12,
    color: '#222',
    textAlign: 'center',
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 10,
    marginBottom: 14,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 4,
    elevation: 3,
  },
  cardImage: {
    width: 70,
    height: 70,
    borderRadius: 12,
    marginRight: 10,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 4,
  },
  cardText: {
    marginLeft: 4,
    fontSize: 13,
    color: '#555',
  },
  iconRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
});
