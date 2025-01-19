import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import CircularButton from "../component/BackButton";
import Setting from "../component/Setting";

const HelpSupport = ({ navigation }) => {
  const [email, setEmail] = useState("Pappyroy6393@gmail.com");
  const [problem, setProblem] = useState("");

  const handleSubmit = () => {
    // Handle the form submission here
    console.log("Email:", email);
    console.log("Problem:", problem);
  };

  return (
    <SafeAreaView style={{ flexGrow: 1 }}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <CircularButton navigation={navigation} />
          <Text style={styles.headerTitle}>Help & Support</Text>
          <Setting navigation={navigation} />
        </View>

        {/* Logo and Info */}
        <View style={styles.logoContainer}>
          <Image
            source={require("../../assets/main_logo.png")} // Replace with your logo URL
            style={styles.logo}
          />
          <Text style={styles.infoText}>
            At LangSwap, we are committed to providing you with seamless support
            throughout your language learning journey. Whether you need
            assistance with navigating the app, troubleshooting issues, or have
            questions about our features, our team is here to help. We strive to
            ensure that every learner receives the guidance they need to make
            the most of our platform.
          </Text>
        </View>

        {/* Form */}
        <View style={styles.formContainer}>
          {/* Email Field */}
          <Text style={styles.label}>Email</Text>
          <View style={styles.inputWrapper}>
            <Ionicons name="mail" size={20} color="#aaa" style={styles.icon} />
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              placeholder="Enter your email"
              placeholderTextColor="#aaa"
              keyboardType="email-address"
            />
          </View>

          {/* Problem Field */}
          <Text style={styles.label}>Explain The Problem</Text>
          <View style={styles.textAreaWrapper}>
            <TextInput
              style={styles.textArea}
              value={problem}
              onChangeText={setProblem}
              placeholder="Describe your issue"
              placeholderTextColor="#aaa"
              multiline
            />
          </View>
        </View>

        {/* Submit Button */}
        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>Submit</Text>
        </TouchableOpacity>
      </View>
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
    position: "absolute",
    bottom: 10,
    width: "100%",
    left: "5%",
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default HelpSupport;
