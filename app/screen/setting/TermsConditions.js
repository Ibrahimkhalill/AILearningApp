import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import GradientText from "../component/GradientText";
import CircularButton from "../component/BackButton";
import Setting from "../component/Setting";
import CustomNavigationBar from "../component/CustomNavigationBar";

const TermsConditions = ({ navigation }) => {
  return (
    <SafeAreaView style={{ flexGrow: 1 }}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <CircularButton navigation={navigation} />
          <View className="flex flex-row items-center">
            <Text style={styles.logoText}>Lang</Text>
            <Text className="text-[#8E44AD] text-[24px] font-bold ">Swap</Text>
          </View>
          <Setting navigation={navigation} />
        </View>

        {/* Title */}
        <Text style={styles.title}>Terms & Conditions</Text>
        <Text style={styles.lastUpdated}>Last Update: 4 October 2024</Text>

        {/* Content */}
        <ScrollView style={styles.contentContainer}>
          <Text style={styles.paragraph}>
            Welcome to LangSwap! By accessing and using our platform, you agree
            to be bound by these terms & conditions. These terms are designed to
            protect both you as a user and LangSwap as a service provider. If
            you disagree with any part of these terms, we kindly ask that you
            refrain from using the platform.
          </Text>

          <Text style={styles.sectionTitle}>1. Acceptance Of Terms</Text>
          <Text style={styles.paragraph}>
            By using the LangSwap platform, you agree to abide by these terms &
            conditions. If you do not agree to these terms, please refrain from
            using the platform.
          </Text>

          <View style={styles.highlightedSection}>
            <Text style={styles.sectionTitle}>2. User Responsibilities</Text>
            <Text style={styles.paragraph}>
              You are responsible for maintaining the confidentiality of your
              account and for all activities that occur under your account. You
              agree not to use LangSwap for any illegal or unauthorized
              purposes.
            </Text>
          </View>

          <Text style={styles.sectionTitle}>3. Privacy Policy</Text>
          <Text style={styles.paragraph}>
            Our privacy is important to us. Our privacy policy outlines how we
            collect, use, and protect your personal data. By using LangSwap, you
            consent to the collection and use of your data as described in our
            privacy policy.
          </Text>

          <Text style={styles.sectionTitle}>4. Payment & Subscription</Text>
          <Text style={styles.paragraph}>
            Our privacy is important to us. Our privacy policy outlines how we
            collect, use, and protect your personal data. By using LangSwap, you
            consent to the collection and use of your data as described in our
            privacy policy.
          </Text>
        </ScrollView>
      </View>
      <CustomNavigationBar navigation={navigation} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
    padding: 16,
    paddingBottom: 80,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  logoText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#4A90E2",
  },
  title: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 8,
  },
  lastUpdated: {
    color: "#8E44AD",
    fontSize: 14,
    marginBottom: 16,
  },
  contentContainer: {
    flex: 1,
  },
  paragraph: {
    color: "#ddd",
    fontSize: 13,
    marginBottom: 16,
    lineHeight: 24,
  },
  sectionTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
});

export default TermsConditions;
