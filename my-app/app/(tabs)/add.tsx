import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import axios from 'axios';
import { useRouter } from 'expo-router';
import { useAuth } from '../../context/AuthContext';

// Configure this to your backend URL (development or production)
const BASE_URL = `http://${process.env.EXPO_PUBLIC_IPV4}:5000`;

type BusinessStatus = 'none' | 'pending' | 'approved' | 'subscribed';

export default function AddScreen() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [status, setStatus] = useState<BusinessStatus>('none');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;
    if (!user?.id) {
      setStatus('none');
      setLoading(false);
      return;
    }
    axios
      .get<{ status: BusinessStatus }>(
        `${BASE_URL}/api/business/status/${user.id}`
      )
      .then(res => setStatus(res.data.status))
      .catch(err => console.error('Status fetch error:', err))
      .finally(() => setLoading(false));
  }, [user, authLoading]);

  if (authLoading || loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  switch (status) {
    case 'none':
      return <BusinessDetailsForm onSubmitted={() => setStatus('pending')} />;
    case 'pending':
      return <WaitingApproval />;
    case 'approved':
      return <SubscriptionScreen onSubscribed={() => setStatus('subscribed')} />;
    case 'subscribed':
      return <AddEventScreen />;
    default:
      return (
        <View style={styles.center}>
          <Text>Unexpected status: {status}</Text>
        </View>
      );
  }
}

interface FormProps {
  onSubmitted: () => void;
}

function BusinessDetailsForm({ onSubmitted }: FormProps) {
  const { user } = useAuth();
  const [form, setForm] = useState({
    ownerName: '',
    businessName: '',
    businessType: '',
    locationAddress: '',
    enquiryEmail: '',
    phone: '',
  });
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (key: keyof typeof form, value: string) => {
    setForm(prev => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async () => {
    if (!user?.id) return;
    setSubmitting(true);
    try {
      await axios.post(
        `${BASE_URL}/api/business/request`,
        { ...form, userId: user.id }
      );
      onSubmitted();
    } catch (err) {
      console.error('Request error:', err);
      alert('Failed to submit request.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.formContainer}>
      <Text style={styles.title}>Add Business Details</Text>
      {(
        Object.entries(form) as [keyof typeof form, string][]
      ).map(([key, value]) => (
        <TextInput
          key={key}
          style={styles.input}
          placeholder={key.replace(/([A-Z])/g, ' $1')}
          value={value}
          onChangeText={text => handleChange(key, text)}
          keyboardType={ key === 'enquiryEmail' ? 'email-address' : key === 'phone' ? 'phone-pad' : 'default' }
        />
      ))}
      <TouchableOpacity
        style={[styles.button, submitting && styles.disabledButton]}
        onPress={handleSubmit}
        disabled={submitting}
      >
        <Text style={styles.buttonText}>
          {submitting ? 'Submitting...' : 'Request For Approval'}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

function WaitingApproval() {
  const router = useRouter();
  return (
    <View style={styles.center}>
      <Text style={styles.header}>Waiting for Approval</Text>
      <View style={styles.card}>
        <Text style={styles.cardText}>
          Please check back later!{`\n`}Your request will be approved shortly.
        </Text>
      </View>
      <TouchableOpacity
        style={styles.smallButton}
        onPress={() => router.push('/')}
      >
        <Text style={styles.smallButtonText}>Home</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.smallButton} onPress={() => { /* support */ }}>
        <Text style={styles.smallButtonText}>Contact Support</Text>
      </TouchableOpacity>
    </View>
  );
}

interface SubscriptionProps {
  onSubscribed: () => void;
}

function SubscriptionScreen({ onSubscribed }: SubscriptionProps) {
  const { user } = useAuth();
  const [processing, setProcessing] = useState(false);

  const handleSubscribe = async () => {
    if (!user?.id) return;
    setProcessing(true);
    try {
      await axios.post(
        `${BASE_URL}/api/business/subscribe`,
        { userId: user.id }
      );
      onSubscribed();
    } catch (err) {
      console.error('Subscribe error:', err);
      alert('Subscription failed.');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <View style={styles.center}>
      <Text style={styles.header}>Grow Your Business With Destination History</Text>
      <View style={styles.card}>
        <Text style={styles.planName}>Business</Text>
        <Text style={styles.price}>$9.99/mo</Text>
        <Text style={styles.planItem}>Your Event on Home page</Text>
        <Text style={styles.planItem}>Add Media to your Event</Text>
        <Text style={styles.planItem}>Insights of your events</Text>
      </View>
      <TouchableOpacity
        style={[styles.button, processing && styles.disabledButton]}
        onPress={handleSubscribe}
        disabled={processing}
      >
        <Text style={styles.buttonText}>
          {processing ? 'Processing...' : 'Subscribe'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

function AddEventScreen() {
  return (
    <View style={styles.center}>
      <Text style={styles.header}>Add Your Event</Text>
      {/* TODO: navigate to your event creation form */}
    </View>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  formContainer: { padding: 16 },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 16, textAlign: 'center' },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  button: {
    backgroundColor: '#6B46C1',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  disabledButton: { opacity: 0.6 },
  buttonText: { color: '#fff', fontWeight: 'bold' },
  smallButton: {
    backgroundColor: '#6B46C1',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 6,
    marginTop: 12,
  },
  smallButtonText: { color: '#fff', fontWeight: '600' },
  card: {
    backgroundColor: '#f9f9f9',
    padding: 16,
    borderRadius: 8,
    marginVertical: 16,
    width: '100%',
  },
  cardText: { fontSize: 16, textAlign: 'center' },
  header: { fontSize: 22, fontWeight: 'bold', marginBottom: 12, textAlign: 'center' },
  planName: { fontSize: 18, fontWeight: '600' },
  price: { fontSize: 24, fontWeight: 'bold', marginVertical: 8 },
  planItem: { fontSize: 16, marginVertical: 4 },
});
