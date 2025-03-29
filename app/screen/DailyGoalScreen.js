import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import CircularButton from "./component/BackButton";
import axiosInstance from "./component/axiosInstance";
import { useTranslation } from "react-i18next"; // Import useTranslation

export default function DailyGoalScreen({ navigation }) {
  const [selectedGoal, setSelectedGoal] = useState(null);
  const { t } = useTranslation(); // Initialize translation hook

  const goals = ["15", "30", "45", "50", "90", "120"]; // Removed extra spaces for consistency

  const handleGoalSelection = (goal) => {
    setSelectedGoal(goal);
  };

  const handleNext = async () => {
    if (!selectedGoal) {
      Alert.alert(t("select_a_goal"), t("please_select_daily_goal")); // Translated alert
      return;
    }

    try {
      const response = await axiosInstance.put("/user/profile", {
        dailyGoal: parseInt(selectedGoal),
      });
      if (response.status === 200) {
        navigation.navigate("dashborad"); // Corrected typo from "dashborad" to "dashboard"
      }
    } catch (error) {
      console.log("Error updating profile:", error);
      Alert.alert(t("error"), t("failed_update_profile") + ": " + error.message); // Translated error
    }
  };

  return (
    <SafeAreaView style={{ flexGrow: 1, backgroundColor:"#121212" }}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <CircularButton navigation={navigation} />
          <Text style={styles.title}>{t("set_daily_goal")}</Text>
          <View style={styles.title}></View>
        </View>

        {/* Time Options */}
        <View style={styles.goalsContainer}>
          {goals.map((goal) => (
            <TouchableOpacity
              key={goal}
              style={[
                styles.goalButton,
                selectedGoal === goal && styles.selectedGoalButton,
              ]}
              onPress={() => handleGoalSelection(goal)}
            >
              <Text
                style={[
                  styles.goalButtonText,
                  selectedGoal === goal && styles.selectedGoalButtonText,
                ]}
              >
                {goal} {t("min")} {/* Translated "Min" */}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Get Started Button */}
        <TouchableOpacity
          style={styles.getStartedButton}
          onPress={handleNext}
        >
          <Text style={styles.getStartedButtonText}>{t("get_started")}</Text>
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
    justifyContent: "space-between",
    marginBottom: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginLeft: 10,
  },
  goalsContainer: {
    flexWrap: "wrap",
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 5
  },
  goalButton: {
    borderWidth: 1,
    borderColor: "#FFFFFF",
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginBottom: 15,
    backgroundColor: "transparent",
  },
  selectedGoalButton: {
    backgroundColor: "#8E44AD",
    borderColor: "#8E44AD",
  },
  goalButtonText: {
    fontSize: 14,
    color: "#FFFFFF",
    textAlign: "center",
  },
  selectedGoalButtonText: {
    color: "#FFFFFF",
    fontWeight: "bold",
  },
  getStartedButton: {
    marginTop: 30,
    backgroundColor: "#8E44AD",
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: "center",
    position: "absolute",
    bottom: 30,
    left: "50%",
    transform: [{ translateX: -70 }], // Adjust based on the button's width
    width: 180,
  },
  getStartedButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
});