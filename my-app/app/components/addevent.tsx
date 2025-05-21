// --- React Native Add Event (Multistep with Azure Upload in TypeScript) ---
import React, { JSX, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';

const BASE_URL = `http://${process.env.EXPO_PUBLIC_IPV4}:5000`;

interface FormState {
  title: string;
  type: string;
  location: string;
  email: string;
  phone: string;
  subeventName: string;
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
}

export default function AddEventScreen(): JSX.Element {
  const [step, setStep] = useState<number>(0);
  const [form, setForm] = useState<FormState>({
    title: '',
    type: '',
    location: '',
    email: '',
    phone: '',
    subeventName: '',
    startDate: '',
    endDate: '',
    startTime: '',
    endTime: '',
  });
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);

  const handleChange = (key: keyof FormState, value: string) => setForm(prev => ({ ...prev, [key]: value }));

  const handlePickAndUpload = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.All });
    if (result.canceled) return;
    const file = result.assets[0];
    const filename = file.uri.split('/').pop() || 'file.jpg';

    try {
      const { data } = await axios.post(`${BASE_URL}/api/azure/generate-azure-upload-url`, {
        filename,
        filetype: file.mimeType || 'image/jpeg'
      });

      const blob = await fetch(file.uri).then(r => r.blob());
      await fetch(data.uploadUrl, {
        method: 'PUT',
        headers: {
          'x-ms-blob-type': 'BlockBlob',
          'Content-Type': file.mimeType || 'image/jpeg',
        },
        body: blob
      });
      setUploadedFiles(prev => [...prev, data.blobUrl]);
    } catch (err) {
      console.error('Upload failed:', err);
      Alert.alert('Upload failed');
    }
  };

  const handleSubmit = async () => {
    try {
      await axios.post(`${BASE_URL}/api/events`, {
        ...form,
        media: uploadedFiles,
      });
      setStep(3);
    } catch (err) {
      console.error('Submit failed:', err);
      Alert.alert('Failed to upload event');
    }
  };

  const StepIndicator = (): JSX.Element => (
    <View style={styles.stepRow}>
      {['Event Details', 'Media', 'Subevents', 'Success'].map((s, i) => (
        <Text key={i} style={[styles.step, step >= i && styles.activeStep]}>{s}</Text>
      ))}
    </View>
  );

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Add a Event/Location</Text>
      <StepIndicator />

      {step === 0 && (
        <>
          {(['title', 'type', 'location', 'email', 'phone'] as (keyof FormState)[]).map((key) => (
            <TextInput
              key={key}
              placeholder={key.replace(/^[a-z]/, c => c.toUpperCase())}
              style={styles.input}
              value={form[key]}
              onChangeText={(val) => handleChange(key, val)}
            />
          ))}
          <TouchableOpacity style={styles.button} onPress={() => setStep(1)}><Text style={styles.btnText}>Next</Text></TouchableOpacity>
        </>
      )}

      {step === 1 && (
        <>
          <TouchableOpacity style={styles.uploadBox} onPress={handlePickAndUpload}>
            <Text style={{ textAlign: 'center' }}>Click to Upload Images or Videos</Text>
          </TouchableOpacity>
          <View>{uploadedFiles.map((u, i) => (<Text key={i}>{u}</Text>))}</View>
          <View style={styles.rowBtns}>
            <TouchableOpacity style={styles.button} onPress={() => setStep(0)}><Text style={styles.btnText}>Back</Text></TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={() => setStep(2)}><Text style={styles.btnText}>Next</Text></TouchableOpacity>
          </View>
        </>
      )}

      {step === 2 && (
        <>
          {(['subeventName', 'startDate', 'endDate', 'startTime', 'endTime'] as (keyof FormState)[]).map((key) => (
            <TextInput
              key={key}
              placeholder={key.replace(/([A-Z])/g, ' $1')}
              style={styles.input}
              value={form[key]}
              onChangeText={(val) => handleChange(key, val)}
            />
          ))}
          <View style={styles.rowBtns}>
            <TouchableOpacity style={styles.button} onPress={() => setStep(1)}><Text style={styles.btnText}>Back</Text></TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={handleSubmit}><Text style={styles.btnText}>Upload</Text></TouchableOpacity>
          </View>
        </>
      )}

      {step === 3 && (
        <View style={styles.successBox}>
          <Text style={{ fontSize: 28, color: 'green' }}>✓</Text>
          <Text style={{ marginTop: 16, textAlign: 'center' }}>Success! Event/Location has been added to the app.</Text>
          <TouchableOpacity style={styles.button}><Text style={styles.btnText}>Manage your Events</Text></TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20 },
  header: { fontSize: 22, fontWeight: 'bold', marginBottom: 16 },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 6, padding: 12, marginBottom: 12 },
  button: { backgroundColor: '#6B46C1', padding: 12, borderRadius: 6, margin: 4 },
  btnText: { color: '#fff', fontWeight: 'bold', textAlign: 'center' },
  stepRow: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: 20 },
  step: { color: '#aaa' },
  activeStep: { color: '#6B46C1', fontWeight: 'bold' },
  uploadBox: { borderWidth: 1, borderColor: '#aaa', padding: 40, marginVertical: 20, borderRadius: 8 },
  rowBtns: { flexDirection: 'row', justifyContent: 'space-between' },
  successBox: { alignItems: 'center', justifyContent: 'center', marginTop: 60 }
});