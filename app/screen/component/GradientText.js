import React from "react";
import { StyleSheet, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Svg, {
  Text as SvgText,
  Defs,
  LinearGradient as SvgLinearGradient,
  Stop,
} from "react-native-svg";

const GradientText = ({ text }) => {
  return (
    <Svg height="60" width="100%">
      <Defs>
        <SvgLinearGradient id="gradient" x1="0" x2="1" y1="0" y2="0">
          <Stop offset="0%" stopColor="rgba(74, 144, 226, 1)" />
          <Stop offset="30%" stopColor="rgba(84, 249, 255, 1)" />
          <Stop offset="75%" stopColor="rgba(252, 83, 240, 1)" />
          <Stop offset="100%" stopColor="rgba(142, 68, 173, 1)" />
        </SvgLinearGradient>
      </Defs>
      <SvgText
        fill="url(#gradient)"
        fontSize="34"
        fontWeight="bold"
        textAnchor="middle"
        x="50%"
        y="50%"
        alignmentBaseline="middle"
      >
        {text}
      </SvgText>
    </Svg>
  );
};

export default GradientText;
