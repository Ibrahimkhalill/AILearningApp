import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import CircularButton from "../component/BackButton";
import Setting from "../component/Setting";
import CustomNavigationBar from "../component/CustomNavigationBar";

const ProfileScreen = ({ navigation }) => {
  const [name, setName] = useState("pappu roy");
  const [email, setEmail] = useState("Pappyroy6393@gmail.com");

  return (
    <SafeAreaView style={{ flexGrow: 1 }}>
      <ScrollView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <CircularButton navigation={navigation} />

          <Text style={styles.headerTitle}>Profile</Text>

          <Setting navigation={navigation} />
        </View>

        {/* Profile Image */}
        <View style={styles.profileImageContainer}>
          <Image
            source={{
              uri: "https://res.cloudinary.com/the-groomsman-suit/image/upload/f_jpg,h_1340,w_1624,q_auto:eco,f_auto/v1/gatsby-cloudinary/pages/index/spotlight-collection-mens-2?_a=AXAH4S10",
            }} // Replace with user's profile image URL
            style={styles.profileImage}
          />
        </View>

        {/* Input Fields */}
        <View style={styles.inputContainer}>
          {/* Full Name */}
          <Text style={styles.label}>Full Name</Text>
          <View style={styles.inputWrapper}>
            <Ionicons
              name="person"
              size={20}
              color="#aaa"
              style={styles.icon}
            />
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
              placeholder="Enter your full name"
              placeholderTextColor="#aaa"
              readOnly
            />
          </View>

          {/* Email */}
          <Text style={styles.label}>Email</Text>
          <View style={styles.inputWrapper}>
            <Ionicons name="mail" size={20} color="#aaa" style={styles.icon} />
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              placeholder="Enter your email"
              placeholderTextColor="#aaa"
              readOnly
            />
          </View>

          {/* Language */}
          <Text style={styles.label}>Language</Text>
          <View style={styles.inputWrapper}>
            <Image
              source={{
                uri: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a5/Flag_of_the_United_Kingdom_%281-2%29.svg/1200px-Flag_of_the_United_Kingdom_%281-2%29.svg.png",
              }} // Replace with flag icon URL
              style={styles.flagIcon}
            />
            <Text style={styles.languageText}>English</Text>
          </View>
        </View>

        {/* Edit Profile Button */}
        <TouchableOpacity style={styles.editProfileButton}>
          <Text style={styles.editProfileButtonText}>Edit Profile</Text>
        </TouchableOpacity>
      </ScrollView>
      <CustomNavigationBar navigation={navigation} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
    padding: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  headerTitle: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  profileImageContainer: {
    alignItems: "center",
    marginVertical: 16,
  },
  profileImage: {
    width: 128,
    height: 128,
    borderRadius: 64,
    borderWidth: 2,
    borderColor: "white",
  },
  inputContainer: {
    marginVertical: 16,
  },
  label: {
    color: "#fff",
    marginBottom: 8,
    fontSize: 14,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1E1E1E",
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#333",
    height: 55,
  },
  icon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    color: "#fff",
    fontSize: 16,
  },
  flagIcon: {
    width: 20,
    height: 20,
    marginRight: 8,
  },
  languageText: {
    color: "#fff",
    fontSize: 16,
  },
  editProfileButton: {
    backgroundColor: "#8E44AD",
    borderRadius: 8,
    alignItems: "center",
    paddingVertical: 12,
  },
  editProfileButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default ProfileScreen;
