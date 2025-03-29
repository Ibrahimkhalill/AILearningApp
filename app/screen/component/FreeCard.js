import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next"; // Import useTranslation

export default function FreeCard() {
  const { t } = useTranslation(); // Initialize translation hook

  return (
    <LinearGradient
      colors={["rgba(142, 68, 173, 1)", "rgba(74, 144, 226, 0.42)"]} // Gradient colors
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.card}
    >
      <View style={styles.header}>
        <Text style={styles.title}>{t("free_card_title")}</Text>
      </View>
      <View style={styles.features}>
        {[
          t("basic_progress_tracking"),
          t("immersive_scenario"),
          t("basic_translation"),
          t("text_conversation"),
        ].map((feature, index) => (
          <View key={index} style={styles.featureItem}>
            <Ionicons name="checkmark-circle" size={20} color="#00FF00" />
            <Text style={styles.featureText}>{feature}</Text>
          </View>
        ))}
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  card: {
    width: "100%",
    borderRadius: 16,
    padding: 20,
    alignSelf: "center",
    marginTop: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 8, // Shadow for Android
    height: 240,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  priceContainer: {
    alignItems: "flex-end",
  },
  price: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  perMonth: {
    fontSize: 12,
    color: "#FFFFFF",
  },
  features: {
    marginTop: 10,
  },
  featureItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  featureText: {
    fontSize: 14,
    color: "#FFFFFF",
    marginLeft: 10,
  },
});