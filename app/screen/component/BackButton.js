import React from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Svg, { Circle, Defs, LinearGradient, Stop } from "react-native-svg";

export default function CircularButton({ navigation }) {
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => navigation.goBack()}
    >
      {/* Outer Circle with Gradient */}
      <Svg height="30" width="30">
        <Defs>
          <LinearGradient id="grad" x1="0" y1="0" x2="1" y2="0">
            <Stop offset="0" stopColor="#8E44AD" stopOpacity="1" />
            <Stop offset="1" stopColor="#000000" stopOpacity="1" />
          </LinearGradient>
        </Defs>
        <Circle
          cx="15" /* Adjusted center */
          cy="15" /* Adjusted center */
          r="14" /* Reduced radius to fit inside 40x40 */
          stroke="url(#grad)"
          strokeWidth="2" /* Reduced stroke width */
          fill="none"
        />
      </Svg>

      {/* Inner Touchable Button */}
      <View style={styles.innerButton}>
        <Ionicons name="arrow-back" size={14} color="#FFFFFF" />{" "}
        {/* Smaller icon */}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
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
