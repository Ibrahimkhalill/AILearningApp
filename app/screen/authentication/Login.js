import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import CustomCheckbox from "../component/CustomCheckbox";
import {
  Ionicons,
  MaterialCommunityIcons,
  FontAwesome,
} from "@expo/vector-icons";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";

export default function Login({ navigation }) {
  const [isChecked, setChecked] = useState(false);

  return (
    <ScrollView>
      <View style={styles.container}>
        <Image
          source={require("../../assets/login.png")} // Replace with your image
          style={styles.image}
          resizeMode="contain"
        />
        <Text style={styles.header}>Welcome Back!</Text>
        <Text style={styles.subHeader}>
          Start learning your favorite language
        </Text>

        <View style={styles.inputContainer}>
          <Text className="text-[#A4A4A4] mb-2">Email Address</Text>
          <View style={styles.inputWrapper}>
            <MaterialCommunityIcons
              name="email-outline"
              size={20}
              color="#888"
              style={styles.icon}
            />
            <TextInput
              style={styles.input}
              placeholder="Email Address"
              placeholderTextColor="#888"
            />
          </View>
          <Text className="text-[#A4A4A4] mb-2">Password</Text>
          <View style={styles.inputWrapper}>
            <Ionicons
              name="lock-closed-outline"
              size={20}
              color="#888"
              style={styles.icon}
            />
            <TextInput
              style={styles.input}
              placeholder="*************"
              secureTextEntry
              placeholderTextColor="#888"
            />
          </View>
        </View>

        <TouchableOpacity
          style={styles.checkboxContainer}
          onPress={() => navigation.navigate("ForgotPassword")}
        >
          <Text style={styles.checkboxLabel}>Forget Password?</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate("language")}
        >
          <LinearGradient
            colors={["#8E44AD", "#8E44AD"]}
            style={styles.gradientButton}
          >
            <Text style={styles.buttonText}>SIGN IN</Text>
          </LinearGradient>
        </TouchableOpacity>

        <Text style={styles.orText}>Or continue with</Text>

        <View style={styles.socialButtons}>
          <TouchableOpacity style={styles.socail_button}>
            <Ionicons name="logo-google" size={30} color="#DB4437" />
          </TouchableOpacity>

          {/* <TouchableOpacity style={styles.socail_button}>
            <MaterialCommunityIcons name="apple" size={30} color="#FFFFFF" />
          </TouchableOpacity> */}

          <TouchableOpacity style={styles.socail_button}>
            <FontAwesome5 name="facebook" size={30} color="#0A66C2" />
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
    alignItems: "center",
    padding: 20,
  },
  socail_button: {
    width: 60,
    height: 52,
    backgroundColor: "#1E1E1E",
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 8, // For Android shadow
    borderWidth: 1,
    borderColor: "#444",
  },
  image: {
    width: 350,
    height: 258,
    marginBottom: 10,
    marginLeft: 5,
  },
  header: {
    fontSize: 34,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 10,
  },
  subHeader: {
    fontSize: 14,
    color: "#AAAAAA",
    marginBottom: 30,
  },
  inputContainer: {
    width: "100%",
    marginBottom: 1,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1E1E1E",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 8, // For Android shadow
    borderRadius: 8,
    marginBottom: 15,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: "#444",
  },
  icon: {
    marginRight: 3,
  },
  input: {
    flex: 1,
    color: "#FFFFFF",
    padding: 15,
    fontSize: 14,
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    marginBottom: 20,
    width: "100%",
  },
  checkbox: {
    marginRight: 10,
  },
  checkboxLabel: {
    color: "#27AE60",
    fontSize: 12,
  },
  button: {
    width: "100%",
    borderRadius: 8,
    overflow: "hidden",
    marginBottom: 20,
  },
  gradientButton: {
    paddingVertical: 15,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  orText: {
    color: "#AAAAAA",
    marginBottom: 10,
  },
  socialButtons: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    width: "70%",
  },
});
