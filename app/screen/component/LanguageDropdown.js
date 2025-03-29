import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  FlatList,
  StyleSheet,
} from "react-native";
import { SimpleLineIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";

const languages = [
  { code: "en", name: "English" },
  { code: "es", name: "Spanish" },
  { code: "fr", name: "French" },
  { code: "de", name: "German" },
  { code: "ar", name: "Arabic" },
  { code: "zh-CN", name: "Chinese Mandarin" },
];

const LanguageDropdown = ({ handleChangeLanguage }) => {
  const [selectedLanguage, setSelectedLanguage] = useState({
    code: "en",
    name: "English",
  });
  const [prevLanguage, setPrevLanguage] = useState({
    code: "es",
    name: "Spanish",
  });
  const [isDropdownVisible, setDropdownVisible] = useState(false);
  const [isSelectingFor, setIsSelectingFor] = useState("selected");

  // ✅ Load Saved Language on App Start
  useEffect(() => {
    const loadLanguages = async () => {
      try {
        const storedSelectedLang = await AsyncStorage.getItem(
          "selectedLanguage"
        );
        const storedPrevLang = await AsyncStorage.getItem("prevLanguage");

        if (storedSelectedLang) {
          setSelectedLanguage(JSON.parse(storedSelectedLang));
        }
        if (storedPrevLang) {
          setPrevLanguage(JSON.parse(storedPrevLang));
        }
      } catch (error) {
        console.error("Error loading languages from storage:", error);
      }
    };

    loadLanguages();
  }, []);

  // ✅ Save Languages to Local Storage
  const saveLanguages = async (selected, prev) => {
    try {
      await AsyncStorage.setItem("selectedLanguage", JSON.stringify(selected));
      await AsyncStorage.setItem("prevLanguage", JSON.stringify(prev));
    } catch (error) {
      console.error("Error saving languages:", error);
    }
  };

  // ✅ Handle Language Selection
  const handleSelectLanguage = (language) => {
    if (isSelectingFor === "selected") {
      setPrevLanguage(selectedLanguage || { code: "es", name: "Spanish" });
      setSelectedLanguage(language);
      saveLanguages(
        language,
        selectedLanguage || { code: "es", name: "Spanish" }
      );
    } else {
      setPrevLanguage(language);
      saveLanguages(
        selectedLanguage || { code: "en", name: "English" },
        language
      );
    }
    setDropdownVisible(false);
  };

  // ✅ Swap Languages
  const swapLanguages = () => {
    setSelectedLanguage(prevLanguage);
    setPrevLanguage(selectedLanguage);
    saveLanguages(prevLanguage, selectedLanguage);
    handleChangeLanguage(prevLanguage.code);
  };

  return (
    <View style={styles.container}>
      {/* ✅ Language Selection Row */}
      <View style={styles.languageRow}>
        {/* ✅ Selected Language (Left) */}
        <TouchableOpacity
          style={styles.languageButton}
          onPress={() => {
            setIsSelectingFor("selected");
            setDropdownVisible(true);
          }}
        >
          <Text style={styles.languageText}>
            {selectedLanguage ? selectedLanguage.name : "Loading..."}
          </Text>
        </TouchableOpacity>

        {/* 🔄 Refresh Button to Swap Languages */}
        <TouchableOpacity onPress={swapLanguages}>
          <SimpleLineIcons name="refresh" size={20} color={"white"} />
        </TouchableOpacity>

        {/* ✅ Previous Language (Right) */}
        <TouchableOpacity
          style={styles.languageButton}
          onPress={() => {
            setIsSelectingFor("prev");
            setDropdownVisible(true);
          }}
        >
          <Text style={styles.languageText}>
            {prevLanguage ? prevLanguage.name : "Loading..."}
          </Text>
        </TouchableOpacity>
      </View>

      {/* ✅ Dropdown Modal */}
      <Modal
        visible={isDropdownVisible}
        animationType="fade"
        transparent={true}
        onRequestClose={() => setDropdownVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Select a Language</Text>
            <FlatList
              data={languages}
              keyExtractor={(item) => item.code}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.languageOption}
                  onPress={() => handleSelectLanguage(item)}
                >
                  <Text style={styles.languageOptionText}>{item.name}</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
  },
  languageRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  languageButton: {
    backgroundColor: "#8E44AD",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
  },
  languageText: {
    color: "white",
    fontSize: 13,
    fontWeight: "bold",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    backgroundColor: "#fff",
    width: "80%",
    borderRadius: 10,
    padding: 16,
  },
  modalTitle: {
    fontSize: 17,
    fontWeight: "bold",
    marginBottom: 10,
  },
  languageOption: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  languageOptionText: {
    fontSize: 16,
  },
});

export default LanguageDropdown;
