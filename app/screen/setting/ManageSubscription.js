import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import CircularButton from "../component/BackButton";
import Setting from "../component/Setting";
import MaskedView from "@react-native-masked-view/masked-view";
import GradientText from "../component/GradientText";
import axiosInstance from "../component/axiosInstance";
import axios from "axios";
import { useAuth } from "../component/Auth";
import { WebView } from "react-native-webview";
import { useTranslation } from "react-i18next"; // Import useTranslation

const ManageSubscription = ({ navigation }) => {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [plan, setPlan] = useState("Free");
  const [profileImage, setProfileImage] = useState("");
  const [loading, setLoading] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const { token, refreshAccessToken } = useAuth();
  const [checkoutUrl, setCheckoutUrl] = useState(null); // Store the checkout URL
  const { t } = useTranslation(); // Initialize translation hook

  // ✅ Fetch User Profile from Backend API
  const fetchProfile = async () => {
    setLoading(true);
    try {
      console.log("token", token);

      const response = await axiosInstance.get("/subscription/details");
      const { startDate, endDate, type } = response.data.subscription;

      setStartDate(startDate);
      setEndDate(endDate);
      setPlan(type);
      console.log("fdf", response.data);
    } catch (error) {
      console.error("Error fetching subscriptions:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const formatDate = (dateString) => {
    if (!dateString) return ""; // Handle empty case
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(date);
  };

  const createCheckoutSession = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.post(
        "/subscription/stripe-session", // Your backend endpoint
        {} // Replace with the actual price ID
      );
      setCheckoutUrl(response.data.url); // Save the checkout URL
    } catch (error) {
      Alert.alert(t("error"), t("failed_create_checkout_session"));
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleNavigationStateChange = (navState) => {
    if (navState.url.includes("/api/subscription/stripe-success")) {
      setCheckoutUrl(null); // Close the WebView
      fetchProfile();
      Alert.alert(t("success"), t("subscription_successful"));
    } else if (navState.url.includes("/api/subscription/stripe-cancel")) {
      setCheckoutUrl(null); // Close the WebView
    }
  };

  if (checkoutUrl) {
    // Render the WebView if a checkout URL is available
    return (
      <SafeAreaView style={styles.safeArea}>
        <WebView
          source={{ uri: checkoutUrl }}
          onNavigationStateChange={handleNavigationStateChange}
          startInLoadingState
          renderLoading={() => (
            <ActivityIndicator size="large" color="#FFDC58" />
          )}
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flexGrow: 1, backgroundColor: "#121212" }}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <CircularButton navigation={navigation} />

          <Text style={styles.headerTitle}>{t("manage_subscription")}</Text>

          <Setting navigation={navigation} />
        </View>

        {/* Logo and Title */}
        <View style={styles.logoContainer}>
          <Image
            source={require("../../assets/main_logo.png")} // Replace with your logo URL
            style={styles.logo}
          />
          <GradientText text={t("lang_swap")} />
        </View>

        {/* Subscription Details */}
        <View style={styles.detailContainer}>
          <LinearGradient
            colors={[
              "rgba(255, 255, 255, 0.04)", // 0% opacity: Fully visible white (fixed syntax error in rgba)
              "rgba(255, 255, 255, 0.1)", // 77% opacity: 22% visible white
              "rgba(255, 255, 255, 0)", // 100% opacity: Fully transparent white (fixed syntax error in rgba)
            ]}
            start={{ x: 0, y: 0 }} // Starting point (top-left)
            end={{ x: 1, y: 0 }}
            style={styles.detailItem}
          >
            <Text style={styles.label}>{t("amount")}</Text>
            <Text style={styles.value}>{t("subscription_amount")}</Text>
          </LinearGradient>
          <LinearGradient
            colors={[
              "rgba(255, 255, 255, 0.04)", // 0% opacity: Fully visible white
              "rgba(255, 255, 255, 0.1)", // 77% opacity: 22% visible white
              "rgba(255, 255, 255, 0)", // 100% opacity: Fully transparent white
            ]}
            start={{ x: 0, y: 0 }} // Starting point (top-left)
            end={{ x: 1, y: 0 }}
            style={styles.detailItem}
          >
            <Text style={styles.label}>{t("begins")}</Text>
            <Text style={styles.value}>{formatDate(startDate)}</Text>
          </LinearGradient>
          <LinearGradient
            colors={[
              "rgba(255, 255, 255, 0.04)", // 0% opacity: Fully visible white
              "rgba(255, 255, 255, 0.1)", // 77% opacity: 22% visible white
              "rgba(255, 255, 255, 0)", // 100% opacity: Fully transparent white
            ]}
            start={{ x: 0, y: 0 }} // Starting point (top-left)
            end={{ x: 1, y: 0 }}
            style={styles.detailItem}
          >
            <Text style={styles.label}>{t("ends")}</Text>
            <Text style={styles.value}>{formatDate(endDate)}</Text>
          </LinearGradient>

          <LinearGradient
            colors={[
              "rgba(255, 255, 255, 0.04)", // 0% opacity: Fully visible white
              "rgba(255, 255, 255, 0.1)", // 77% opacity: 22% visible white
              "rgba(255, 255, 255, 0)", // 100% opacity: Fully transparent white
            ]}
            start={{ x: 0, y: 0 }} // Starting point (top-left)
            end={{ x: 1, y: 0 }}
            style={styles.detailItem}
          >
            <Text style={styles.label}>{t("type")}</Text>
            <Text style={styles.value}>{plan}</Text>
          </LinearGradient>
        </View>

        {/* Buttons */}
        {plan === "Free" && (
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.renewButton} onPress={createCheckoutSession}>
              <Text style={styles.renewButtonText}>{t("renew")}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.cancelButton}>
              <Text style={styles.cancelButtonText}>{t("cancel")}</Text>
            </TouchableOpacity>
          </View>
        )}
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
    marginVertical: 16,
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 8,
  },
  logoText: {
    color: "#8E44AD",
    fontSize: 24,
    fontWeight: "bold",
  },
  detailContainer: {
    marginVertical: 16,
  },
  detailItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#1E1E1E",
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#333",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.36,
    shadowRadius: 6.68,
    elevation: 11,
  },
  label: {
    color: "#aaa",
    fontSize: 16,
  },
  value: {
    color: "#B9B9B9",
    fontSize: 16,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 16,
  },
  renewButton: {
    backgroundColor: "rgba(142, 68, 173, 1)",
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 8,
  },
  renewButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  cancelButton: {
    borderWidth: 1,
    borderColor: "#8E44AD",
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 8,
  },
  cancelButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  safeArea: {
    flexGrow: 1,
    paddingBottom: 10,
    backgroundColor: "white",
  },
});

export default ManageSubscription;