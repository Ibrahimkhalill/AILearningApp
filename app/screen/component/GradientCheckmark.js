import React from "react";
import { View, StyleSheet } from "react-native";
import Svg, {
  Circle,
  Path,
  Defs,
  LinearGradient,
  Stop,
} from "react-native-svg";

export default function GradientCheckmark() {
  return (
    <View style={styles.container}>
      <Svg height="50" width="50" viewBox="0 0 50 50">
        <Defs>
          <LinearGradient id="grad" x1="0" y1="0" x2="1" y2="1">
            <Stop offset="0" stopColor="#7F00FF" stopOpacity="1" />
            <Stop offset="1" stopColor="#FF4500" stopOpacity="1" />
          </LinearGradient>
        </Defs>

        {/* Circle */}
        <Circle
          cx="25"
          cy="25"
          r="23"
          stroke="url(#grad)"
          strokeWidth="4"
          fill="none"
        />

        {/* Checkmark */}
        <Path
          d="M15 25 L22 32 L35 18"
          stroke="#00FF00"
          strokeWidth="4"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#121212",
    flex: 1,
  },
});
