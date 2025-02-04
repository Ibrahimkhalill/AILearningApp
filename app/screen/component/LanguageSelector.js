import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import DropDownPicker from "react-native-dropdown-picker";

const LanguageSelector = ({
  onLanguageChange,
  selectedLanguage,
  isEditing,
}) => {
  const [open, setOpen] = useState(false);
  const [selectedLang, setSelectedLang] = useState(selectedLanguage);
  console.log(selectedLanguage);

  // ✅ Available Languages with Flags
  const languages = [
    {
      label: "English",
      value: "en",
      icon: () => (
        <Image
          source={{ uri: "https://flagcdn.com/w40/gb.png" }}
          style={styles.flag}
        />
      ),
    },
    {
      label: "Spanish",
      value: "es",
      icon: () => (
        <Image
          source={{ uri: "https://flagcdn.com/w40/es.png" }}
          style={styles.flag}
        />
      ),
    },
    {
      label: "French",
      value: "fr",
      icon: () => (
        <Image
          source={{ uri: "https://flagcdn.com/w40/fr.png" }}
          style={styles.flag}
        />
      ),
    },
    {
      label: "German",
      value: "de",
      icon: () => (
        <Image
          source={{ uri: "https://flagcdn.com/w40/de.png" }}
          style={styles.flag}
        />
      ),
    },
    {
      label: "Italian",
      value: "it",
      icon: () => (
        <Image
          source={{ uri: "https://flagcdn.com/w40/it.png" }}
          style={styles.flag}
        />
      ),
    },
    {
      label: "Bengali",
      value: "bn",
      icon: () => (
        <Image
          source={{ uri: "https://flagcdn.com/w40/bd.png" }}
          style={styles.flag}
        />
      ),
    },
  ];

  // ✅ Save Language Selection
  const handleSelectLanguage = async (language) => {
    setSelectedLang(language);
    onLanguageChange(language);
    await AsyncStorage.setItem("selectedLanguage", language);
  };

  return (
    <View style={styles.container}>
      {/* ✅ Wrap DropDownPicker in View to Prevent Scroll Issue */}
      <DropDownPicker
        open={open}
        value={selectedLang}
        items={languages}
        setOpen={setOpen}
        setValue={(callback) => {
          const selectedValue = callback(selectedLang);
          handleSelectLanguage(selectedValue);
        }}
        placeholder={selectedLanguage}
        style={styles.dropdown}
        dropDownContainerStyle={{
          backgroundColor: "#121212",
          borderColor: "#333",
        }}
        textStyle={styles.textStyle}
        listMode="SCROLLVIEW" // ✅ Keeps dropdown inside the view
        arrowIconStyle={{ tintColor: "white" }}
        autoScroll={true}
        disabled={!isEditing}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  label: { color: "white", fontSize: 16 },
  dropdown: {
    backgroundColor: "#1E1E1E",
    borderColor: "#333",
  },
  dropdownContainer: {
    backgroundColor: "#121212",
    borderColor: "#333",
  },
  textStyle: { color: "white", fontSize: 14 },
  flag: { width: 20, height: 15, marginRight: 4 },
});

export default LanguageSelector;
