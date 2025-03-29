import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  ScrollView,
  ActivityIndicator,
  Animated,
} from "react-native";
import { Ionicons, FontAwesome5 } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import CircularButton from "../component/BackButton";
import { LinearGradient } from "expo-linear-gradient";
import EditButton from "../component/EditButton";
import axios from "axios";
import { Audio } from "expo-av";
import * as FileSystem from "expo-file-system";
import * as Speech from "expo-speech";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axiosInstance from "../component/axiosInstance";
import CustomAlert from "../component/CustomAlert";
import { useTranslation } from "react-i18next"; // Import useTranslation
import { useLearningTime } from "../component/LearningTimeContext";

const VoiceChat = ({ navigation }) => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [recording, setRecording] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [botSpeaking, setBotSpeaking] = useState(false);
  const [audioResponse, setAudioResponse] = useState(null);
  const [lang, setLang] = useState("en");
  const scaleAnim = useRef(new Animated.Value(1)).current; // ✅ Scale for zoom effect
  const rotateAnim = useRef(new Animated.Value(0)).current; // ✅ Rotation effect
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [plan, setPlan] = useState("");
  const { updateLearningTime } = useLearningTime();
  const { t } = useTranslation(); // Initialize translation hook

  // ✅ Function to Start/Stop Speech
  const handleSpeech = (text) => {
    if (!text) return;

    if (isSpeaking) {
      Speech.stop();
      setIsSpeaking(false);
    } else {
      Speech.speak(text, {
        language: lang,
        pitch: 1.0,
        rate: 1.0,
        onDone: () => {
          setIsSpeaking(false);
          setBotSpeaking(false);
        },
        onStopped: () => {
          setIsSpeaking(false);
          setBotSpeaking(false);
        },
      });
      setIsSpeaking(true);
      setBotSpeaking(true);
    }
  };

  const fetchProfile = async () => {
    try {
      const response = await axiosInstance.get("/subscription/details");
      const { type } = response.data.subscription;

      setPlan(type);
      console.log(response.data);
    } catch (error) {
      console.error("Error fetching subscriptions:", error);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  // ✅ Start Recording
  const startRecording = async () => {
    try {
      // 🎤 Microphone permission check
      const permission = await Audio.requestPermissionsAsync();
      if (permission.status !== "granted") {
        Alert.alert(t("microphone_access_required")); // Translated alert
        return;
      }

      // 🔊 Set recording mode for iOS
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      setAudioResponse(null);
      console.log("Starting recording...");

      const recording = new Audio.Recording();
      await recording.prepareToRecordAsync(Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY);
      await recording.startAsync();

      setIsRecording(true);
      setIsSpeaking(true);
      setRecording(recording);

      console.log("Recording started.");
    } catch (error) {
      console.error("Failed to start recording:", error);
    }
  };

  // ✅ Stop Recording & Send to Backend
  const stopRecording = async () => {
    try {
      console.log("Stopping recording...");
      setIsRecording(false);
      setIsSpeaking(false);
      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();
      console.log("Recording saved at", uri);

      await sendAudioToBackend(uri);
    } catch (error) {
      console.error("Failed to stop recording:", error);
    }
  };

  // ✅ Send recorded audio to backend
  const sendAudioToBackend = async (uri) => {
    try {
      setIsProcessing(true);
      let userId = await AsyncStorage.getItem("userId");
      const fileInfo = await FileSystem.getInfoAsync(uri);
      if (!fileInfo.exists) {
        console.error("File does not exist at URI:", uri);
        Alert.alert(t("file_not_found")); // Translated alert
        return;
      }

      const formData = new FormData();
      formData.append("file", {
        uri: uri,
        name: "recorded_audio.wav",
        type: "audio/wav",
      });

      // ✅ Add the language as a field
      formData.append("language", lang);
      formData.append("user_id", userId);
      formData.append("plan", plan);

      console.log("Sending audio & language to backend...", uri, plan, userId);

      const response = await axios.post(
        "http://24.144.85.64/fast/api/process_audio/",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      console.log("Audio response received!", response.data.error);

      if (response.data.error) {
        setAlertMessage(response.data.error);
        setAlertVisible(true);
        return;
      }
      setAudioResponse(response.data.transcription); // ✅ Store transcription
    } catch (error) {
      console.log("Error processing audio:", error);
      if (error.response?.status === 400) {
        setAlertMessage(error.response.data.detail);
        setAlertVisible(true);
        return;
      }
    } finally {
      setIsProcessing(false);
    }
  };

  // ✅ Auto Speak When Backend Sends Data
  useEffect(() => {
    if (audioResponse) {
      handleSpeech(audioResponse);
    }
  }, [audioResponse]);

  // ✅ Animation Effect for Image
  useEffect(() => {
    if (isSpeaking) {
      Animated.loop(
        Animated.parallel([
          // ✅ Scale Animation (Zoom In & Out)
          Animated.sequence([
            Animated.timing(scaleAnim, {
              toValue: 1.3,
              duration: 600,
              useNativeDriver: true,
            }),
            Animated.timing(scaleAnim, {
              toValue: 1,
              duration: 600,
              useNativeDriver: true,
            }),
          ]),
          // ✅ Rotation Animation (Spinning Effect)
          Animated.timing(rotateAnim, {
            toValue: 1,
            duration: 3000,
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      scaleAnim.setValue(1);
      rotateAnim.setValue(0);
    }
  }, [isSpeaking]);

  // ✅ Convert Rotation Value to Degrees
  const rotateInterpolate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  const startTimeRef = useRef(null); // Use ref instead of state to avoid stale closures

  // ✅ Start Timer When User Enters
  useEffect(() => {
    const startTimer = () => {
      const now = Date.now();
      console.log("Timer started at:", now);
      startTimeRef.current = now; // Store in ref instead of state
    };

    startTimer();

    return () => {
      // Immediately invoke async function in cleanup
      (async () => {
        await stopAndSaveTime();
      })();
    };
  }, []);

  // ✅ Stop Timer & Save Data When User Leaves
  const stopAndSaveTime = async () => {
    if (!startTimeRef.current) return;

    const endTime = Date.now();
    const timeSpentSeconds = Math.floor(
      (endTime - startTimeRef.current) / 1000
    );
    console.log("Time spent (seconds):", timeSpentSeconds);

    try {
      let storedData = await AsyncStorage.getItem("learningTime");
      storedData = storedData ? JSON.parse(storedData) : [];
      const today = new Date().toISOString().split("T")[0];

      const existingEntry = storedData.find((entry) => entry.date === today);

      if (existingEntry) {
        existingEntry.time += timeSpentSeconds;
      } else {
        storedData.push({ date: today, time: timeSpentSeconds });
      }
      updateLearningTime(existingEntry.time);
      await AsyncStorage.setItem("learningTime", JSON.stringify(storedData));
      console.log("Updated Learning Time:", storedData);
    } catch (error) {
      console.error("Error saving time:", error);
    }
  };
  console.log("audioResponse", audioResponse);

  return (
    <SafeAreaView style={{ flexGrow: 1, backgroundColor: "#121212" }}>
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity>
            <CircularButton navigation={navigation} />
          </TouchableOpacity>
          <View style={{ flexDirection: "row" }}>
            <Text style={styles.headerTitle}>{t("speaking_to")}</Text>
            <Text style={styles.headerTitle1}>{t("ai_bot")}</Text>
          </View>
          {plan === "Free" ? (
            <TouchableOpacity>
              <FontAwesome5 name="crown" size={21} color="gold" />
            </TouchableOpacity>
          ) : (
            <View></View>
          )}
        </View>

        <View style={styles.contentContainer}>
          <View style={styles.imageContainer}>
            <Animated.Image
              source={require("../../assets/speaker.png")}
              style={[
                styles.image,
                {
                  transform: [
                    { scale: scaleAnim }, // Zoom In & Out
                    { rotate: rotateInterpolate }, // Rotating Effect
                  ],
                },
              ]}
            />
          </View>

          <Text style={styles.questionText}>
            {isSpeaking && audioResponse ? (
              <LinearGradient
                colors={["rgba(142, 68, 173, 0.2)", "rgba(142, 68, 173, 0.2)"]}
                style={styles.controlsTextBOX}
              >
                <Text style={{ color: "white" }}>{audioResponse}</Text>
              </LinearGradient>
            ) : (
              t("hold_button_to_record")
            )}
          </Text>
          {!botSpeaking && (
            <View style={styles.controlsContainer}>
              <TouchableOpacity
                style={styles.controlButton}
                onPress={() => navigation.navigate("LanguageChat")}
              >
                <EditButton />
              </TouchableOpacity>
              <LinearGradient
                colors={["rgba(142, 68, 173, 0.2)", "rgba(142, 68, 173, 0.2)"]}
                style={styles.microphoneContainer}
              >
                <TouchableOpacity
                  style={styles.microphoneButton}
                  onPress={isRecording ? stopRecording : startRecording}
                  disabled={isProcessing}
                >
                  {isProcessing ? (
                    <ActivityIndicator size="large" color="black" />
                  ) : (
                    <Ionicons
                      name={isRecording ? "stop" : "mic"}
                      size={40}
                      color="black"
                    />
                  )}
                </TouchableOpacity>
              </LinearGradient>
              <TouchableOpacity
                style={styles.controlButton}
                onPress={() => handleSpeech(audioResponse)}
                disabled={!audioResponse}
              >
                <Ionicons
                  name={isSpeaking ? "stop" : "play"} // ✅ Toggle between play & stop
                  size={24}
                  color={audioResponse ? "white" : "gray"}
                />
              </TouchableOpacity>
            </View>
          )}
        </View>
      </ScrollView>
      <CustomAlert
        visible={alertVisible}
        message={alertMessage}
        onClose={() => setAlertVisible(false)}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
  },
  headerTitle: {
    color: "#4A90E2",
    fontSize: 20,
    fontWeight: "bold",
  },
  headerTitle1: {
    color: "#8E44AD",
    fontSize: 20,
    fontWeight: "bold",
    marginLeft: 8,
  },
  contentContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
    marginTop: 30,
  },
  imageContainer: {
    padding: 8,
    marginBottom: 50,
  },
  image: {
    width: 250,
    height: 250,
    borderRadius: 10,
  },
  questionText: {
    color: "#fff",
    fontSize: 20,
    textAlign: "center",
  },
  controlsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "80%",
    marginTop: 20,
  },
  controlButton: {
    width: 50,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#2E2E2E",
    borderRadius: 25,
  },
  headerButton: {
    width: 30,
    height: 30,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#2E2E2E",
    borderRadius: 25,
  },
  microphoneButton: {
    width: 70,
    height: 70,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#8E44AD",
    borderRadius: 35,
  },
  microphoneContainer: {
    width: 110,
    height: 110,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 55,
    opacity: 0.2,
  },
  controlsTextBOX: {
    flexDirection: "row",
    padding: 10,
    width: "100%",
    marginTop: 20,
    height: 200,
    borderRadius: 12,
  },
});

export default VoiceChat;