import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  StatusBar,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import CircularButton from "./component/BackButton";
import { SafeAreaView } from "react-native-safe-area-context";
import Octicons from "@expo/vector-icons/Octicons";
export default function Asking({ navigation }) {
  return (
    <SafeAreaView style={{ flexGrow: 1 , backgroundColor:"#121212" }}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <CircularButton navigation={navigation} />
          <Image
            source={require("../assets/OBJECTS.png")} // Replace with your image URL
            style={styles.headerImage}
          />
          <View></View>
        </View>

        {/* Content */}
        <ScrollView contentContainerStyle={styles.contentContainer}>
          <QuestionAnswer
            question="Excuse Me, Can You Tell Me Where The Nearest Bus Stop Is"
            answer="Sure! The Nearest Bus Stop Is Just Two Blocks Down The Road, On Your Right-Hand Side"
          />

          <QuestionAnswer
            question="How Do I Get To The Train Station?"
            answer="Go Straight For About 10 Minutes, Then Take A Left At The Second Traffic Light. The Train Station Will Be On Your Left."
          />

          <QuestionAnswer
            question="Can You Show Me The Way To The Nearest Hospital?"
            answer="Yes, Head Straight Down This Road, Turn Right At The Roundabout, And You'll See The Hospital On Your Left."
          />

          <QuestionAnswer
            question="Can You Show Me The Way To The Nearest Hospital?"
            answer="Yes, Head Straight Down This Road, Turn Right At The Roundabout, And You'll See The Hospital On Your Left."
          />
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

function QuestionAnswer({ question, answer }) {
  return (
    <View style={styles.qaContainer}>
      <View className="flex flex-row gap-2">
        <View className="w-8">
          <Octicons name="dot-fill" size={24} color="#8E44AD" />
        </View>
        <Text style={styles.question}> {question}</Text>
      </View>
      <View className="flex flex-row gap-2">
        <Text className="w-8 text-[#D4D4D4]">Ans:</Text>
        <Text style={styles.answer}> {answer}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
  },
  header: {
    flexDirection: "row",
    alignItems: "start",
    padding: 13,
    justifyContent: "space-between",
  },
  headerImage: {
    width: 100,
    height: 100,
  },
  contentContainer: {
    padding: 16,
  },
  qaContainer: {
    marginBottom: 16,
  },
  question: {
    color: "#8E44AD",
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 8,
    textAlign: "left",
    width: "90%",
  },
  answer: {
    color: "#D4D4D4",
    fontSize: 13,
    lineHeight: 20,
    width: "90%",
  },
});
