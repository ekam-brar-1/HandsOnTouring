import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          height: 60,
          borderTopWidth: 0.2,
          borderTopColor: '#ccc',
        },
        tabBarIcon: ({ color, size, focused }) => {
          let iconName: keyof typeof Ionicons.glyphMap = 'home';

          if (route.name === 'index') iconName = focused ? 'home' : 'home-outline';
          else if (route.name === 'map') iconName = focused ? 'map' : 'map-outline';
          else if (route.name === 'add') iconName = focused ? 'add-circle' : 'add-circle-outline';
          else if (route.name === 'profile') iconName = focused ? 'person' : 'person-outline';

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#4B60E6',
        tabBarInactiveTintColor: '#888',
      })}
    >
      <Tabs.Screen name="index" />
      <Tabs.Screen name="map" />
      <Tabs.Screen name="add" />
      <Tabs.Screen name="profile" />
    </Tabs>
  );
}
