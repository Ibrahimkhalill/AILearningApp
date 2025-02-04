import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Switch,
  Animated,
  Dimensions,
} from "react-native";
import {
  Ionicons,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import CircularButton from "../component/BackButton";
import { LinearGradient } from "expo-linear-gradient";
import LogoutModal from "./LogoutModal";

const SettingsPage = ({ navigation }) => {
  const [isEnabled, setIsEnabled] = useState(false);

  const toggleSwitch = () => setIsEnabled((previousState) => !previousState);

  return (
    <SafeAreaView style={{ flexGrow: 1 }}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity>
            <CircularButton navigation={navigation} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Setting</Text>
          <Switch
            trackColor={{ false: "#767577", true: "#8E44AD" }}
            thumbColor={isEnabled ? "#8E44AD" : "#8E44AD"}
            onValueChange={toggleSwitch}
            value={isEnabled}
          />
        </View>

        {/* Separator */}
        <View style={styles.separator} />

        {/* Menu Items */}
        <TouchableOpacity
          onPress={() => navigation.navigate("ManageSubscription")}
        >
          <LinearGradient
            colors={[
              "rgba(255, 255, 255, 0.040)", // 0% opacity: Fully visible white
              "rgba(255, 255, 255, 0.1)", // 77% opacity: 22% visible white
              "rgba(255, 255, 255, 0))", // 100% opacity: Fully transparent white
            ]}
            start={{ x: 0, y: 0 }} // Starting point (top-left)
            end={{ x: 1, y: 0 }}
            style={styles.menuItem}
          >
            <Ionicons
              name="flash"
              size={20}
              color="#D7D7D7"
              style={styles.icon}
            />
            <Text style={styles.menuText}>Manage Subscription</Text>
            <Ionicons name="chevron-forward" size={20} color="#D7D7D7" />
          </LinearGradient>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate("FAQPage")}>
          <LinearGradient
            colors={[
              "rgba(255, 255, 255, 0.040)", // 0% opacity: Fully visible white
              "rgba(255, 255, 255, 0.1)", // 77% opacity: 22% visible white
              "rgba(255, 255, 255, 0))", // 100% opacity: Fully transparent white
            ]}
            start={{ x: 0, y: 0 }} // Starting point (top-left)
            end={{ x: 1, y: 0 }}
            style={styles.menuItem}
          >
            <MaterialCommunityIcons
              name="frequently-asked-questions"
              size={20}
              color="#D7D7D7"
              style={styles.icon}
            />
            <Text style={styles.menuText}>FAQ</Text>
            <Ionicons name="chevron-forward" size={20} color="#D7D7D7" />
          </LinearGradient>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate("helpsupport")}>
          <LinearGradient
            colors={[
              "rgba(255, 255, 255, 0.040)", // 0% opacity: Fully visible white
              "rgba(255, 255, 255, 0.1)", // 77% opacity: 22% visible white
              "rgba(255, 255, 255, 0))", // 100% opacity: Fully transparent white
            ]}
            start={{ x: 0, y: 0 }} // Starting point (top-left)
            end={{ x: 1, y: 0 }}
            style={styles.menuItem}
          >
            <MaterialIcons
              name="support-agent"
              size={20}
              color="#D7D7D7"
              style={styles.icon}
            />
            <Text style={styles.menuText}>Help & Support</Text>
            <Ionicons name="chevron-forward" size={20} color="#D7D7D7" />
          </LinearGradient>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.navigate("TermsConditions")}
        >
          <LinearGradient
            colors={[
              "rgba(255, 255, 255, 0.040)", // 0% opacity: Fully visible white
              "rgba(255, 255, 255, 0.1)", // 77% opacity: 22% visible white
              "rgba(255, 255, 255, 0))", // 100% opacity: Fully transparent white
            ]}
            start={{ x: 0, y: 0 }} // Starting point (top-left)
            end={{ x: 1, y: 0 }}
            style={styles.menuItem}
          >
            <Ionicons
              name="document-text"
              size={20}
              color="#D7D7D7"
              style={styles.icon}
            />
            <Text style={styles.menuText}>Terms & Conditions</Text>
            <Ionicons name="chevron-forward" size={20} color="#D7D7D7" />
          </LinearGradient>
        </TouchableOpacity>

        <LogoutModal navigation={navigation} />
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
  separator: {
    borderBottomColor: "#333",
    borderBottomWidth: 1,
    marginBottom: 16,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#1E1E1E",
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.36,
    shadowRadius: 6.68,
    elevation: 11,
    height: 55,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, .1)",
  },
  icon: {
    marginRight: 10,
  },
  menuText: {
    flex: 1,
    color: "#D7D7D7",
    fontSize: 16,
  },
});

export default SettingsPage;
