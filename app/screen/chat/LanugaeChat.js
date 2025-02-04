import React, { useEffect, useState } from "react"; // ✅ Fixed import
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Image,
} from "react-native";
import { Ionicons, SimpleLineIcons, FontAwesome } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import CircularButton from "../component/BackButton";
import Setting from "../component/Setting";
import * as Speech from "expo-speech";
import axios from "axios";
import RenderHtml from "react-native-render-html";
import LanguageDropdown from "../component/LanguageDropdown";
import AsyncStorage from "@react-native-async-storage/async-storage";

const LanguageChat = ({ navigation }) => {
  const [messages, setMessages] = useState([]);
  const [lang, setLang] = useState("en");
  const [loading, setLoading] = useState(false);

  const htmlToPlainText = (html) => {
    return html.replace(/<\/?[^>]+(>|$)/g, "");
  };

  const handleSpeech = (text) => {
    console.log("text", text);

    if (!text) return;
    const plainText = htmlToPlainText(text);
    console.log("plainText", plainText);

    Speech.speak(plainText, {
      language: lang,
      pitch: 1.1,
      rate: 1.0,
    });
  };

  const fetchData = async () => {
    let userId = await AsyncStorage.getItem("userId");
    try {
      setLoading(true);
      const response = await axios.get(
        `https://advanced-oarfish-slightly.ngrok-free.app/get_messages_audio/?user_id=${userId}`
      );
      setMessages(response.data);
      console.log("response.data", response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleChangeLanguage = async (lang) => {
    try {
      let userId = await AsyncStorage.getItem("userId");
      const formData = new FormData();
      formData.append("lang", lang);
      formData.append("user_id", userId);

      const response = await axios.post(
        "https://advanced-oarfish-slightly.ngrok-free.app/translate",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setLang(lang);
      setMessages(response.data);
      console.log("Translated response:", response.data);
    } catch (error) {
      console.error("Error fetching translation:", error);
    }
  };

  useEffect(() => {
    try {
      fetchData();
    } catch (error) {
      console.error("useEffect Error:", error);
    }
  }, []);

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
        <RenderHtml contentWidth={300} source={{ html: item.text }} />
      </Text>
      {item.sender === "bot" && (
        <FontAwesome
          name="file-audio-o"
          size={18}
          color={"#0C41FE"}
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

  return (
    <SafeAreaView style={{ flexGrow: 1 }}>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity>
            <CircularButton navigation={navigation} />
          </TouchableOpacity>
          <LanguageDropdown handleChangeLanguage={handleChangeLanguage} />
          <TouchableOpacity>
            <Setting navigation={navigation} />
          </TouchableOpacity>
        </View>

        <FlatList
          data={messages}
          renderItem={renderMessage}
          keyExtractor={(item) => item.id}
          style={styles.chatList}
          contentContainerStyle={styles.chatListContainer}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
    paddingLeft: 5,
    paddingRight: 5,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 10,
  },
  headerTitle1: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
  },
  headerTitle: {
    color: "#8E44AD",
    fontSize: 20,
    fontWeight: "bold",
  },
  chatList: {
    flex: 1,
  },
  chatListContainer: {
    padding: 12,
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
    gap: 5,
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
  },
  micIcon: {
    marginRight: 8,
  },
  textInput: {
    flex: 1,
    color: "#fff",
    fontSize: 16,
    paddingHorizontal: 8,
  },
  sendIcon: {
    marginLeft: 12,
  },
});

export default LanguageChat;
