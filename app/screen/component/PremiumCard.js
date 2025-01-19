import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";

export default function PremiumCard() {
  return (
    <LinearGradient
      colors={["rgba(142, 68, 173, 1)", "rgba(231, 76, 60, 1)"]} // Gradient colors
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.card}
    >
      <View style={styles.header}>
        <Text style={styles.title}>Upgraded Premium</Text>
        <View style={styles.priceContainer}>
          <Text style={styles.price}>12$</Text>
          <Text style={styles.perMonth}>1 Month</Text>
        </View>
      </View>
      <View style={styles.features}>
        {[
          "Live Voice Translation",
          "Advanced Scenario",
          "Detailed Reports",
          "AI Teacher",
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
    height : 240
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
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
