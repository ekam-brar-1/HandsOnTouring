"use client";

import React, { useState } from "react";
import { View, Text, TextInput, Pressable, StyleSheet, Alert } from "react-native";
import { supabase } from "../lib/supabaseclient";
import { useRouter } from "expo-router";

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleLogin = async () => {
    if (!email || !password) {
      setErrorMessage("Please enter both email and password.");
      Alert.alert("Error", "Please enter both email and password.");
      return;
    }
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      setErrorMessage("Failed to sign in: " + error.message);
      Alert.alert("Login Error", "Failed to sign in: " + error.message);
    } else {
      setErrorMessage("");
      Alert.alert("Success", "Logged in successfully!", [
        { text: "OK", onPress: () => router.replace("/(tabs)") }
      ]);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.welcome}>WELCOME TO</Text>
      <Text style={styles.brand}>HANDS ON TOURING</Text>
      <Text style={styles.signin}>Sign In</Text>
      <View style={styles.card}>
        {errorMessage !== "" && <Text style={styles.error}>{errorMessage}</Text>}
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
        <Pressable style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Sign In</Text>
        </Pressable>
        <Pressable onPress={() => {}}>
          <Text style={styles.link}>Forgot password?</Text>
        </Pressable>
        <Text style={styles.footerText}>New to Destination History</Text>
        <Pressable onPress={() => router.push("/signup")}>
          <Text style={styles.link}>Create Account</Text>
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
  welcome: {
    fontSize: 18,
    fontWeight: "500",
  },
  brand: {
    fontSize: 20,
    color: "#6a4fc8",
    fontWeight: "bold",
    marginBottom: 10,
  },
  signin: {
    marginBottom: 10,
  },
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
    marginBottom: 10,
  },
  buttonText: {
    color: "white",
    fontWeight: "600",
  },
  link: {
    color: "#6a4fc8",
    marginTop: 4,
    textAlign: "center",
  },
  footerText: {
    marginTop: 10,
    textAlign: "center",
  },
  error: {
    color: "red",
    marginBottom: 10,
    textAlign: "center",
  },
});
