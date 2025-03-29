import React, { useState, useEffect, useRef } from "react";
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
import axiosInstance from "../component/axiosInstance";
import * as WebBrowser from "expo-web-browser";
import { useAuth } from "../component/Auth";
import LoadingOverlay from "../component/LoadingOverlay";
import { useTranslation } from "react-i18next"; // Import useTranslation

const passwordCriteria = [
  {
    label: "At least 8 characters.",
    check: (password) => password.length >= 8,
  },
  {
    label: "Contains at least one letter.",
    check: (password) => /[A-Za-z]/.test(password),
  },
  {
    label: "Contains at least one digit.",
    check: (password) => /\d/.test(password),
  },
  {
    label: "Contains at least one special character.",
    check: (password) => /[@$!%*?&]/.test(password),
  },
];

const PasswordCriteriaComponent = ({ password }) => {
  const { t } = useTranslation(); // Initialize translation hook for PasswordCriteriaComponent

  return (
    <View style={styles.criteriaContainer}>
      {passwordCriteria.map((criterion, index) => {
        const isValid = criterion.check(password);
        return (
          <View key={index} style={styles.criteriaItem}>
            <Ionicons
              name={isValid ? "checkmark-circle" : "close-circle"}
              size={16}
              color={isValid ? "green" : "red"}
              style={{ marginRight: 5 }}
            />
            <Text style={{ color: isValid ? "green" : "red" }}>
              {t(`password_criteria_${index + 1}`)} {/* Translate each criterion */}
            </Text>
          </View>
        );
      })}
    </View>
  );
};

export default function Signup({ navigation }) {
  const [formData, setFormData] = useState({
    userName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const { t } = useTranslation(); // Initialize translation hook
  WebBrowser.maybeCompleteAuthSession();
  const [errors, setErrors] = useState({});
  const [isChecked, setChecked] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [ConfirmpasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [emailExitError, setEmailExitError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login, token } = useAuth();

  const debounceTimeout = useRef(null);

  const checkEmailAvailability = (emailToCheck) => {
    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }

    debounceTimeout.current = setTimeout(async () => {
      try {
        const response = await axiosInstance.post("/auth/check-email", {
          email: emailToCheck,
        });
        if (response.data.exists) {
          setEmailExitError(t("email_already_registered"));
        }
      } catch (error) {
        console.log("Error checking email availability:", error);
        setErrors((prevErrors) => ({
          ...prevErrors,
          email: t("email_verify_error"),
        }));
      }
    }, 500);
  };

  const validateEmailFormat = (email) => {
    const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return regex.test(email);
  };

  const handleTextChange = (field, value) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      [field]: value,
    }));

    setErrors((prevErrors) => ({ ...prevErrors, [field]: "" }));

    if (field === "email") {
      if (validateEmailFormat(value)) {
        checkEmailAvailability(value);
      } else {
        setErrors((prevErrors) => ({
          ...prevErrors,
          email: t("invalid_email"),
        }));
        setEmailExitError("");
      }
    }

    if (field === "password") {
      if (validatePasswordFormat(value)) {
        setErrors((prevErrors) => ({ ...prevErrors, password: "" }));
      } else {
        setErrors((prevErrors) => ({
          ...prevErrors,
          password: t("password_requirements"),
        }));
      }
    }

    if (field === "confirmPassword" && formData.confirmPassword) {
      if (value === formData.password) {
        setErrors((prevErrors) => ({ ...prevErrors, confirmPassword: "" }));
      } else {
        setErrors((prevErrors) => ({
          ...prevErrors,
          confirmPassword: t("passwords_do_not_match"),
        }));
      }
    }
  };

  useEffect(() => {
    if (formData.password && formData.confirmPassword) {
      if (formData.password === formData.confirmPassword) {
        setErrors((prevErrors) => ({ ...prevErrors, confirmPassword: "" }));
      } else {
        setErrors((prevErrors) => ({
          ...prevErrors,
          confirmPassword: t("passwords_do_not_match"),
        }));
      }
    }
  }, [formData.password, formData.confirmPassword]);

  const validatePasswordFormat = (password) => {
    return passwordCriteria.every((criterion) => criterion.check(password));
  };

  const handleUserSignup = async () => {
    const formErrors = {};

    if (!formData.userName) formErrors.userName = t("username_required");
    if (!formData.email) formErrors.email = t("email_required");
    if (!formData.password) formErrors.password = t("password_required");
    if (!formData.confirmPassword)
      formErrors.confirmPassword = t("confirm_password_required");

    if (formData.email && !validateEmailFormat(formData.email)) {
      formErrors.email = t("invalid_email");
    }
    if (formData.password && !validatePasswordFormat(formData.password)) {
      formErrors.password = t("password_requirements");
    }
    if (formData.password !== formData.confirmPassword) {
      formErrors.confirmPassword = t("passwords_do_not_match");
    }
    if (!isChecked) {
      Alert.alert(t("terms_not_accepted_title"), t("terms_not_accepted"));
      return;
    }

    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    try {
      setLoading(true);
      const response = await axiosInstance.post(`/auth/password/reset`, {
        email: formData.email,
      });

      if (response.status === 200) {
        navigation.navigate("OTP", {
          formData: formData,
        });
      }
    } catch (error) {
      if (error.response) {
        const errorMessage = error.response.data.error || t("invalid_request");
        console.log("Server error:", error.response);
        notifyMessage(errorMessage);
      } else {
        console.log("Error without response:", error.message);
        notifyMessage(t("network_error"));
      }
    } finally {
      setLoading(false);
    }
  };


  return (
    <ScrollView>
      <View style={styles.container}>
        {loading && (
          <View style={styles.overlay}>
            <LoadingOverlay loading={loading} />
          </View>
        )}

        <Image
          source={require("../../assets/signup.png")}
          style={styles.image}
          resizeMode="contain"
        />
        <Text style={styles.header}>{t("new_journey_starts")}</Text>
        <Text style={styles.subHeader}>{t("start_learning_favorite_language")}</Text>

        <View style={styles.inputContainer}>
          {/* User Name */}
          <Text style={styles.label}>{t("your_name")}</Text>
          <View
            style={[
              styles.inputWrapper,
              errors.userName && { borderColor: "red" },
            ]}
          >
            <Ionicons name="person-outline" size={20} color="#888" />
            <TextInput
              style={styles.input}
              placeholder={t("your_name_placeholder")}
              placeholderTextColor="#888"
              value={formData.userName}
              onChangeText={(value) => handleTextChange("userName", value)}
            />
          </View>
          {errors.userName && (
            <Text style={styles.errorText}>{errors.userName}</Text>
          )}

          {/* Email */}
          <Text style={styles.label}>{t("email_address")}</Text>
          <View
            style={[
              styles.inputWrapper,
              (emailExitError || errors.email) && { borderColor: "red" },
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
              autoCapitalize="none"
              onChangeText={(value) => handleTextChange("email", value)}
            />
          </View>
          {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
          {emailExitError && (
            <Text style={styles.errorText}>{emailExitError}</Text>
          )}

          {/* Password */}
          <Text style={styles.label}>{t("password")}</Text>
          <View
            style={[
              styles.inputWrapper,
              errors.password && { borderColor: "red" },
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
          </View>
          {errors.password && (
            <Text style={styles.errorText}>{errors.password}</Text>
          )}
          {errors.password && (
            <PasswordCriteriaComponent password={formData.password} />
          )}

          {/* Confirm Password */}
          <Text style={styles.label}>{t("confirm_password")}</Text>
          <View
            style={[
              styles.inputWrapper,
              errors.confirmPassword && { borderColor: "red" },
            ]}
          >
            <Ionicons name="lock-closed-outline" size={20} color="#888" />
            <TextInput
              style={styles.input}
              
              placeholder={t("password_placeholder")}
              secureTextEntry={!ConfirmpasswordVisible}
              placeholderTextColor="#888"
              value={formData.confirmPassword}
              onChangeText={(value) => handleTextChange("confirmPassword", value)}
            />
                  <TouchableOpacity
              onPress={() => setConfirmPasswordVisible(!ConfirmpasswordVisible)}
            >
              <Ionicons
                name={passwordVisible ? "eye-off" : "eye"}
                size={20}
                color="#888"
              />
            </TouchableOpacity>
          </View>
          {errors.confirmPassword && (
            <Text style={styles.errorText}>{errors.confirmPassword}</Text>
          )}
        </View>

        {/* Checkbox */}
        <View style={styles.checkboxContainer}>
          <TouchableOpacity
            onPress={() => setChecked(!isChecked)}
            style={styles.checkbox}
          >
            <Ionicons
              name={isChecked ? "checkbox" : "square-outline"}
              size={25}
              color="#fff"
            />
          </TouchableOpacity>
          <Text style={styles.checkboxLabel}>
            {t("accept_terms_and_privacy")}
          </Text>
        </View>

        {/* Sign Up Button */}
        <TouchableOpacity onPress={handleUserSignup} style={styles.button}>
          <LinearGradient
            colors={["#8E44AD", "#8E44AD"]}
            style={styles.gradientButton}
          >
            <Text style={styles.buttonText}>{t("sign_up")}</Text>
          </LinearGradient>
        </TouchableOpacity>
  
        <View style={{ flexDirection: "row", justifyContent: "center", paddingVertical: 15 }}>
          <Text style={{ color: "white", fontSize: 12 }}>{t("already_have_account")}</Text>
          <TouchableOpacity
            onPress={() => navigation.navigate("login")}
          >
            <Text style={[styles.checkboxLabel, { marginLeft: 4, color: "#27AE60" }]}>{t("login")}?</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
    alignItems: "center",
    padding: 20,
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
  inputContainer: {
    width: "100%",
    marginBottom: 20,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1E1E1E",
    paddingHorizontal: 10,
    borderRadius: 8,
    marginBottom: 17,
    borderWidth: 1,
    borderColor: "#444",
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
    marginBottom: 20,
    justifyContent:"flex-start",
    width:"100%",
    gap: 10
  },
  checkboxLabel: {
    color: "#FFFFFF",
    fontSize: 12,
  },
  errorText: {
    color: "red",
    fontSize: 12,
    marginBottom: 10,
  },
  button: {
    width: "100%",
    borderRadius: 8,
    overflow: "hidden",
    marginBottom: 20
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
  criteriaContainer: {
    marginVertical: 10,
  },
  criteriaItem: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 5,
  },
  label: {
    color: "#A4A4A4",
    marginBottom: 10,
  },
  socialButton: {
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
    width: 400,
    height: 258,
    marginBottom: 20,
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
  orText: {
    color: "#AAAAAA",
    marginBottom: 20,
  },
  socialButtons: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    width: "70%",
  },
});