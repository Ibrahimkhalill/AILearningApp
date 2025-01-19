import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

export default function WelcomeScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Image
          source={require("../assets/logo.png")} // Replace with your actual logo image
          style={styles.logo}
          resizeMode="contain"
        />
      </View>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("signup")}
      >
        <LinearGradient
          colors={["#7F00FF", "#E100FF"]}
          style={styles.gradientButton}
        >
          <Text style={styles.buttonText}>GET STARTED</Text>
        </LinearGradient>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.outlineButton}
        onPress={() => navigation.navigate("login")}
      >
        <Text style={styles.outlineButtonText}>ALREADY HAVE AN ACCOUNT</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 40,
  },
  logo: {
    width: 300,
    height: 300,
    marginBottom: 10,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#7F00FF",
  },
  subtitle: {
    fontSize: 16,
    color: "#FFFFFF",
    textTransform: "uppercase",
    letterSpacing: 2,
  },
  button: {
    width: "100%",
    borderRadius: 1,
    overflow: "hidden",
    marginBottom: 15,
  },
  gradientButton: {
    paddingVertical: 15,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  outlineButton: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#8E44AD",
    borderRadius: 10,
    paddingVertical: 15,
    justifyContent: "center",
    alignItems: "center",
  },
  outlineButtonText: {
    color: "#8E44AD",
    fontSize: 16,
    fontWeight: "bold",
  },
});
