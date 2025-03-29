import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import CircularButton from "../component/BackButton";
import Setting from "../component/Setting";
import GradientText from "../component/GradientText";
import { useTranslation } from "react-i18next"; // Import useTranslation

const FAQPage = ({ navigation }) => {
  const { t } = useTranslation(); // Initialize translation hook

  const faqData = [
    {
      question: t("what_is_langswap"),
      answer: t("langswap_description"),
    },
    {
      question: t("is_langswap_free"),
      answer: t("langswap_free_tier"),
    },
    {
      question: t("what_does_premium_offer"),
      answer: t("premium_features"),
    },
    {
      question: t("how_do_i_contact_support"),
      answer: t("contact_support_email"),
    },
  ];

  const [expandedIndex, setExpandedIndex] = useState(null);

  const toggleFAQ = (index) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  return (
    <SafeAreaView style={{ flexGrow: 1, backgroundColor: "#121212" }}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <CircularButton navigation={navigation} />
          <Text style={styles.headerTitle}>{t("help_desk")}</Text>
          <Setting navigation={navigation} />
        </View>

        {/* Support Text */}
        <Text style={styles.supportText}>{t("support_for_all_needs_on")}</Text>
        <GradientText text={t("lang_swap")} />

        {/* FAQ Section */}
        <Text style={styles.faqHeader}>{t("faq")}</Text>
        <ScrollView style={styles.faqContainer}>
          {faqData.map((item, index) => (
            <View key={index}>
              <TouchableOpacity
                style={styles.faqItem}
                onPress={() => toggleFAQ(index)}
              >
                <Text style={styles.faqText}>{item.question}</Text>
                <Ionicons
                  name={expandedIndex === index ? "remove" : "add"}
                  size={20}
                  color="#fff"
                />
              </TouchableOpacity>
              {expandedIndex === index && (
                <Text style={styles.answerText}>{item.answer}</Text>
              )}
            </View>
          ))}
        </ScrollView>

        {/* Send a Message Button (Commented out in original, but included for completeness) */}
        {/* <TouchableOpacity style={styles.messageButton}>
          <Text style={styles.messageButtonText}>{t("send_message")}</Text>
        </TouchableOpacity> */}
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
  supportText: {
    color: "#fff",
    textAlign: "center",
    fontSize: 21,
    fontWeight: "600",
    marginBottom: 4,
  },
  faqHeader: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 20,
  },
  faqContainer: {
    flex: 1,
    marginBottom: 16,
  },
  faqItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#1E1E1E",
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#333",
  },
  faqText: {
    color: "#fff",
    fontSize: 14,
  },
  answerText: {
    color: "#aaa",
    fontSize: 14,
    padding: 10,
    paddingLeft: 13,
    borderRadius: 8,
    marginTop: -10,
    marginBottom: 12,
  },
  messageButton: {
    backgroundColor: "#8E44AD",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  messageButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default FAQPage;