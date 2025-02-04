import React from "react";
import { View, Text, Modal, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons"; // ✅ Import Icon

const CustomAlert = ({ visible, message, onClose }) => {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.alertBox}>
          <View style={styles.titleContainer}>
            <Ionicons
              name="warning"
              size={24}
              color="#FFA500"
              style={styles.icon}
            />
            <Text style={styles.alertTitle}>Warning</Text>
          </View>
          <Text style={styles.alertMessage}>{message}</Text>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>OK</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.6)", // Dark overlay background
    justifyContent: "center",
    alignItems: "center",
  },
  alertBox: {
    backgroundColor: "#121212", // Black background
    width: "80%",
    padding: 20,
    borderRadius: 12, // More rounded corners
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#FFA500", // Orange border for warning effect
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  icon: {
    marginRight: 8,                          
  },
  alertTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFA500", // Warning color
  },
  alertMessage: {
    fontSize: 16,
    color: "white",
    textAlign: "center",
    marginBottom: 20,
  },
  closeButton: {
    backgroundColor: "#8E44AD", // Custom button color
    paddingVertical: 10,
    paddingHorizontal: 25,
    borderRadius: 8,
  },
  closeButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default CustomAlert;
