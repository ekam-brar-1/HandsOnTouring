"use client";

import React, { useState } from "react";
import { View, Text, TextInput, Pressable, StyleSheet, Alert } from "react-native";
import { supabase } from "../lib/supabaseclient";
import { useRouter } from "expo-router";

export default function SignupScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");

  const handleSignup = async () => {
    if (!name) {
      Alert.alert("Error", "Name must be filled.");
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match.");
      return;
    }
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) {
      Alert.alert("Error Signing Up", error.message);
    } else {
      Alert.alert("Success", "Registered successfully!", [
        { text: "OK", onPress: () => router.replace("/(tabs)") }
      ]);
    }
  };

  const handleSignup2 = async () => {
    try {
      const response = await fetch(`http://${process.env.EXPO_PUBLIC_IPV4}:5000/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await response.json();
      console.log(data);
    } catch (err) {
      console.log(err);
    }
  };

  const handleSignup3 = () => {
    handleSignup();
    handleSignup2();
  };

  return (
    <View style={styles.container}>
      <Pressable style={styles.backButton} onPress={() => router.push("/login")}>
        <Text style={styles.backText}>BACK</Text>
      </Pressable>
      <Text style={styles.fillDetails}>Fill the details below for registration</Text>
      <View style={styles.card}>
        <Text>Email</Text>
        <TextInput
          style={styles.input}
          placeholder="Value"
          value={email}
          onChangeText={setEmail}
        />
        <Text>Password</Text>
        <TextInput
          style={styles.input}
          placeholder="Value"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
        <Text>Confirm Password</Text>
        <TextInput
          style={styles.input}
          placeholder="Retype Password"
          secureTextEntry
          value={confirmPassword}
          onChangeText={setConfirmPassword}
        />
        <Text>Name</Text>
        <TextInput
          style={styles.input}
          placeholder="Value"
          value={name}
          onChangeText={setName}
        />
        <Pressable style={styles.button} onPress={handleSignup3}>
          <Text style={styles.buttonText}>Register</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  backButton: {
    backgroundColor: "#6a4fc8",
    padding: 8,
    borderRadius: 4,
    marginBottom: 20,
  },
  backText: { color: "white", fontWeight: "600" },
  fillDetails: { marginBottom: 20, fontWeight: "600" },
  card: {
    width: "100%",
    padding: 20,
    borderWidth: 1,
    borderRadius: 8,
    borderColor: "#ccc",
    backgroundColor: "white",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginBottom: 12,
    borderRadius: 4,
  },
  button: {
    backgroundColor: "#6a4fc8",
    padding: 12,
    alignItems: "center",
    borderRadius: 4,
  },
  buttonText: { color: "white", fontWeight: "600" },
});
