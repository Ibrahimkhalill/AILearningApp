import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  Dimensions,
  FlatList,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useTranslation } from "react-i18next"; // Import useTranslation
import {
  Ionicons,
  FontAwesome5,
  MaterialCommunityIcons,
  AntDesign,
} from "@expo/vector-icons";
import { WebView } from "react-native-webview";
import { SafeAreaView } from "react-native-safe-area-context";
import CustomNavigationBar from "./component/CustomNavigationBar";
import { LinearGradient } from "expo-linear-gradient";
import NextButton from "./component/NextButton";
import PremiumCard from "./component/PremiumCard";
import FreeCard from "./component/FreeCard";
import CircularProgress from "./component/CircularProgress";
import axiosInstance from "./component/axiosInstance";
import Premium from "../assets/premimum.svg";
import { useLearningTime } from "./component/LearningTimeContext";
import { useFocusEffect } from "@react-navigation/native";

const { width } = Dimensions.get("window");

export default function Dashboard({ navigation }) {
  const { t } = useTranslation(); // Initialize translation hook
  const [loading, setLoading] = useState(false);
  const [plan, setPlan] = useState("");
  const [goal, setGoal] = useState(0);
  const { learningTime } = useLearningTime();

  const CARD_WIDTH = width * 0.8;
  const CARD_SPACING = 16;

  const cardComponents = [
    { id: "1", component: <PremiumCard /> },
    { id: "2", component: <FreeCard /> },
  ];

  const renderItem = ({ item }) => (
    <View style={{ width: CARD_WIDTH, marginRight: CARD_SPACING }}>
      {item.component}
    </View>
  );

  const scenarios = [
    {
      id: "1",
      title: t("asking_for_directions"),
      image: require("../assets/OBJECTS.png"),
      navigateTo: "asking",
    },
    {
      id: "2",
      title: t("ordering_coffee"),
      image: require("../assets/Group.png"),
      navigateTo: "OrderingCofee",
    },
    {
      id: "3",
      title: t("shopping"),
      image: require("../assets/shopping.png"),
      navigateTo: "Shooping",
    },
  ];

  const [checkoutUrl, setCheckoutUrl] = useState(null);

  const createCheckoutSession = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.post("/subscription/stripe-session", {});
      setCheckoutUrl(response.data.url);
    } catch (error) {
      Alert.alert("Error", "Failed to create checkout session.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get("/user/profile");
      const { plan, dailyGoal } = response.data.user;
      setPlan(plan);
      setGoal(dailyGoal);
    } catch (error) {
      console.error("Error fetching subscriptions:", error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchProfile();
    }, [])
  );

  const handleNavigationStateChange = (navState) => {
    if (navState.url.includes("/api/subscription/stripe-success")) {
      setCheckoutUrl(null);
      fetchProfile();
      navigation.navigate("dashborad");
      Alert.alert("Success", "Subscription successful!");
    } else if (navState.url.includes("/api/subscription/stripe-cancel")) {
      setCheckoutUrl(null);
    }
  };

  if (checkoutUrl) {
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

  const renderItem2 = ({ item }) => (
    <TouchableOpacity style={styles.scenarioCard}>
      <Text style={styles.scenarioTitle}>{item.title}</Text>
      <Image source={item.image} style={styles.scenarioImage} />
      <View style={styles.actionRow}>
        <TouchableOpacity
          style={styles.learnMoreButton}
          onPress={() => navigation.navigate(item.navigateTo)}
        >
          <Text style={styles.learnMoreText}>{t("learn_more")}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.downloadButton}>
          <AntDesign name="download" size={20} color={"#AAAAAA"} />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="white" />
      </View>
    );
  }

  return (
    <SafeAreaView style={{ flexGrow: 1, backgroundColor: "#121212" }}>
      <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          {plan === "Free" ? (
            <View style={styles.greetingSection}>
              <Text style={styles.greetingTitle}>{t("good_morning")}</Text>
              <Text style={styles.greetingSubtitle}>{t("ready_for_lesson")}</Text>
              <LinearGradient
                colors={["#8E44AD", "#4A90E2"]}
                style={styles.premiumCard}
              >
                <View style={{ width: "50%" }}>
                  <Text style={styles.premiumTitle}>{t("premium_plan")}</Text>
                  <Text style={styles.premiumSubtitle}>
                    {t("unlock_features")}
                  </Text>
                  <TouchableOpacity
                    style={styles.upgradeButton}
                    onPress={createCheckoutSession}
                  >
                    <Text style={styles.upgradeButtonText}>{t("upgrade")}</Text>
                  </TouchableOpacity>
                </View>
                <Image
                  source={require("../assets/robot.png")}
                  style={styles.premiumImage}
                />
              </LinearGradient>
            </View>
          ) : (
            <View style={{ paddingLeft: 10, width: "100%" }}>
              <Premium width={width - 20} height={(width - 20) * 0.6} />
            </View>
          )}

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t("statistics")}</Text>
            <LinearGradient
              colors={[
                "rgba(255, 255, 255, 0.1)",
                "rgba(255, 255, 255, 0.2)",
                "rgba(255, 255, 255, 0)",
              ]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={[styles.gradient, styles.statRow]}
            >
              <Text style={styles.statText}>
                {t("learning_time", { minutes: learningTime.minutes || 0 })}
              </Text>
              <CircularProgress
                percentage={
                  goal ? Math.round((learningTime.minutes / goal) * 100) : 0
                }
              />
            </LinearGradient>
          </View>

          <View style={styles.optionsRow}>
            <TouchableOpacity
              style={styles.optionCard}
              onPress={() => navigation.navigate("ChatHome")}
            >
              <Ionicons
                name="chatbubble-ellipses-outline"
                size={29}
                color="#8E44AD"
              />
              <View
                style={{
                  flexDirection: "row",
                  gap: 35,
                  alignItems: "flex-end",
                }}
              >
                <Text style={styles.optionText}>{t("chat_with_language")}</Text>
                <NextButton />
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.optionCard}
              onPress={() => navigation.navigate("VoiceChat")}
            >
              <Ionicons name="mic-outline" size={32} color="#8E44AD" />
              <View
                style={{
                  flexDirection: "row",
                  gap: 34,
                  alignItems: "flex-end",
                }}
              >
                <Text style={styles.optionText}>{t("talk_with_language")}</Text>
                <NextButton />
              </View>
            </TouchableOpacity>
          </View>
          <Text style={[styles.sectionTitle, { paddingLeft: 15 }]}>
            {t("practical_scenarios")}
          </Text>

          <FlatList
            data={scenarios}
            renderItem={renderItem2}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.scenarioRow}
          />
          {plan === "Free" && (
            <View className="px-1">
              <FlatList
                data={cardComponents}
                renderItem={renderItem}
                keyExtractor={(item) => item.id}
                horizontal
                showsHorizontalScrollIndicator={false}
                snapToInterval={CARD_WIDTH + CARD_SPACING}
                decelerationRate="fast"
                contentContainerStyle={{ paddingHorizontal: CARD_SPACING / 2 }}
              />
            </View>
          )}
        </ScrollView>
        <CustomNavigationBar navigation={navigation} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#121212", // Optional background color
  },
  scrollContainer: {
    paddingBottom: 100,
  },
  gradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
    borderWidth: 1,
    borderRadius: 10,
    padding: 17,
    backgroundColor: "#1E1E1E", // Fallback background color
    elevation: 6, // Shadow for Android
    shadowColor: "#000", // Shadow color
    shadowOffset: { width: 0, height: 4 }, // Shadow position
    shadowOpacity: 0.3, // Shadow transparency
    shadowRadius: 4, // Shadow blur
  },
  greetingSection: {
    padding: 20,
  },
  greetingTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#8E44AD",
  },
  greetingSubtitle: {
    fontSize: 16,
    color: "#AAAAAA",
    marginBottom: 20,
  },
  premiumCard: {
    flexDirection: "row",
    borderRadius: 16,
    padding: 20,
    justifyContent: "space-between",
    alignItems: "center",
  },
  premiumTitle: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "bold",
  },
  premiumSubtitle: {
    color: "#B7B7B7",
    fontSize: 14,
    marginVertical: 10,
   
  },
  upgradeButton: {
    backgroundColor: "#1C1C1C",
    borderRadius: 8,
    height: 40,
    width: 100,
    justifyContent: "center",
    alignItems: "center",
  },
  upgradeButtonText: {
    color: "#FFF",
    fontWeight: "bold",
  },
  safeArea: {
    flexGrow: 1,
    paddingBottom: 10,
    backgroundColor: "white",
  },
  premiumImage: {
    width: 110,
    height: 130,
  },
  section: {
    padding: 10,
  },
  sectionTitle: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },

  statText: {
    color: "#FFFFFF",
    fontSize: 14,
  },
  optionsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  optionCard: {
    backgroundColor: "#1E1E1E",
    borderRadius: 12,
    padding: 15,
    alignItems: "start",
    width: "49%",
  },
  optionText: {
    color: "#FFFFFF",
    fontSize: 14,
    marginTop: 10,
    textAlign: "center",
    width: "50%",
  },
  scenarioRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 10,
  },

  sectionTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },

  scenarioCard: {
    width: 160,
    backgroundColor: "#8E44AD",
    borderRadius: 8,
    padding: 12,
    marginRight: 16,
    alignItems: "center",
  },
  scenarioTitle: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
  },
  scenarioImage: {
    width: 120,
    height: 100,
    resizeMode: "contain",
    marginBottom: 8,
  },
  actionRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
  learnMoreButton: {
    backgroundColor: "#000",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
  },
  learnMoreText: {
    color: "#fff",
    fontSize: 10,
  },
  downloadButton: {
    marginLeft: 2,
    position: "absolute",
    right: 0,
  },
  scenarioImage: {
    width: 60,
    height: 60,
    marginBottom: 10,
    marginTop: 10,
  },
  scenarioTitle: {
    color: "#090808",
    fontSize: 14,
    textAlign: "center",
    fontWeight: "500",
  },
  planCard: {
    backgroundColor: "#1E1E1E",
    borderRadius: 12,
    padding: 15,
  },
  planTitle: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  planPrice: {
    color: "#7F00FF",
    fontSize: 22,
    fontWeight: "bold",
    marginVertical: 10,
  },
  planFeature: {
    color: "#FFFFFF",
    fontSize: 14,
    marginBottom: 5,
  },
  bottomNav: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "#7F00FF",
    height: 70,
    alignItems: "center",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    position: "absolute",
    bottom: 0,
    width: "100%",
  },
  navItem: {
    justifyContent: "center",
    alignItems: "center",
  },
  navText: {
    color: "#FFFFFF",
    fontSize: 12,
    marginTop: 4,
  },
});
