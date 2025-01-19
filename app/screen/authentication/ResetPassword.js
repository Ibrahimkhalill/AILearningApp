import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  SafeAreaView,
} from "react-native";
import CircularButton from "../component/BackButton";
import {
  Ionicons,
  MaterialCommunityIcons,
  FontAwesome,
} from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
const ResetPassword = ({ navigation }) => {
  const [email, setEmail] = useState("");

  const handleSend = () => {
    navigation.navigate("OTPVerificationScreen");
  };

  const handleLogin = () => {
    navigation.navigate("login");
  };

  return (
    <SafeAreaView style={{ flexGrow: 1 }}>
      <View style={styles.container}>
        <View style={styles.backButton}>
          {/* Add back button logic */}
          <CircularButton />
        </View>

        {/* Replace with the globe image from your assets */}
        <View style={styles.iconWrapper}>
          <Image
            source={require("../../assets/main_logo.png")} // Replace with your image
            style={styles.icon}
          />
        </View>

        <Text style={styles.title}>Create new password</Text>
        <Text style={styles.subtitle}>
          Your new password must be unique from those previously used.
        </Text>

        <View>
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

        <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
          <LinearGradient
            colors={["#8E44AD", "#8E44AD"]}
            style={styles.gradientButton}
          >
            <Text style={styles.sendButtonText} className="uppercase">
              Reset password
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 50,
  },
  backButton: {
    width: "100%",
    alignItems: "flex-start",
  },

  backButtonText: {
    color: "#FFF",
    fontSize: 20,
  },
  iconWrapper: {
    marginBottom: 30,
    marginTop: 50,
  },
  icon: {
    width: 100,
    height: 100,
  },
  title: {
    color: "#FFF",
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  subtitle: {
    color: "#FFF",
    fontSize: 14,
    textAlign: "center",
    marginBottom: 40,
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
    width: "100%",
    height: 55,
  },

  input: {
    flex: 1,
    color: "#FFFFFF",

    fontSize: 14,
  },
  gradientButton: {
    paddingVertical: 15,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
    width: "100%",
  },
  sendButton: {
    width: "100%",
    marginVertical: 20,
  },
  sendButtonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  loginText: {
    color: "#FFF",
    fontSize: 14,
  },
  loginLink: {
    color: "#8E44AD",
    fontWeight: "bold",
  },
});

export default ResetPassword;
