import React, { useState } from "react";
import { 
  View, 
  Text, 
  TouchableOpacity, 
  Modal, 
  FlatList, 
  StyleSheet, 
  TouchableWithoutFeedback 
} from "react-native";
import { Ionicons } from "@expo/vector-icons"; // Import Ionicons

const CustomDropdown = ({ 
  onLanguageChange, 
  isEditing, 
  dailyGoal, 
  label, 
  data 
}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedValue, setSelectedValue] = useState(dailyGoal?.value || dailyGoal); // Handle object or string

  const handleSelect = (item) => {
    setSelectedValue(item.value);
    setModalVisible(false);
    if (onLanguageChange) {
      onLanguageChange(item.value); // Pass the value to the parent
    }
  };

  // Close modal when tapping outside (on the overlay)
  const handleOverlayPress = () => {
    setModalVisible(false);
  };

  return (
    <View style={styles.container}>
      {/* Dropdown Button */}
      <TouchableOpacity 
        style={[styles.dropdown, !isEditing && styles.disabled]}
        onPress={() => isEditing && setModalVisible(true)}
        disabled={!isEditing}
      >
        <View style={styles.dropdownContent}>
          <Text style={styles.selectedText}>
            {data.find(item => item.value === selectedValue)?.label || label}
          </Text>
          <Ionicons 
            name={modalVisible ? "chevron-up" : "chevron-down"} 
            size={20} 
            color="white" 
            style={styles.arrowIcon}
          />
        </View>
      </TouchableOpacity>

      {/* Modal for Dropdown List */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableWithoutFeedback onPress={handleOverlayPress}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback onPress={(e) => e.stopPropagation()}>
              <View style={styles.modalContent}>
                <FlatList
                  data={data}
                  keyExtractor={(item) => item.value}
                  renderItem={({ item }) => (
                    <TouchableOpacity 
                      style={styles.option} 
                      onPress={() => handleSelect(item)}
                    >
                      <Text style={styles.optionText}>{item.label}</Text>
                    </TouchableOpacity>
                  )}
                />
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
    zIndex: 9999, // High z-index to ensure it stays on top
  },
  dropdown: {
    backgroundColor: "#1E1E1E",
    paddingHorizontal: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#333",
    height: 50, // Match the height of your input fields for consistency
    justifyContent:"center"
  },
  dropdownContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between", // Space between text and icon
  },
  selectedText: {
    color: "white",
    fontSize: 14,
  },
  arrowIcon: {
    marginLeft: 10, // Add some spacing between text and icon
  },
  disabled: {
    opacity: 0.5,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    zIndex: 9999, // High z-index for the overlay
  },
  modalContent: {
    backgroundColor: "#222",
    padding: 15,
    borderRadius: 8,
    width: "80%",
    zIndex: 10000, // Even higher z-index for the content
  },
  option: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#444",
  },
  optionText: {
    color: "white",
    fontSize: 16,
  },
});

export default CustomDropdown;