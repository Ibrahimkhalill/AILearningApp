import React, { useEffect, useState } from "react";
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
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../component/Auth";
import ErrorModal from "../component/ErrorModal";
import axiosInstance from "../component/axiosInstance";
import * as WebBrowser from "expo-web-browser";
import LoadingOverlay from "../component/LoadingOverlay";
import { useTranslation } from "react-i18next"; // Import useTranslation

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
  const { t } = useTranslation(); // Initialize translation hook

  WebBrowser.maybeCompleteAuthSession();

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
      formErrors.email = t("email_required");
    } else if (!validateEmail(formData.email)) {
      formErrors.email = t("invalid_email");
    }

    if (!formData.password) {
      formErrors.password = t("password_required");
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
        login(
          formData.email,
          response.data.accessToken,
          response.data.refreshToken,
          response.data.user._id,
          response.data?.user?.language,
        );
        setIsLoading(false);
      }
    } catch (error) {
      if (error.response) {
        const serverErrors = error.response.data.message; // Adjust based on your API structure
        const formErrors = { email: "", password: "" };

        setErrors(formErrors);
        setErrorVisible(true);
        setError(serverErrors);
      } else {
        setErrorVisible(true);
        setError(t("network_error"));
      }
    } finally {
      setIsLoading(false);
    }
  };

  

  return (
    <SafeAreaView style={{ flexGrow: 1, backgroundColor:"#121212" }}>
      <View style={styles.container}>
        {isLoading && (
          <View style={styles.overlay}>
            <LoadingOverlay loading={isLoading} />
          </View>
        )}

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
          <Text style={styles.header}>{t("welcome_back")}</Text>
          <Text style={styles.subHeader}>{t("start_learning_favorite_language")}</Text>

          {/* Input Fields */}
          <View style={styles.inputContainer}>
            {/* Email */}
            <Text style={styles.label}>{t("email_address")}</Text>
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
                placeholder={t("email_placeholder")}
                placeholderTextColor="#888"
                value={formData.email}
                onChangeText={(value) => handleTextChange("email", value)}
                autoCapitalize="none"
              />
              {errors.email && (
                <Text style={[styles.errorText, { color: "red" }]}>
                  {errors.email}
                </Text>
              )}
            </View>

            {/* Password */}
            <Text style={styles.label}>{t("password")}</Text>
            <View
              style={[
                styles.inputWrapper,
                errors.password && { borderColor: "red" }, // Highlight border if error
              ]}
            >
              <Ionicons name="lock-closed-outline" size={20} color="#888" />
              <TextInput
                style={styles.input}
                placeholder={t("password_placeholder")}
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
                <Text style={[styles.errorText, { color: "red" }]}>
                  {errors.password}
                </Text>
              )}
            </View>
          </View>

          {/* Forgot Password */}
          <TouchableOpacity
            style={styles.checkboxContainer}
            onPress={() => navigation.navigate("ForgotPassword")}
          >
            <Text style={styles.checkboxLabel}>{t("forgot_password")}</Text>
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
                {isLoading ? t("signing_in") : t("sign_in")}
              </Text>
            </LinearGradient>
          </TouchableOpacity>

         
          <View style={{ flexDirection: "row", justifyContent: "center", paddingVertical: 10 }}>
            <Text style={{ color: "white", fontSize: 12 }}>{t("no_account")}</Text>
            <TouchableOpacity
              onPress={() => navigation.navigate("signup")}
            >
              <Text style={[styles.checkboxLabel, { marginLeft: 4 }]}>{t("signup")}</Text>
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
    position: "relative",
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.8)", // semi-transparent overlay
    justifyContent: "center",
    alignItems: "center",
    zIndex: 100,
  },
  image: {
    width: "100%",
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