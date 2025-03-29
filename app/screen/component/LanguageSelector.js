import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  FlatList,
  Image,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useTranslation } from "react-i18next";

const CustomLanguageSelector = ({
  onLanguageChange,
  selectedLanguage,
  isEditing = true,
}) => {
  const [selectedLang, setSelectedLang] = useState(selectedLanguage || "en"); // Default to "en"
  const [isModalVisible, setIsModalVisible] = useState(false);
  const { t, i18n } = useTranslation(); // Initialize translation hooks

  // Available Languages with Correct Flags
  const languages = [
    {
      label: "English",
      value: "en",
      flag: "https://flagcdn.com/w40/gb.png", // UK flag for English
    },
    {
      label: "Spanish",
      value: "es",
      flag: "https://flagcdn.com/w40/es.png", // Spain flag
    },
    {
      label: "French",
      value: "fr",
      flag: "https://flagcdn.com/w40/fr.png", // France flag
    },
    {
      label: "Chinese Mandarin",
      value: "zh",
      flag: "https://flagcdn.com/w40/cn.png", // China flag
    },
    {
      label: "Arabic",
      value: "ar",
      flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0d/Flag_of_Saudi_Arabia.svg/800px-Flag_of_Saudi_Arabia.svg.png", // Saudi Arabia flag
    },
    {
      label: "German",
      value: "de",
      flag: "https://flagcdn.com/w40/de.png", // Germany flag
    },
    {
      label: "Polish",
      value: "pl",
      flag: "https://flagcdn.com/w40/pl.png", // Poland flag
    },
  ];

  // Load saved language on mount
  useEffect(() => {
    const loadSavedLanguage = async () => {
      try {
        const savedLanguage = await AsyncStorage.getItem("selectedLanguage");
        if (savedLanguage) {
          setSelectedLang(savedLanguage);
          await i18n.changeLanguage(savedLanguage); // Sync i18n with stored language
          if (onLanguageChange) onLanguageChange(savedLanguage); // Notify parent
        }
      } catch (error) {
        console.error("Error loading saved language:", error);
      }
    };
    loadSavedLanguage();
  }, [i18n, onLanguageChange]);

  // Handle language selection
  const handleSelectLanguage = async (language) => {
    try {
      setSelectedLang(language);
      if (onLanguageChange) onLanguageChange(language); // Notify parent component
      await AsyncStorage.setItem("selectedLanguage", language); // Save to storage
      console.log("Selected language:", language);
      
      setIsModalVisible(false); // Close the modal after selection
    } catch (error) {
      console.error("Error saving language:", error);
    }
  };

  // Find the current language's label and flag for display
  const currentLanguage = languages.find((lang) => lang.value === selectedLang);

  return (
    <View style={styles.container}>
      {/* Language Selector Button */}
      <TouchableOpacity
        onPress={() => isEditing && setIsModalVisible(true)}
        style={[
          styles.languageButton,
          !isEditing && styles.disabledButton, // Dim the button if not editable
        ]}
        disabled={!isEditing}
      >
        <Image source={{ uri: currentLanguage?.flag }} style={styles.flag} />
        <Text style={styles.languageText}>
          {currentLanguage?.label || t("select_language")}
        </Text>
        <Text style={styles.arrow}>▼</Text>
      </TouchableOpacity>

      {/* Modal for Language Selection */}
      <Modal
        visible={isModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <FlatList
              data={languages}
              keyExtractor={(item) => item.value}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => handleSelectLanguage(item.value)}
                  style={styles.languageItem}
                >
                  <Image source={{ uri: item.flag }} style={styles.flag} />
                  <Text style={styles.languageItemText}>{item.label}</Text>
                </TouchableOpacity>
              )}
              style={styles.languageList}
            />
            <TouchableOpacity
              onPress={() => setIsModalVisible(false)}
              style={styles.closeButton}
            >
              <Text style={styles.closeButtonText}>{t("close")}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
    zIndex: 1000, // Ensure it appears above other elements
  },
  languageButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1E1E1E",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#333",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5, // For Android shadow
  },
  disabledButton: {
    opacity: 0.5,
  },
  flag: {
    width: 24,
    height: 18,
    marginRight: 10,
  },
  languageText: {
    color: "#FFFFFF",
    fontSize: 16,
    flex: 1,
  },
  arrow: {
    color: "#FFFFFF",
    fontSize: 12,
    marginLeft: 5,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#121212",
    borderRadius: 10,
    padding: 15,
    width: "80%",
    maxHeight: "60%",
  },
  languageList: {
    maxHeight: 300,
  },
  languageItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#333",
  },
  languageItemText: {
    color: "#FFFFFF",
    fontSize: 16,
    marginLeft: 10,
  },
  closeButton: {
    marginTop: 15,
    paddingVertical: 10,
    backgroundColor: "#8E44AD",
    borderRadius: 8,
    alignItems: "center",
  },
  closeButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default CustomLanguageSelector;