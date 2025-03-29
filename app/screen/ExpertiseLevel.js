import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import CircularButton from "./component/BackButton";
import axiosInstance from "./component/axiosInstance";
import { useTranslation } from "react-i18next"; // Import useTranslation

export default function ExpertiseLevel({ navigation }) {
  const [selectedLevel, setSelectedLevel] = useState(null);
  const { t } = useTranslation(); // Initialize translation hook

  const handleNext = async () => {
    if (!selectedLevel) {
      Alert.alert(t("select_a_level"), t("please_select_expertise_level"));
      return;
    }

    try {
      const response = await axiosInstance.put("/user/profile", {
        expertiseLevel: selectedLevel,
      });
      if (response.status === 200) {
        navigation.navigate("DailyGoalScreen");
      }
    } catch (error) {
      console.log("Error updating profile:", error);
      Alert.alert(t("error"), t("failed_update_profile") + ": " + error.message);
    }
  };

  return (
    <SafeAreaView style={{ flexGrow: 1 }}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <CircularButton navigation={navigation} />
          <Text style={styles.title}>{t("expertise_level")}</Text>
          <View style={styles.title}></View>
        </View>

        {/* Expertise Options */}
        <TouchableOpacity
          style={[
            styles.option,
            selectedLevel === "Beginner" && styles.selectedOption,
          ]}
          onPress={() => setSelectedLevel("Beginner")}
        >
          <Text style={styles.optionText}>{t("level_beginner")}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.option,
            selectedLevel === "Intermediate" && styles.selectedOption,
          ]}
          onPress={() => setSelectedLevel("Intermediate")}
        >
          <Text style={styles.optionText}>{t("level_intermediate")}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.option,
            selectedLevel === "Advanced" && styles.selectedOption,
          ]}
          onPress={() => setSelectedLevel("Advanced")}
        >
          <Text style={styles.optionText}>{t("level_advanced")}</Text>
        </TouchableOpacity>

        {/* Next Button */}
        <TouchableOpacity
          style={[styles.nextButton, styles.centerHorizontally]}
          onPress={handleNext}
        >
          <Text style={styles.nextButtonText}>{t("next")}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
    padding: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 30,
    width: "100%",
    justifyContent: "space-between",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginLeft: 30,
  },
  option: {
    backgroundColor: "#1E1E1E",
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#444",
  },
  selectedOption: {
    backgroundColor: "#8E44AD",
    borderColor: "#8E44AD",
  },
  optionText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  nextButton: {
    position: "absolute",
    bottom: 20, // Position 20px from the bottom
    paddingVertical: 15,
    paddingHorizontal: 30,
    backgroundColor: "#8E44AD",
    borderRadius: 8,
    width: 117,
    marginLeft: 10,
  },
  centerHorizontally: {
    left: "50%", // Start at the center of the screen
    transform: [{ translateX: -50 }], // Move it back by half of its width
  },
  nextButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
});