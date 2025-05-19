// screens/SubscribeScreen.tsx
import React from 'react';
import { Button, Alert } from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import axios from 'axios';

interface SubscribeScreenProps {
  user: {
    email: string;
    stripe_customer_id?: string | null;
  };
}

const SubscribeScreen: React.FC<SubscribeScreenProps> = ({ user }) => {
  const handleSubscribe = async () => {
    try {
      const response = await axios.post<{ url: string }>(
        'https://your-api.com/create-subscription',
        {
          email: user.email,
          customerId: user.stripe_customer_id || null,
        }
      );

      const sessionUrl = response.data.url;

      if (sessionUrl) {
        await WebBrowser.openBrowserAsync(sessionUrl);
      } else {
        Alert.alert('Failed to start subscription');
      }
    } catch (err) {
      console.error('Subscription error:', err);
      Alert.alert('Error', 'Could not create subscription');
    }
  };

  return <Button title="Subscribe $9.99/month" onPress={handleSubscribe} />;
};

export default SubscribeScreen;
