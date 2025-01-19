import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Image,
} from "react-native";
import { Ionicons, SimpleLineIcons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import CircularButton from "../component/BackButton";
import Setting from "../component/Setting";

// Grammar correction function
const correctGrammar = (text) => {
  const corrections = [
    { incorrect: "i", correct: "I" },
    { incorrect: "is", correct: "am" },
    { incorrect: "lerning", correct: "learning" },
  ];

  let correctedText = text;
  corrections.forEach((correction) => {
    correctedText = correctedText.replace(
      new RegExp(`\\b${correction.incorrect}\\b`, "gi"),
      correction.correct
    );
  });

  return { correctedText, corrections };
};

const LanguageChat = ({ navigation }) => {
  const [messages, setMessages] = useState([
    {
      id: "1",
      text: "i is shuvo",
      sender: "user",
      corrections: [
        { incorrect: "i", correct: "I" },
        { incorrect: "is", correct: "am" },
      ],
    },
    {
      id: "2",
      text: "I am Shuvo",
      sender: "bot",
      corrections: [],
    },
    {
      id: "3",
      text: "The language lerning app is designed",
      sender: "user",
      corrections: [{ incorrect: "lerning", correct: "learning" }],
    },
    {
      id: "4",
      text: "The language learning app is designed",
      sender: "bot",
      corrections: [],
    },
  ]);

  const highlightCorrections = (text, corrections, isUser) => {
    const words = text.split(" ");
    return words.map((word, index) => {
      const correction = corrections.find(
        (c) => c.incorrect.toLowerCase() === word.toLowerCase()
      );
      if (isUser && correction) {
        // Highlight user's incorrect words in red
        return (
          <Text key={index} style={styles.userIncorrect}>
            {word}{" "}
          </Text>
        );
      } else if (!isUser && correction) {
        // Highlight bot's corrected words in green
        return (
          <Text key={index} style={styles.botCorrect}>
            {correction.correct}
          </Text>
        );
      } else {
        // Default styles for other words
        return (
          <Text
            key={index}
            style={isUser ? styles.userDefaultText : styles.botDefaultText}
          >
            {word}{" "}
          </Text>
        );
      }
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
        {highlightCorrections(
          item.text,
          item.corrections,
          item.sender === "user"
        )}
      </Text>
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
          <View style={{ flexDirection: "row", gap: 4, alignItems: "center" }}>
            <TouchableOpacity className="bg-[#8E44AD] px-4 py-1 rounded-sm">
              <Text style={styles.headerTitle1}>English</Text>
            </TouchableOpacity>
            <SimpleLineIcons name="refresh" size={20} color={"white"} />
            <TouchableOpacity className="bg-[#8E44AD] px-4 py-1 rounded-sm">
              <Text style={styles.headerTitle1}>Spanish</Text>
            </TouchableOpacity>
          </View>
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
    paddingLeft: 10,
    paddingRight: 10,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
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
    alignItems: "center",
    marginBottom: 16,
  },
  userMessageText: {
    padding: 10,
    borderRadius: 8,
    maxWidth: "70%",
  },
  botMessageText: {
    padding: 10,
    borderRadius: 8,
    maxWidth: "70%",
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
  userIncorrect: {
    color: "#B30000",
    textDecorationLine: "underline",
  },
  botCorrect: {
    color: "#",
    fontWeight: "bold",
  },
  userDefaultText: {
    color: "#8E44AD", // Default user message color
  },
  botDefaultText: {
    color: "#4B98E5", // Default bot message color
  },
});

export default LanguageChat;
