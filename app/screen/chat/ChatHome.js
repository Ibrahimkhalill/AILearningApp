import React, { useEffect, useRef, useState } from "react"; // Fixed typo: 'use' to 'useEffect'
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Image,
  ActivityIndicator,
  Alert,
} from "react-native";
import { Ionicons, FontAwesome } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import CircularButton from "../component/BackButton";
import Setting from "../component/Setting";
import axios from "axios";
import RenderHtml from "react-native-render-html"; // ✅ Import HTML Renderer
import * as Speech from "expo-speech";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axiosInstance from "../component/axiosInstance";
import CustomAlert from "../component/CustomAlert";
import { useTranslation } from "react-i18next"; // Import useTranslation
import { useLearningTime } from "../component/LearningTimeContext";

const ChatHome = ({ navigation }) => {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState("");
  const [loading, setLoading] = useState(false);
  const [typing, setTyping] = useState(false); // New state for typing animation
  const [lang, setLang] = useState("en");
  const [plan, setPlan] = useState("");
  const [level, setLevel] = useState("");
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const { updateLearningTime } = useLearningTime();
  const flatListRef = useRef(null);
  const { t } = useTranslation(); // Initialize translation hook

  const handleSend = async () => {
    if (!inputText.trim() || loading) return;
    const userId = await AsyncStorage.getItem("userId");

    const newMessage = {
      id: Date.now().toString(),
      original_text: inputText,
      sender: "user",
    };

    setInputText("");
    setMessages((prevMessages) => [...prevMessages, newMessage]);

    // Scroll to bottom after new message
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);

    setLoading(true);
    setTyping(true);
    console.log("hi", lang,userId,plan,level);
    
      try {
      const response = await axios.post(
        "http://24.144.85.64/fast/api/correct_grammar/",
        {
          text: newMessage.original_text,
          language: lang,
          user_id: userId,
          plan: plan,
          level: level,
        }
      );

      if (response.status === 200) {
        fetchData();
      } else {
        Alert.alert(t("no_correction_alert"), t("try_again")); // Translated alert
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
      setTyping(false);
    }
  };

  const fetchData = async () => {
    let userId = await AsyncStorage.getItem("userId");
    try {
      setLoading(true);

      let response;
      if (plan === "Free") {
        response = await axios.get(
          `http://24.144.85.64/fast/api/get_messages_free/?user_id=${userId}`
        );
      } else {
        response = await axios.get(
          `http://24.144.85.64/fast/api/get_messages_text/?user_id=${userId}`
        );
      }

      setMessages(response.data);

      // Scroll to bottom after fetching messages
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    } catch (error) {
      if (error.response?.status === 400) {
        setAlertMessage(error.response.data.detail);
        setAlertVisible(true);
        return;
      }
      console.log("error fetching data", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get("/user/profile");
      const { plan, expertiseLevel, language } = response.data.user;

      setPlan(plan);
      setLevel(expertiseLevel);
      setLang(language);
      console.log(response.data);
    } catch (error) {
      console.log("Error fetching profile:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
    fetchData();
  }, []);

  // Typing Indicator Component
  const TypingIndicator = () => (
    <View style={styles.typingContainer}>
      <Image
        source={require("../../assets/main_logo.png")}
        style={styles.userImage}
      />
      <Text style={styles.typingText}>{t("bot_typing")}</Text>
      <ActivityIndicator size="small" color="#4B98E5" />
    </View>
  );

  const htmlToPlainText = (html) => {
    return html.replace(/<\/?[^>]+(>|$)/g, "");
  };

  const handleSpeech = (text) => {
    if (!text) return;
    const plainText = htmlToPlainText(text);

    Speech.speak(plainText, {
      language: lang,
      pitch: 1.1,
      rate: 1.0,
    });
  };

  const renderMessage = ({ item }) => (
    <View
      style={
        item.sender === "user"
          ? styles.userMessageContainer
          : styles.botMessageContainer
      }
    >
      {item.sender === "bot" && (
        <Image
          source={require("../../assets/main_logo.png")}
          style={styles.userImage}
        />
      )}
      <Text
        style={
          item.sender === "user"
            ? styles.userMessageText
            : styles.botMessageText
        }
      >
        {item.text ? (
          <RenderHtml contentWidth={300} source={{ html: item.text }} />
        ) : (
          item.original_text
        )}
      </Text>
      {item.sender === "bot" && (
        <FontAwesome
          name="file-audio-o"
          size={18}
          color="#0C41FE"
          onPress={() => handleSpeech(item.text)}
        />
      )}
      {item.sender === "user" && (
        <Image
          source={{
            uri: "https://pics.craiyon.com/2023-10-28/5ad22761b9cf4196abba9a20dcc50c61.webp",
          }}
          style={styles.userImage}
        />
      )}
    </View>
  );

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
      console.log("existingEntry", existingEntry);

      updateLearningTime(existingEntry?.time || 0);
      await AsyncStorage.setItem("learningTime", JSON.stringify(storedData));
      console.log("Updated Learning Time:", storedData);
    } catch (error) {
      console.error("Error saving time:", error);
    }
  };

  return (
    <SafeAreaView style={{ flexGrow: 1, backgroundColor: "#121212" }}>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity>
            <CircularButton navigation={navigation} />
          </TouchableOpacity>
          <View style={{ flexDirection: "row" }}>
            <Text style={styles.headerTitle1}>{t("language")}</Text>
            <Text style={styles.headerTitle}>{t("swap")}</Text>
          </View>
          <TouchableOpacity>
            <Setting navigation={navigation} />
          </TouchableOpacity>
        </View>
        {messages.length === 0 && (
          <View style={styles.indroduction}>
            <Text style={{ color: "white", fontSize: 30, textAlign: "center" }}>
              {t("what_can_i_help_with")}
            </Text>
          </View>
        )}

        <FlatList
          ref={flatListRef} // Attach ref
          data={messages}
          renderItem={renderMessage}
          keyExtractor={(item) => item.id}
          style={styles.chatList}
          contentContainerStyle={styles.chatListContainer}
          ListFooterComponent={typing ? <TypingIndicator /> : null}
          onContentSizeChange={() =>
            flatListRef.current?.scrollToEnd({ animated: true })
          } // Auto-scroll on content update
        />

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.textInput}
            placeholder={t("type_message_here")}
            placeholderTextColor="#aaa"
            value={inputText}
            onChangeText={setInputText}
            editable={!loading} // Disable input when loading
          />
          {loading ? (
            <ActivityIndicator
              size="small"
              color="#fff"
              style={styles.loadingIndicator}
            />
          ) : (
            <TouchableOpacity onPress={handleSend}>
              <Ionicons
                name="send"
                size={22}
                color="#fff"
                style={styles.sendIcon}
              />
            </TouchableOpacity>
          )}
        </View>
      </View>
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
    paddingLeft: 10,
    paddingRight: 10,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingBottom: 10,
  },
  headerTitle1: {
    color: "#4A90E2",
    fontSize: 20,
    fontWeight: "bold",
  },
  headerTitle: {
    color: "#8E44AD",
    fontSize: 20,
    fontWeight: "bold",
  },
  chatList: {
    flex: 1,
    width: "100%",
  },
  chatListContainer: {
    paddingBottom: 70,
    marginTop: 10,
    width: "100%",
  },
  indroduction: {
    paddingBottom: 70,
    marginTop: 110,
    width: "100%",
  },
  userMessageContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginBottom: 16,
  },
  botMessageContainer: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "flex-end",
    gap: 6,
    marginBottom: 16,
  },
  userMessageText: {
    color: "#8E44AD",
    padding: 10,
    borderRadius: 8,
    maxWidth: "70%",
    backgroundColor: "#333",
  },
  botMessageText: {
    color: "#4B98E5",
    padding: 10,
    borderRadius: 8,
    maxWidth: "70%",
    backgroundColor: "#222",
  },
  userImage: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginLeft: 8,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1E1E1E",
    borderWidth: 1,
    borderColor: "#8E44AD",
    borderRadius: 50,
    paddingVertical: 5,
    paddingHorizontal: 12,
    width: "100%",
    position: "absolute",
    bottom: 10,
    left: 10,
  },
  micIcon: {
    marginRight: 8,
  },
  textInput: {
    flex: 1,
    color: "#fff",
    fontSize: 16,
    paddingHorizontal: 8,
    height: 40,
  },
  sendIcon: {
    marginLeft: 12,
  },
  loadingIndicator: {
    marginRight: 12,
  },
  typingContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 10,
    marginBottom: 16,
    gap: 5,
  },
  typingText: {
    color: "#4B98E5",
    marginRight: 8,
  },
});

export default ChatHome;