import React, { useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  Dimensions,
  FlatList,
} from "react-native";
import {
  Ionicons,
  FontAwesome5,
  MaterialCommunityIcons,
  AntDesign,
} from "@expo/vector-icons";

import { SafeAreaView } from "react-native-safe-area-context";
import CustomNavigationBar from "./component/CustomNavigationBar";
import { LinearGradient } from "expo-linear-gradient";
import CircularButton from "./component/BackButton";
import NextButton from "./component/NextButton";
import PremiumCard from "./component/PremiumCard";
import FreeCard from "./component/FreeCard";
import CircularProgress from "./component/CircularProgress";

export default function Dashboard({ navigation }) {
  const { width } = Dimensions.get("window");

  const CARD_WIDTH = width * 0.8; // Each card takes up 70% of the screen
  const CARD_SPACING = 16;

  // List of components to render
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
      title: "Asking for Directions",
      image: require("../assets/OBJECTS.png"),
      navigateTo: "asking",
    },
    {
      id: "2",
      title: "Ordering Coffee",
      image: require("../assets/Group.png"),
      navigateTo: "OrderingCofee",
    },
    {
      id: "3",
      title: "Shoping",
      image: require("../assets/shopping.png"),
      navigateTo: "Shooping",
    },
  ];
  const renderItem2 = ({ item }) => (
    <TouchableOpacity style={styles.scenarioCard}>
      <Text style={styles.scenarioTitle}>{item.title}</Text>
      <Image source={item.image} style={styles.scenarioImage} />
      <View style={styles.actionRow}>
        <TouchableOpacity
          style={styles.learnMoreButton}
          onPress={() => navigation.navigate(item.navigateTo)}
        >
          <Text style={styles.learnMoreText}>Learn More</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.downloadButton}>
          <AntDesign name="download" size={20} color={"#AAAAAA"} />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
  return (
    <SafeAreaView style={{ flexGrow: 1 }}>
      <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          {/* Greeting Section */}
          <View style={styles.greetingSection}>
            <Text style={styles.greetingTitle}>Good Morning</Text>
            <Text style={styles.greetingSubtitle}>Ready For A New Lesson</Text>
            <LinearGradient
              colors={["#8E44AD", "#4A90E2"]}
              style={styles.premiumCard}
            >
              <View>
                <Text style={styles.premiumTitle}>Premium Plan</Text>
                <Text style={styles.premiumSubtitle}>
                  Unlock features and get AI recommendations
                </Text>
                <TouchableOpacity style={styles.upgradeButton}>
                  <Text style={styles.upgradeButtonText}>Upgrade</Text>
                </TouchableOpacity>
              </View>

              <Image
                source={require("../assets/robot.png")}
                style={styles.premiumImage}
              />
            </LinearGradient>
          </View>

          {/* Statistics Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Statistics</Text>
            <LinearGradient
              colors={[
                "rgba(255, 255, 255, 0.1)", // 0% opacity: Fully visible white
                "rgba(255, 255, 255, 0.2)", // 77% opacity: 22% visible white
                "rgba(255, 255, 255, 0))", // 100% opacity: Fully transparent white
              ]}
              start={{ x: 0, y: 0 }} // Starting point (top-left)
              end={{ x: 1, y: 0 }} // Ending point (top-right)
              style={[styles.gradient, styles.statRow]}
            >
              <Text style={styles.statText}>Learning Times: 5 hours</Text>
              <CircularProgress percentage={20} />
              {/* <Ionicons name="time-outline" size={20} color="#FFFFFF" /> */}
            </LinearGradient>
            <LinearGradient
              colors={[
                "rgba(255, 255, 255, 0.1)", // 0% opacity: Fully visible white
                "rgba(255, 255, 255, 0.2)", // 77% opacity: 22% visible white
                "rgba(255, 255, 255, 0))", // 100% opacity: Fully transparent white
              ]}
              start={{ x: 0, y: 0 }} // Starting point (top-left)
              end={{ x: 1, y: 0 }} // Ending point (top-right)
              style={[styles.gradient, styles.statRow]}
            >
              <Text style={styles.statText}>New Words: 25 words</Text>
              <Ionicons name="bar-chart-outline" size={20} color="#FFFFFF" />
            </LinearGradient>
          </View>

          {/* Options Section */}
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
                <Text style={styles.optionText}>Chat With Language</Text>
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
                <Text style={styles.optionText}>Talk With Language</Text>
                <NextButton />
              </View>
            </TouchableOpacity>
          </View>

          {/* Practical Scenarios */}
          <FlatList
            data={scenarios}
            renderItem={renderItem2}
            keyExtractor={(item) => item.id}
            horizontal // Makes the FlatList scroll horizontally
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.scenarioRow}
          />
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
          {/* Select A Plan */}
          {/* <View style={styles.greetingSection}>
            <Text style={styles.sectionTitle}>Select a plan</Text>
            <PremiumCard />
            <FreeCard />
          </View> */}
        </ScrollView>

        {/* Bottom Navigation */}
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
