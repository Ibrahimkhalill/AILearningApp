import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  SafeAreaView,
  ActivityIndicator,
  ToastAndroid,
  Platform,
} from "react-native";
import CircularButton from "../component/BackButton";
import {
  Ionicons,
  MaterialCommunityIcons,
  FontAwesome,
} from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import axiosInstance from "../component/axiosInstance";
const ForgotPassword = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  function notifyMessage(msg) {
    if (Platform.OS === "android") {
      ToastAndroid.showWithGravityAndOffset(
        msg,
        ToastAndroid.SHORT,
        ToastAndroid.TOP,
        25,
        160
      );
    } else {
      Alert.alert("Warning!", msg);
    }
  }

  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Basic email format validation
    return regex.test(email);
  };

  const handleForgotPassword = async () => {
    if (email.trim() === "") {
      setError("Email field cannot be empty");
      return;
    }

    if (!validateEmail(email)) {
      setError("Please enter a valid email address");
      return;
    }

    setError(""); // Clear any previous errors
    setIsLoading(true);

    try {
      const response = await axiosInstance.post(`/auth/password/reset`, {
        email,
      });

      if (response.status === 200) {
        notifyMessage("OTP sent successfully. Please check your email.");
        navigation.navigate("OTPVerificationScreen", {
          email: email,

          // Add other data you want to send
        }); // Navigate to the OTP verification screen
      } else {
        notifyMessage(response.data.message || "Failed to send OTP.");
      }
    } catch (error) {
      console.log("response", error);
      notifyMessage(
        "Error: " + (error.response?.data?.message || error.message)
      );
    } finally {
      setIsLoading(false);
    }
  };
  const handleOnchange = (onText) => {
    setEmail(onText);
    setError("");
  };

  const handleLogin = () => {
    navigation.navigate("login");
  };

  return (
    <SafeAreaView style={{ flexGrow: 1 }}>
      <View style={styles.container}>
        <View style={styles.backButton}>
          {/* Add back button logic */}
          <CircularButton navigation={navigation} />
        </View>

        {/* Replace with the globe image from your assets */}
        <View style={styles.iconWrapper}>
          <Image
            source={require("../../assets/main_logo.png")} // Replace with your image
            style={styles.icon}
          />
        </View>

        <Text style={styles.title}>Forgot Password?</Text>
        <Text style={styles.subtitle}>
          Don't worry! It occurs. Please enter the email address linked with
          your account.
        </Text>

        <View>
          <Text className="text-[#A4A4A4] mb-2">Email Address</Text>
          <View style={styles.inputWrapper}>
            <MaterialCommunityIcons
              name="email-outline"
              size={20}
              color="#888"
            />
            <TextInput
              style={styles.input}
              placeholder="Email Address"
              placeholderTextColor="#888"
              onChangeText={handleOnchange}
              value={email}
            />
          </View>
          {error ? <Text style={styles.errorText}>{error}</Text> : null}
        </View>

        <TouchableOpacity
          style={styles.sendButton}
          onPress={handleForgotPassword}
        >
          <LinearGradient
            colors={["#8E44AD", "#8E44AD"]}
            style={styles.gradientButton}
          >
            {isLoading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={styles.sendButtonText}>SEND</Text>
            )}
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity onPress={handleLogin}>
          <Text style={styles.loginText}>
            Remember Password? <Text style={styles.loginLink}>Login</Text>
          </Text>
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
  errorText: {
    color: "#E91111",
    fontSize: 12,
    marginTop: -5,
    left: 0,
    marginBottom: 10,
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

export default ForgotPassword;
