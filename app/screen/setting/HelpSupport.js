import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Dimensions,
  Alert,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import CircularButton from "../component/BackButton";
import Setting from "../component/Setting";
import axiosInstance from "../component/axiosInstance";
import { ScrollView } from "react-native";
import { useTranslation } from "react-i18next"; // Import useTranslation

const HelpSupport = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [problem, setProblem] = useState("");
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation(); // Initialize translation hook

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.post("/problem/report", {
        email: email,
        description: problem,
      });

      if (response.status === 200) {
        setEmail("");
        setProblem("");
        Alert.alert(t("success"), t("message_sent_successfully"));
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
      Alert.alert(t("error"), t("failed_send_message"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={{ flexGrow: 1, backgroundColor: "#121212" }}>
      <ScrollView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <CircularButton navigation={navigation} />
          <Text style={styles.headerTitle}>{t("help_support")}</Text>
          <Setting navigation={navigation} />
        </View>

        {/* Logo and Info */}
        <View style={styles.logoContainer}>
          <Image
            source={require("../../assets/main_logo.png")} // Replace with your logo URL
            style={styles.logo}
          />
          <Text style={styles.infoText}>{t("langswap_support_description")}</Text>
        </View>

        {/* Form */}
        <View style={styles.formContainer}>
          {/* Email Field */}
          <Text style={styles.label}>{t("email")}</Text>
          <View style={styles.inputWrapper}>
            <Ionicons name="mail" size={20} color="#aaa" style={styles.icon} />
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              placeholder={t("enter_email")}
              placeholderTextColor="#aaa"
              keyboardType="email-address"
            />
          </View>

          {/* Problem Field */}
          <Text style={styles.label}>{t("explain_problem")}</Text>
          <View style={styles.textAreaWrapper}>
            <TextInput
              style={styles.textArea}
              value={problem}
              onChangeText={setProblem}
              placeholder={t("describe_issue")}
              placeholderTextColor="#aaa"
              multiline
            />
          </View>
        </View>

        {/* Submit Button */}
        <TouchableOpacity
          style={styles.submitButton}
          onPress={handleSubmit}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={styles.submitButtonText}>{t("submit")}</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
    padding: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  headerTitle: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 16,
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 16,
  },
  infoText: {
    color: "#FFFFFF",
    fontSize: 14,
    textAlign: "center",
    marginBottom: 16,
  },
  formContainer: {
    marginBottom: 16,
  },
  label: {
    color: "#fff",
    fontSize: 16,
    marginBottom: 8,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1E1E1E",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#333",
  },
  textAreaWrapper: {
    backgroundColor: "#1E1E1E",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: "#333",
  },
  icon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    color: "#A4A4A4",
    fontSize: 16,
    height: 30,
  },
  textArea: {
    color: "#fff",
    fontSize: 16,
    height: 100,
    textAlignVertical: "top",
  },
  submitButton: {
    backgroundColor: "#8E44AD",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default HelpSupport;