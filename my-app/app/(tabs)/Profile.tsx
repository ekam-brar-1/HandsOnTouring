// --- React Native Profile Page with Design ---
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Switch, Alert } from 'react-native';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { Ionicons, MaterialIcons, Feather } from '@expo/vector-icons';
import { router } from 'expo-router';

const BASE_URL = `http://${process.env.EXPO_PUBLIC_IPV4}:5000`;

interface UserData {
  name: string;
  email: string;
  is_subscribed?: boolean;
  stripe_customer_id?: string;
  createdAt?: string;
}

export default function ProfileScreen() {
  const { user, logout } = useAuth();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    if (!user?.id) return;
    axios.get(`${BASE_URL}/api/users/${user.id}`)
      .then(res => setUserData(res.data))
      .catch(err => console.error('Failed to load profile:', err))
      .finally(() => setLoading(false));
  }, [user]);

  const handleLogout = () => {
    logout();
  };

  const handleToggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  if (loading) {
    return <View style={styles.center}><Text>Loading...</Text></View>;
  }

  if (!userData) {
    return <View style={styles.center}><Text>User not found.</Text></View>;
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.profileCard}>
        <Image source={{ uri: 'https://api.dicebear.com/7.x/thumbs/svg?seed=profile' }} style={styles.avatar} />
        <Text style={styles.profileName}>{userData.name}</Text>
        <Text style={styles.profileUsername}>@{userData.email.split('@')[0]}</Text>
      </View>

      <View style={styles.section}>
        <MenuItem icon={<Ionicons name="person-outline" size={20} color="#6B46C1" />} label="My Account" sub="Make changes to your account" hasAlert onPress={() => router.push('/account/EditAccount')} />
        <MenuItem icon={<MaterialIcons name="favorite-border" size={20} color="#6B46C1" />} label="Favorites" sub="Manage Favorites" onPress={() => router.push('/account/Favorites')}
 />
        <MenuItem
          icon={<Feather name="moon" size={20} color="#6B46C1" />}
          label="Dark Mode"
          switchToggle
          switchValue={darkMode}
          onSwitchToggle={handleToggleDarkMode}
        />
        <MenuItem icon={<Feather name="globe" size={20} color="#6B46C1" />} label="Language" onPress={() => Alert.alert('Language Settings')} />
        <MenuItem icon={<Feather name="log-out" size={20} color="#6B46C1" />} label="Log out" onPress={handleLogout} />
      </View>

      <View style={styles.section}>
        <MenuItem icon={<Ionicons name="help-circle-outline" size={20} color="#6B46C1" />} label="Support" sub="Contact Support" onPress={() => Alert.alert('Support')} />
      </View>
    </ScrollView>
  );
}

function MenuItem({ icon, label, sub, hasAlert = false, onPress, switchToggle = false, switchValue = false, onSwitchToggle }: any) {
  return (
    <TouchableOpacity onPress={onPress} style={styles.menuItem}>
      <View style={styles.menuLeft}>
        {icon}
        <View style={{ marginLeft: 12 }}>
          <Text style={styles.menuLabel}>{label}</Text>
          {sub && <Text style={styles.menuSub}>{sub}</Text>}
        </View>
      </View>
      {switchToggle ? (
        <Switch value={switchValue} onValueChange={onSwitchToggle} />
      ) : (
        <View style={styles.menuRight}>
          {hasAlert && <View style={styles.alertDot} />}
          <Feather name="chevron-right" size={18} color="#aaa" />
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  profileCard: { alignItems: 'center', marginBottom: 20 },
  avatar: { width: 80, height: 80, borderRadius: 40, marginBottom: 8 },
  profileName: { fontSize: 18, fontWeight: 'bold' },
  profileUsername: { color: '#888' },
  section: { backgroundColor: '#f9f9f9', borderRadius: 10, marginVertical: 10, padding: 8 },
  menuItem: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 12, paddingHorizontal: 8 },
  menuLeft: { flexDirection: 'row', alignItems: 'center' },
  menuLabel: { fontSize: 16, fontWeight: '500' },
  menuSub: { fontSize: 12, color: '#777' },
  menuRight: { flexDirection: 'row', alignItems: 'center' },
  alertDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: 'red', marginRight: 6 }
});