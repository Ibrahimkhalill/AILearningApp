import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  Alert,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../component/Auth";
import ErrorModal from "../component/ErrorModal";
import axiosInstance from "../component/axiosInstance";

export default function Login({ navigation }) {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [errorVisible, setErrorVisible] = useState(false);
  const { login, token } = useAuth();
  const [passwordVisible, setPasswordVisible] = useState(false); // For password visibility toggle
  // Handle field changes and validations
  const handleTextChange = (field, value) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      [field]: value,
    }));

    setErrors((prevErrors) => ({
      ...prevErrors,
      [field]: "", // Clear error for the field
    }));
  };

  // Validate email format
  const validateEmail = (email) => {
    const emailRegex = /\S+@\S+\.\S+/;
    return emailRegex.test(email);
  };

  // Handle Login Submission
  const handleUserLogin = async () => {
    const formErrors = {};

    // Validate fields
    if (!formData.email) {
      formErrors.email = "Email Address is required.";
    } else if (!validateEmail(formData.email)) {
      formErrors.email = "Invalid Email Address.";
    }

    if (!formData.password) {
      formErrors.password = "Password is required.";
    }

    // If there are errors, display them
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    setIsLoading(true);

    try {
      const response = await axiosInstance.post("/auth/login", {
        email: formData.email,
        password: formData.password,
      });

      if (response.status === 200) {
        console.log("response.data._id", response.data.user._id);

        login(
          formData.email,
          response.data.accessToken,
          response.data.refreshToken,
          response.data.user._id,
          response.data?.user?.language,
          navigation
        );
      } else {
        setErrorVisible(true);
        setError("Invalid email or password");
      }
    } catch (error) {
      if (error.response) {
        console.log("Error without response:", error);
        // If the server returned a response (e.g., 400 status)
        const serverErrors = error.response.data.message; // Adjust based on your API structure
        const formErrors = { email: "", password: "" };

        setErrors(formErrors);
        setErrorVisible(true);
        setError(serverErrors);
      } else {
        // Handle other types of errors (e.g., network issues)
        console.log("Error without response:", error.message);
        setErrorVisible(true);
        setError("Network error. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={{ flexGrow: 1 }}>
      <View style={styles.container}>
        <ScrollView
          contentContainerStyle={{ alignItems: "center" }}
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
          style={{ flexGrow: 1 }}
        >
          {/* Logo/Image */}
          <Image
            source={require("../../assets/login.png")} // Replace with your image
            style={styles.image}
            resizeMode="contain"
          />

          {/* Header */}
          <Text style={styles.header}>Welcome Back!</Text>
          <Text style={styles.subHeader}>
            Start learning your favorite language
          </Text>

          {/* Input Fields */}
          <View style={styles.inputContainer}>
            {/* Email */}
            <Text style={styles.label}>Email Address</Text>
            <View
              style={[
                styles.inputWrapper,
                errors.email && { borderColor: "red" }, // Highlight border if error
              ]}
            >
              <MaterialCommunityIcons
                name="email-outline"
                size={20}
                color="#888"
              />
              <TextInput
                style={styles.input}
                placeholder="Email Address"
                placeholderTextColor="#888"
                value={formData.email}
                onChangeText={(value) => handleTextChange("email", value)}
              />
              {errors.email && (
                <Text style={styles.errorText}>{errors.email}</Text>
              )}
            </View>

            {/* Password */}
            <Text style={styles.label}>Password</Text>
            <View
              style={[
                styles.inputWrapper,
                errors.password && { borderColor: "red" }, // Highlight border if error
              ]}
            >
              <Ionicons name="lock-closed-outline" size={20} color="#888" />
              <TextInput
                style={styles.input}
                placeholder="*************"
                secureTextEntry={!passwordVisible}
                placeholderTextColor="#888"
                value={formData.password}
                onChangeText={(value) => handleTextChange("password", value)}
              />
              <TouchableOpacity
                onPress={() => setPasswordVisible(!passwordVisible)}
              >
                <Ionicons
                  name={passwordVisible ? "eye-off" : "eye"}
                  size={20}
                  color="#888"
                />
              </TouchableOpacity>
              {errors.password && (
                <Text style={styles.errorText}>{errors.password}</Text>
              )}
            </View>
          </View>

          {/* Forgot Password */}
          <TouchableOpacity
            style={styles.checkboxContainer}
            onPress={() => navigation.navigate("ForgotPassword")}
          >
            <Text style={styles.checkboxLabel}>Forgot Password?</Text>
          </TouchableOpacity>

          {/* Login Button */}
          <TouchableOpacity
            style={styles.button}
            onPress={handleUserLogin}
            disabled={isLoading}
          >
            <LinearGradient
              colors={["#8E44AD", "#8E44AD"]}
              style={styles.gradientButton}
            >
              <Text style={styles.buttonText}>
                {isLoading ? "Signing In..." : "SIGN IN"}
              </Text>
            </LinearGradient>
          </TouchableOpacity>

          {/* Social Login */}
          <Text style={styles.orText}>Or continue with</Text>
          <View style={styles.socialButtons}>
            <TouchableOpacity style={styles.socialButton}>
              <Ionicons name="logo-google" size={30} color="#DB4437" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.socialButton}>
              <FontAwesome5 name="facebook" size={30} color="#0A66C2" />
            </TouchableOpacity>
          </View>
        </ScrollView>
        <ErrorModal
          message={error}
          isVisible={errorVisible}
          onClose={() => setErrorVisible(false)}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
    padding: 10,
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
    marginBottom: 20,
  },
  label: {
    color: "#A4A4A4",
    marginBottom: 5,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1E1E1E",
    paddingHorizontal: 10,
    borderRadius: 8,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#444",
  },
  input: {
    flex: 1,
    color: "#FFFFFF",
    padding: 15,
    fontSize: 14,
  },
  errorText: {
    position: "absolute",
    left: 0,
    bottom: -26,
    color: "red",
    fontSize: 12,
    marginBottom: 10,
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    marginBottom: 20,
    width: "100%",
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
  socialButton: {
    width: 60,
    height: 52,
    backgroundColor: "#1E1E1E",
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    elevation: 8,
    borderWidth: 1,
    borderColor: "#444",
  },
});
