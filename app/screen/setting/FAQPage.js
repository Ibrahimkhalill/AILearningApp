import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import CircularButton from "../component/BackButton";
import Setting from "../component/Setting";
import GradientText from "../component/GradientText";

const FAQPage = ({ navigation }) => {
  const faqData = [
    {
      question: "What Is LangSwap",
      answer: "LangSwap is a platform for language exchange and learning.",
    },
    {
      question: "Is LangSwap Free To Use",
      answer:
        "Yes, LangSwap offers a free tier with optional premium features.",
    },
    {
      question: "What Does The Premium Version Offer",
      answer:
        "The premium version offers additional features like advanced matching and ad-free experience.",
    },
    {
      question: "How Do I Contact Support",
      answer: "You can contact support via email at support@langswap.com.",
    },
  ];

  const [expandedIndex, setExpandedIndex] = useState(null);

  const toggleFAQ = (index) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  return (
    <SafeAreaView style={{ flexGrow: 1 }}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <CircularButton navigation={navigation} />
          <Text style={styles.headerTitle}>Help Desk</Text>
          <Setting navigation={navigation} />
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Ionicons
            name="search"
            size={20}
            color="#aaa"
            style={styles.searchIcon}
          />
          <TextInput
            style={styles.searchInput}
            placeholder="Search Help"
            placeholderTextColor="#aaa"
          />
        </View>

        {/* Support Text */}
        <Text style={styles.supportText}>Support for all your needs on</Text>
        <GradientText text={"LangSwap"} />

        {/* FAQ Section */}
        <Text style={styles.faqHeader}>FAQ</Text>
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

        {/* Send a Message Button */}
        {/* <TouchableOpacity style={styles.messageButton}>
          <Text style={styles.messageButtonText}>Send A Message</Text>
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
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1E1E1E",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#8E44AD",
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    color: "#fff",
    fontSize: 16,
  },
  supportText: {
    color: "#fff",
    textAlign: "center",
    fontSize: 21,
    fontWeight: "600",
    marginBottom: 4,
  },
  appName: {
    color: "#8E44AD",
    textAlign: "center",
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
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
