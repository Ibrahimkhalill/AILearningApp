import React from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import Svg, { Circle, Defs, LinearGradient, Stop } from "react-native-svg";

export default function EditButton() {
  return (
    <View style={styles.container}>
      <FontAwesome5 name="pen" size={14} color={"#969696"} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#2E2E2E",
    borderRadius: "50%",
    width: 30,
    height: 30,
  },
  innerButton: {
    position: "absolute",
    width: 20 /* Adjusted size */,
    height: 20 /* Adjusted size */,
    borderRadius: 15 /* Half of width/height */,
    backgroundColor: "#8E44AD",
    justifyContent: "center",
    alignItems: "center",
  },
});
