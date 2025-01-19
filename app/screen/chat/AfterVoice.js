import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  ScrollView,
} from "react-native";
import { Ionicons, FontAwesome5 } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import CircularButton from "../component/BackButton";
import { LinearGradient } from "expo-linear-gradient";
import EditButton from "../component/EditButton";

const AfterVoice = ({ navigation }) => {
  return (
    <SafeAreaView style={{ flexGrow: 1 }}>
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity>
            <CircularButton navigation={navigation} />
          </TouchableOpacity>
          <View style={{ flexDirection: "row" }}>
            <Text style={styles.headerTitle}>Speaking To</Text>
            <Text style={styles.headerTitle1}>AI BOT</Text>
          </View>
          <TouchableOpacity onPress={() => navigation.navigate("LanguageChat")}>
            <EditButton />
          </TouchableOpacity>
        </View>

        <View style={styles.contentContainer}>
          <View style={styles.imageContainer}>
            <Image
              source={require("../../assets/speaker.png")}
              style={styles.image}
            />
          </View>

          <LinearGradient
            colors={["rgba(142, 68, 173, 0.2)", "rgba(142, 68, 173, 0.2)"]}
            style={styles.controlsContainer}
          >
            <Text className="text-white">I Am Shuvo....</Text>
          </LinearGradient>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
  },
  headerTitle: {
    color: "#4A90E2",
    fontSize: 20,
    fontWeight: "bold",
  },
  headerTitle1: {
    color: "#8E44AD",
    fontSize: 20,
    fontWeight: "bold",
    marginLeft: 8,
  },
  contentContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
    marginTop: 30,
  },
  imageContainer: {
    padding: 8,
    marginBottom: 50,
  },
  image: {
    width: 250,
    height: 250,
    borderRadius: 10,
  },
  questionText: {
    color: "#fff",
    fontSize: 20,
    textAlign: "center",
  },
  questionText2: {
    color: "#818181",
    fontSize: 20,
    textAlign: "center",
    marginBottom: 30,
  },
  controlsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 10,
    width: "90%",
    marginTop: 20,
    height: 200,
    borderRadius: 12,
  },
  controlButton: {
    width: 50,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#333",
    borderRadius: 25,
  },
  microphoneButton: {
    width: 70,
    height: 70,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#8E44AD",
    borderRadius: 35,
  },
  microphoneContainer: {
    width: 110,
    height: 110,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 55,
    opacity: 20,
  },
});

export default AfterVoice;
