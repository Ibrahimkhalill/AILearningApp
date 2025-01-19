import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";

export default function CustomNavigationBar({ navigation }) {
  const [selectedTab, setSelectedTab] = useState("Home");

  const tabs = [
    { label: "Home", icon: "home-outline", url: "dashborad" },
    { label: "Chat", icon: "chatbubble-outline", url: "ChatHome" },
    { label: "Voice", icon: "mic-outline", url: "VoiceChat" },
    { label: "Profile", icon: "person-outline", url: "profile" },
  ];

  return (
    <View style={styles.container}>
      {tabs.map((tab) => (
        <TouchableOpacity
          key={tab.label}
          style={styles.tab}
          onPress={() => {
            setSelectedTab(tab.label);
            navigation.navigate(tab.url);
          }}
        >
          <Ionicons
            name={tab.icon}
            size={24}
            color={selectedTab === tab.label ? "#FFFFFF" : "#D3D3D3"}
          />
          <Text
            style={[
              styles.label,
              { color: selectedTab === tab.label ? "#FFFFFF" : "#D3D3D3" },
            ]}
          >
            {tab.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: "#8E44AD", // Purple background
    height: 70,
    borderRadius: 20,
    position: "absolute",
    bottom: 0,
    width: "100%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 8,
  },
  tab: {
    justifyContent: "center",
    alignItems: "center",
  },
  label: {
    fontSize: 12,
    marginTop: 4,
  },
});
