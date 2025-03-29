import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import axiosInstance from "./component/axiosInstance";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useTranslation } from "react-i18next";

const languages = [
  {
    id: "1",
    name: "English",
    value: "en",
    localName: "(English)",
    flag: "https://flagcdn.com/w40/gb.png",
  },
  {
    id: "2",
    name: "Spanish",
    value: "es",
    localName: "(Español)",
    flag: "https://flagcdn.com/w40/es.png",
  },
  {
    id: "3",
    name: "Chinese Mandarin",
    value: "cn",
    localName: "(中文)",
    flag: "https://static.vecteezy.com/system/resources/thumbnails/051/966/111/small/china-country-round-flag-free-png.png",
  },
  {
    id: "4",
    name: "French",
    value: "fr",
    localName: "(Français)",
    flag: "https://flagcdn.com/w40/fr.png",
  },
  {
    id: "5",
    name: "Arabic",
    value: "ar",
    localName: "(العربية)",
    flag: "https://png.pngtree.com/png-vector/20220511/ourmid/pngtree-round-country-flag-saudi-arabia-png-image_4570913.png",
  },
  {
    id: "6",
    name: "Egypt",
    value: "ar-eg",
    localName: "(Syria)",
    flag: "https://e7.pngegg.com/pngimages/402/257/png-clipart-flag-of-egypt-national-flag-egypt-flag-egypt.png",
  },
];

export default function LanguageSelection({ navigation }) {
  const [selectedLanguage, setSelectedLanguage] = useState(null);
  const {i18n} = useTranslation()
  const updateProfile = async (language) => {
    try {
      const response = await axiosInstance.put("/user/profile", {
        language,
      });
      if (response.status === 200) {
        await AsyncStorage.setItem("selectedLanguage", language);
        await i18n.changeLanguage(language); // Update the app's language
        navigation.navigate("expertiselevel");
      }
    } catch (error) {
      console.log("Error updating profile:", error);
    }
  };
  
  const renderItem = ({ item }) => {
    const isSelected = selectedLanguage === item.id;
    return (
      <TouchableOpacity
        style={[styles.languageItem, isSelected && styles.selectedItem]}
        onPress={() => {
          setSelectedLanguage(item.id);
          updateProfile(item.value);
        }}
      >
        <Image source={{ uri: item.flag }} style={styles.flag} />
        <View style={styles.languageTextContainer}>
          <Text style={styles.languageName}>{item.name}</Text>
          <Text style={styles.localName}>{item.localName}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}></Text>
        <Text style={styles.title}>Language</Text>
        <Ionicons name="search-outline" size={24} color="#FFFFFF" />
      </View>
      <FlatList
        data={languages}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
    paddingHorizontal: 20,
    paddingTop: 50,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  listContainer: {
    paddingBottom: 20,
  },
  languageItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1E1E1E",
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#444",
  },
  selectedItem: {
    backgroundColor: "#7F00FF",
    borderColor: "#7F00FF",
  },
  flag: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginRight: 15,
  },
  languageTextContainer: {
    flex: 1,
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-between",
  },
  languageName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  localName: {
    fontSize: 14,
    color: "#AAAAAA",
  },
});
