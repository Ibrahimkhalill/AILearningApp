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
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import CircularButton from "../component/BackButton";

const AiChatBot = ({ navigation }) => {
  const [messages, setMessages] = useState([
    { id: "1", text: "Hi, how are you doing today", sender: "user" },
    { id: "2", text: "I'm Great! You?", sender: "bot" },
    { id: "3", text: "Hi, how are you doing today", sender: "user" },
    { id: "4", text: "I'm Great! You?", sender: "bot" },
  ]);

  const [inputText, setInputText] = useState("");

  const handleSend = () => {
    if (inputText.trim()) {
      setMessages((prevMessages) => [
        ...prevMessages,
        { id: Date.now().toString(), text: inputText, sender: "user" },
      ]);
      setInputText("");
    }
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
        {item.text}
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
          <View style={{ flexDirection: "row" }}>
            <Text style={styles.headerTitle1}>Lang</Text>
            <Text style={styles.headerTitle}>Swap</Text>
          </View>
          <TouchableOpacity>
            <Ionicons name="create" size={25} color="#969696" />
          </TouchableOpacity>
        </View>

        <FlatList
          data={messages}
          renderItem={renderMessage}
          keyExtractor={(item) => item.id}
          style={styles.chatList}
          contentContainerStyle={styles.chatListContainer}
        />

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.textInput}
            placeholder="Type message here..."
            placeholderTextColor="#aaa"
            value={inputText}
            onChangeText={setInputText}
          />
          <Ionicons name="mic" size={24} color="#fff" style={styles.micIcon} />
          <TouchableOpacity onPress={handleSend}>
            <Ionicons
              name="send"
              size={22}
              color="#fff"
              style={styles.sendIcon}
            />
          </TouchableOpacity>
        </View>
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
    color: "#8E44AD",
    padding: 10,
    borderRadius: 8,
    maxWidth: "70%",
  },
  botMessageText: {
    color: "#4B98E5",
    padding: 10,
    borderRadius: 8,
    maxWidth: "70%",
  },
  icon: {
    marginRight: 8,
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

export default AiChatBot;
