import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function PasswordChanged({ navigation }) {
  return (
    <View style={styles.container}>
      {/* Success Icon */}
      <View style={styles.iconContainer}>
        <Image
          source={require("../../assets/Sticker.png")}
          resizeMode="contain"
        />
      </View>

      {/* Title */}
      <Text style={styles.title}>Password Changed!</Text>

      {/* Subtitle */}
      <Text style={styles.subtitle}>
        Your password has been changed successfully.
      </Text>

      {/* Back to Login Button */}
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("login")} // Replace "Login" with your actual login screen name
      >
        <Text style={styles.buttonText}>BACK TO LOGIN</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212", // Dark background
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  iconContainer: {
    backgroundColor: "#8E44AD", // Purple background for icon
    borderRadius: 50,
    padding: 20,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 10,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 14,
    color: "#aaa",
    textAlign: "center",
    marginBottom: 30,
  },
  button: {
    backgroundColor: "#8E44AD",
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 8,
    width: "80%",
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
