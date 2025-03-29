import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Svg, { Circle, G, Text as SvgText } from "react-native-svg";

const CircularProgress = ({ percentage }) => {
  const size = 40; // Size of the SVG container
  const strokeWidth = 2; // Width of the progress bar
  const radius = (size - strokeWidth) / 2; // Radius of the circle
  const circumference = 2 * Math.PI * radius; // Circumference of the circle
  const total = percentage >= 100 ? 100 : percentage 
  const progress = (total / 100) * circumference; // Progress length

  return (
    <View style={styles.container}>
      <Svg width={size} height={size}>
        <G rotation="-90" origin={`${size / 2}, ${size / 2}`}>
          {/* Background Circle */}
          <Circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="#FFFFFF"
            strokeWidth={strokeWidth}
            fill="transparent"
          />
          {/* Progress Circle */}
          <Circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="#8E44AD"
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={circumference - progress}
            strokeLinecap="round"
            fill="transparent"
          />
        </G>
        {/* Text in the Center */}
        <SvgText
          x={size / 2}
          y={size / 2}
          textAnchor="middle"
          dy=".3em"
          fontSize="8"
          fill="#FFFFFF"
          fontWeight="bold"
        >
          {`${total}%`}
        </SvgText>
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#121212",
  },
  container: {
    justifyContent: "center",
    alignItems: "center",
  },
});

export default CircularProgress;
