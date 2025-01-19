import React, { useState } from "react";
import { TouchableOpacity, View, Text, StyleSheet } from "react-native";

export default function CustomCheckbox({ label }) {
  const [checked, setChecked] = useState(false);

  return (
    <View style={styles.checkboxContainer}>
      <TouchableOpacity
        style={[styles.checkbox, checked && styles.checked]}
        onPress={() => setChecked(!checked)}
      />
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
   
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: "#7F00FF",
    borderRadius: 4,
    marginRight: 10,
  },
  checked: {
    backgroundColor: "#7F00FF",
  },
  label: {
    color: "#FFFFFF",
    fontSize: 12,
  },
});
