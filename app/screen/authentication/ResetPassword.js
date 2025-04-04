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
} from "react-native";
import CircularButton from "../component/BackButton";
import {
  Ionicons,
  MaterialCommunityIcons,
  FontAwesome,
} from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import axiosInstance from "../component/axiosInstance";
import { useTranslation } from "react-i18next"; // Import useTranslation

const ResetPassword = ({ route, navigation }) => {
  const { email } = route.params || {};
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isPasswordConfirmVisible, setIsPasswordConfirmVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [errors, setErrors] = useState({
    newPassword: "",
    confirmPassword: "",
  });
  const { t } = useTranslation(); // Initialize translation hook

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  const validatePassword = (password) => {
    const regex =
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return regex.test(password);
  };

  const handlePasswordChange = (text) => {
    setNewPassword(text);

    if (text === "") {
      setErrors((prev) => ({
        ...prev,
        newPassword: t("password_empty"),
      }));
    } else if (!validatePassword(text)) {
      setErrors((prev) => ({
        ...prev,
        newPassword: t("password_requirements"),
      }));
    } else {
      setErrors((prev) => ({ ...prev, newPassword: "" }));
    }
  };

  const handleConfirmPasswordChange = (text) => {
    setConfirmPassword(text);

    if (text === "") {
      setErrors((prev) => ({
        ...prev,
        confirmPassword: t("confirm_password_empty"),
      }));
    } else if (text !== newPassword) {
      setErrors((prev) => ({
        ...prev,
        confirmPassword: t("passwords_do_not_match"),
      }));
    } else {
      setErrors((prev) => ({ ...prev, confirmPassword: "" }));
    }
  };

  const handleResetPassword = async () => {
    if (!newPassword) {
      setErrors((prev) => ({
        ...prev,
        newPassword: t("password_empty"),
      }));
    }
    if (!confirmPassword) {
      setErrors((prev) => ({
        ...prev,
        confirmPassword: t("confirm_password_empty"),
      }));
    }

    if (
      errors.newPassword ||
      errors.confirmPassword ||
      !newPassword ||
      !confirmPassword
    ) {
      return;
    }

    setIsLoading(true);
    try {
      const response = await axiosInstance.post("/auth/password/reset/verify", {
        email: email,
        newPassword: newPassword,
      });
      if (response.status === 200) {
        navigation.navigate("PasswordChanged");
      }
    } catch (error) {
      alert(t("reset_password_error"));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={{ flexGrow: 1 , backgroundColor:"#121212" }}>
      <View style={styles.container}>
        <View style={styles.backButton}>
          <CircularButton navigation={navigation} />
        </View>

        <View style={styles.iconWrapper}>
          <Image
            source={require("../../assets/main_logo.png")}
            style={styles.icon}
          />
        </View>

        <Text style={styles.title}>{t("create_new_password")}</Text>
        <Text style={styles.subtitle}>{t("new_password_unique")}</Text>

        <View>
          <Text className="text-[#A4A4A4] mb-2 mt-2">{t("password")}</Text>
          <View style={styles.inputWrapper}>
            <Ionicons name="lock-closed-outline" style={{marginBotto: 5}} size={20} color="#888" />
            <TextInput
              style={styles.input}
              placeholder={t("password_placeholder")}
              onChangeText={handlePasswordChange}
              value={newPassword}
              secureTextEntry={!isPasswordVisible}
              placeholderTextColor="#888"
            />
            <TouchableOpacity
              onPress={togglePasswordVisibility}
              className="absolute right-2 top-4"
            >
              <Ionicons
                name={isPasswordVisible ? "eye" : "eye-off"}
                size={20}
                color="gray"
              />
            </TouchableOpacity>
          </View>
          {errors.newPassword ? (
            <Text className="text-red-500 text-[12px] mt-1">
              {errors.newPassword}
            </Text>
          ) : null}

          <Text className="text-[#A4A4A4] mb-2 mt-2">{t("confirm_password")}</Text>
          <View style={styles.inputWrapper}>
            <Ionicons name="lock-closed-outline" style={{marginBotto: 5}} size={20} color="#888" />
            <TextInput
              style={styles.input}
              placeholder={t("password_placeholder")}
              onChangeText={handleConfirmPasswordChange}
              value={confirmPassword}
              secureTextEntry={!isPasswordConfirmVisible}
              placeholderTextColor="#888"
            />
            <TouchableOpacity
              onPress={() =>
                setIsPasswordConfirmVisible(!isPasswordConfirmVisible)
              }
              className="absolute right-2 top-4"
            >
              <Ionicons
                name={isPasswordConfirmVisible ? "eye" : "eye-off"}
                size={20}
                color="gray"
              />
            </TouchableOpacity>
          </View>
          {errors.confirmPassword ? (
            <Text className="text-red-500 text-[12px] mt-1">
              {errors.confirmPassword}
            </Text>
          ) : null}
        </View>

        <TouchableOpacity
          style={styles.sendButton}
          onPress={handleResetPassword}
        >
          <LinearGradient
            colors={["#8E44AD", "#8E44AD"]}
            style={styles.gradientButton}
          >
            {isLoading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={styles.sendButtonText} className="uppercase">
                {t("reset_password")}
              </Text>
            )}
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
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
    marginBottom: 7,
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