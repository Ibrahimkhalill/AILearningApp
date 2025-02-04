import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  ScrollView,
  ActivityIndicator,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import CircularButton from "../component/BackButton";
import Setting from "../component/Setting";
import CustomNavigationBar from "../component/CustomNavigationBar";
import axiosInstance from "../component/axiosInstance";
import { useAuth } from "../component/Auth";
import * as ImagePicker from "expo-image-picker";
import LanguageSelector from "../component/LanguageSelector";
import DynamicDropdown from "../component/DynamicDropdown";

const ProfileScreen = ({ navigation }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [language, setLanguage] = useState("English");
  const [profileImage, setProfileImage] = useState("");
  const [loading, setLoading] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const { token } = useAuth();
  const [dailyGoal, setDailyGoal] = useState("");
  const [expertiseLevel, setExpertiseLevel] = useState("");

  const goal = [
    { label: "15", value: "15" },
    { label: "30", value: "30" },
    { label: "45", value: "45" },
    { label: "50", value: "50" },
    { label: "90", value: "90" },
    { label: "120", value: "120" },
  ];
  const level = [
    { label: "Beginner", value: "Beginner" },
    { label: "Intermedlate", value: "Intermedlate" },
    { label: "Advanced", value: "Advanced" },
  ];

  // ✅ Fetch User Profile from Backend API
  const fetchProfile = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get("/user/profile");
      const { name, email, language, profileImage, dailyGoal, expertiseLevel } =
        response.data.user;
      console.log("dailyGoal", response.data.user.dailyGoal);

      setName(name);
      setEmail(email);
      setLanguage(language);
      setProfileImage(profileImage);
      setDailyGoal(response.data.user.dailyGoal);
      setExpertiseLevel(expertiseLevel);
    } catch (error) {
      console.error("Error fetching profile:", error);
    } finally {
      setLoading(false);
    }
  };

  console.log("dailyGoal ddd", dailyGoal);

  // ✅ Open Image Picker
  const pickImage = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert(
        "Permission Required",
        "Please grant camera roll permissions to update your profile picture."
      );
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setProfileImage(result.assets[0].uri);
      uploadImage(result.assets[0].uri);
    }
  };

  // ✅ Upload Image to Backend
  const uploadImage = async (imageUri) => {
    setUpdating(true);
    try {
      const formData = new FormData();
      formData.append("image", {
        uri: imageUri,
        name: "profile.jpg",
        type: "image/jpeg",
      });

      const response = await axiosInstance.post(
        "/user/upload-profile-image",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 200) {
        Alert.alert("Success", "Profile picture updated!");
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      Alert.alert("Error", "Failed to update profile picture.");
    } finally {
      setUpdating(false);
    }
  };

  // ✅ Update Profile Data
  const updateProfile = async () => {
    if (!name.trim() || !email.trim()) {
      Alert.alert("Error", "Name and Email cannot be empty.");
      return;
    }

    setUpdating(true);
    try {
      const response = await axiosInstance.put("/user/profile", {
        name,
        language,
        dailyGoal,
        exexpertiseLevel: expertiseLevel,
      });

      if (response.status === 200) {
        Alert.alert("Success", "Profile updated successfully!");
        setIsEditing(false);
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      Alert.alert("Error", "Failed to update profile.");
    } finally {
      setUpdating(false);
    }
  };

  // ✅ Fetch profile on component mount
  useEffect(() => {
    fetchProfile();
  }, []);
  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="white" />
      </View>
    );
  }
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
          <TouchableOpacity onPress={pickImage}>
            <Image
              source={{
                uri: profileImage || "https://via.placeholder.com/150",
              }}
              style={styles.profileImage}
            />
            <View style={styles.cameraIconContainer}>
              <Ionicons name="camera" size={20} color="white" />
            </View>
          </TouchableOpacity>
        </View>

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
              editable={isEditing}
            />
          </View>

          {/* Email */}
          <Text style={styles.label}>Email</Text>
          <View style={styles.inputWrapper}>
            <Ionicons name="mail" size={20} color="#aaa" style={styles.icon} />
            <TextInput
              style={styles.input}
              value={email}
              placeholder="Enter your email"
              placeholderTextColor="#aaa"
              readOnly
            />
          </View>

          {/* Language */}
          <Text style={styles.label}>Language</Text>
          <LanguageSelector
            onLanguageChange={setLanguage}
            selectedLanguage={language}
            isEditing={isEditing}
          />

          <Text style={styles.label}>Daily Goal</Text>

          <DynamicDropdown
            onLanguageChange={setDailyGoal}
            isEditing={isEditing}
            dailyGoal={dailyGoal}
            data={goal}
            label={"Select a Daily Goal"}
          />

          <Text style={styles.label}>Expertise Level</Text>
          <DynamicDropdown
            onLanguageChange={setExpertiseLevel}
            isEditing={isEditing}
            dailyGoal={expertiseLevel}
            data={level}
            label={"Select a Expertise Level"}
          />

          {/* Edit Profile Button */}
          {!isEditing ? (
            <TouchableOpacity
              style={styles.editProfileButton}
              onPress={() => setIsEditing(true)}
            >
              <Text style={styles.editProfileButtonText}>Edit Profile</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={styles.updateProfileButton}
              onPress={updateProfile}
              disabled={updating}
            >
              {updating ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text style={styles.updateProfileButtonText}>
                  Update Profile
                </Text>
              )}
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#121212", // Optional background color
  },
  container: { flex: 1, backgroundColor: "#121212", padding: 16 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  headerTitle: { color: "white", fontSize: 18, fontWeight: "bold" },
  profileImageContainer: { alignItems: "center", marginVertical: 16 },
  profileImage: {
    width: 128,
    height: 128,
    borderRadius: 64,
    borderWidth: 2,
    borderColor: "white",
  },
  cameraIconContainer: {
    position: "absolute",
    bottom: 0,
    right: 5,
    backgroundColor: "#8E44AD",
    padding: 6,
    borderRadius: 20,
  },
  inputContainer: { marginVertical: 16 },
  label: { color: "#fff", marginBottom: 8, fontSize: 14 },
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
  icon: { marginRight: 8 },
  input: { flex: 1, color: "#fff", fontSize: 16 },
  languageText: { color: "#fff", fontSize: 16 },
  editProfileButton: {
    backgroundColor: "#3498db",
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    height : 55
  },
  editProfileButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  updateProfileButton: {
    backgroundColor: "#8E44AD",
    borderRadius: 8,
    alignItems: "center",
    paddingVertical: 12,
  },
  updateProfileButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default ProfileScreen;
