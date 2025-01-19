// import React, { useState } from "react";
// import {
//   View,
//   Text,
//   TouchableOpacity,
//   StyleSheet,
//   Image,
//   ScrollView,
// } from "react-native";
// import { Ionicons, FontAwesome5 } from "@expo/vector-icons";
// import { SafeAreaView } from "react-native-safe-area-context";
// import CircularButton from "../component/BackButton";
// import { LinearGradient } from "expo-linear-gradient";
// import EditButton from "../component/EditButton";
// import axios from "axios";
// import { Audio } from "expo-av";
// import * as FileSystem from "expo-file-system";
// import { Buffer } from "buffer"; // Import the Buffer polyfill

// const VoiceChat = ({ navigation }) => {
//   const [sound, setSound] = useState(null);
//   const [isPlaying, setIsPlaying] = useState(false);

//   const fetchAndPlayAudio = async () => {
//     try {
//       // Fetch audio file from backend
//       const response = await axios.post(
//         "http://115.127.205.106:8000/generate-audio/",
//         {
//           text: `Happy Birthday to Nill Apu`,
//           emotion: "surprised", // Change this to match the desired emotion, e.g., "sad", "angry", etc.
//         },
//         { responseType: "arraybuffer" } // Fetch binary data for audio
//       );
//       console.log("====================================");
//       console.log(response.data);
//       console.log("====================================");
//       console.log("Audio file fetched successfully!");

//       // Save binary data to a local file
//       const audioPath = `${FileSystem.cacheDirectory}audio.mp3`; // Path to save the audio file
//       await FileSystem.writeAsStringAsync(
//         audioPath,
//         Buffer.from(response.data).toString("base64"),
//         {
//           encoding: FileSystem.EncodingType.Base64,
//         }
//       );

//       console.log("Audio saved locally at:", audioPath);

//       // Play the audio
//       await playAudio(audioPath);
//     } catch (error) {
//       console.error("Error fetching or playing audio:", error);
//     }
//   };

//   const playAudio = async (audioPath) => {
//     try {
//       // Stop the previous sound if any
//       if (sound) {
//         await sound.stopAsync();
//         await sound.unloadAsync();
//       }

//       // Load and play the audio file
//       const { sound: newSound } = await Audio.Sound.createAsync({
//         uri: audioPath,
//       });
//       setSound(newSound);
//       await newSound.playAsync();
//       setIsPlaying(true);

//       // Stop playing when the audio finishes
//       newSound.setOnPlaybackStatusUpdate((status) => {
//         if (status.didJustFinish) {
//           setIsPlaying(false);
//           console.log("Playback finished");
//         }
//       });
//     } catch (error) {
//       console.error("Error playing audio:", error);
//     }
//   };

//   const stopAudio = async () => {
//     if (sound) {
//       await sound.stopAsync();
//       setIsPlaying(false);
//     }
//   };

//   return (
//     <SafeAreaView style={{ flexGrow: 1 }}>
//       <ScrollView style={styles.container}>
//         <View style={styles.header}>
//           <TouchableOpacity>
//             <CircularButton navigation={navigation} />
//           </TouchableOpacity>
//           <View style={{ flexDirection: "row" }}>
//             <Text style={styles.headerTitle}>Speaking To</Text>
//             <Text style={styles.headerTitle1}>AI BOT</Text>
//           </View>
//           <TouchableOpacity>
//             <FontAwesome5 name="crown" size={21} color="gold" />
//           </TouchableOpacity>
//         </View>

//         <View style={styles.contentContainer}>
//           <View style={styles.imageContainer}>
//             <Image
//               source={require("../../assets/speaker.png")}
//               style={styles.image}
//             />
//           </View>

//           <Text style={styles.questionText}>
//             What are the top trending collaborating interface
//           </Text>
//           <Text style={styles.questionText2}>design tools 2025</Text>

//           <View style={styles.controlsContainer}>
//             <TouchableOpacity style={styles.controlButton}>
//               <EditButton />
//             </TouchableOpacity>
//             <LinearGradient
//               colors={["rgba(142, 68, 173, 0.2)", "rgba(142, 68, 173, 0.2)"]}
//               style={styles.microphoneContainer}
//             >
//               <TouchableOpacity
//                 style={styles.microphoneButton}
//                 onPress={() => fetchAndPlayAudio()}
//               >
//                 <Ionicons name="mic" size={40} color="000000" />
//               </TouchableOpacity>
//             </LinearGradient>
//             <TouchableOpacity style={styles.controlButton}>
//               <Ionicons name="close" size={24} color="gray" />
//             </TouchableOpacity>
//           </View>
//         </View>
//       </ScrollView>
//     </SafeAreaView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#121212",
//   },
//   header: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     padding: 16,
//   },
//   headerTitle: {
//     color: "#4A90E2",
//     fontSize: 20,
//     fontWeight: "bold",
//   },
//   headerTitle1: {
//     color: "#8E44AD",
//     fontSize: 20,
//     fontWeight: "bold",
//     marginLeft: 8,
//   },
//   contentContainer: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//     padding: 16,
//     marginTop: 30,
//   },
//   imageContainer: {
//     padding: 8,
//     marginBottom: 50,
//   },
//   image: {
//     width: 250,
//     height: 250,
//     borderRadius: 10,
//   },
//   questionText: {
//     color: "#fff",
//     fontSize: 20,
//     textAlign: "center",
//   },
//   questionText2: {
//     color: "#818181",
//     fontSize: 20,
//     textAlign: "center",
//     marginBottom: 30,
//   },
//   controlsContainer: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     width: "80%",
//     marginTop: 20,
//   },
//   controlButton: {
//     width: 50,
//     height: 50,
//     justifyContent: "center",
//     alignItems: "center",
//     backgroundColor: "#2E2E2E",
//     borderRadius: 25,
//   },
//   microphoneButton: {
//     width: 70,
//     height: 70,
//     justifyContent: "center",
//     alignItems: "center",
//     backgroundColor: "#8E44AD",
//     borderRadius: 35,
//   },
//   microphoneContainer: {
//     width: 110,
//     height: 110,
//     justifyContent: "center",
//     alignItems: "center",
//     borderWidth: 1,
//     borderRadius: 55,
//     opacity: 20,
//   },
// });

// export default VoiceChat;

import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  ScrollView,
} from "react-native";
import { Ionicons, FontAwesome5 } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import CircularButton from "../component/BackButton";
import { LinearGradient } from "expo-linear-gradient";
import EditButton from "../component/EditButton";
import axios from "axios";
import { Audio } from "expo-av";
import * as FileSystem from "expo-file-system";

const VoiceChat = ({ navigation }) => {
  const [recording, setRecording] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // Function to start recording
  const startRecording = async () => {
    try {
      console.log("Requesting permissions...");
      const permission = await Audio.requestPermissionsAsync();
      if (permission.status !== "granted") {
        alert("Permission to access microphone is required!");
        return;
      }

      console.log("Starting recording...");
      const { recording } = await Audio.Recording.createAsync(
        Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY
      );
      setRecording(recording);
      setIsRecording(true);
      console.log("Recording started");
    } catch (error) {
      console.error("Failed to start recording:", error);
    }
  };

  // Function to stop recording and process the file
  const stopRecording = async () => {
    try {
      console.log("Stopping recording...");
      setIsRecording(false);
      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();
      console.log("Recording stopped and saved at", uri);

      // Send the audio file to the backend
      await sendAudioToBackend(uri);
    } catch (error) {
      console.error("Failed to stop recording:", error);
    }
  };

  // Function to send recorded audio to the backend
  const sendAudioToBackend = async (uri) => {
    try {
      setIsProcessing(true);

      // Convert .3gp to .wav (if backend requires .wav)
      const fileInfo = await FileSystem.getInfoAsync(uri);
      const newUri = `${FileSystem.cacheDirectory}audio.wav`;

      if (fileInfo.exists) {
        const fileData = await FileSystem.readAsStringAsync(uri, {
          encoding: FileSystem.EncodingType.Base64,
        });
        await FileSystem.writeAsStringAsync(newUri, fileData, {
          encoding: FileSystem.EncodingType.Base64,
        });
      }

      const formData = new FormData();
      formData.append("file", {
        uri: newUri, // Use the new .wav file
        name: "recorded_audio.wav", // Ensure it matches backend expectations
        type: "audio/wav", // Correct MIME type
      });

      console.log("Sending audio to backend...");
      const response = await axios.post(
        "http://115.127.205.106:8000/convert-speech/",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("Response from backend:", response.data);
      alert(`Recognized Text: ${response.data.text}`);
    } catch (error) {
      console.error("Error sending audio to backend:", error);
      alert("Failed to process audio. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };
  return (
    <SafeAreaView style={{ flexGrow: 1 }}>
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity>
            <CircularButton navigation={navigation} />
          </TouchableOpacity>
          <View style={{ flexDirection: "row" }}>
            <Text style={styles.headerTitle}>Speaking To</Text>
            <Text style={styles.headerTitle1}>AI BOT</Text>
          </View>
          <TouchableOpacity>
            <FontAwesome5 name="crown" size={21} color="gold" />
          </TouchableOpacity>
        </View>

        <View style={styles.contentContainer}>
          <View style={styles.imageContainer}>
            <Image
              source={require("../../assets/speaker.png")}
              style={styles.image}
            />
          </View>

          <Text style={styles.questionText}>
            Hold the button below to record your voice
          </Text>

          <View style={styles.controlsContainer}>
            <TouchableOpacity style={styles.controlButton}>
              <EditButton />
            </TouchableOpacity>
            <LinearGradient
              colors={["rgba(142, 68, 173, 0.2)", "rgba(142, 68, 173, 0.2)"]}
              style={styles.microphoneContainer}
            >
              <TouchableOpacity
                style={styles.microphoneButton}
                onPress={() => navigation.navigate("AfterVoice")}
                disabled={isProcessing}
              >
                <Ionicons
                  name={isRecording ? "stop" : "mic"}
                  size={40}
                  color="black"
                />
              </TouchableOpacity>
            </LinearGradient>
            <TouchableOpacity style={styles.controlButton}>
              <Ionicons name="close" size={24} color="gray" />
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
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
    opacity: 20,
  },
});

export default VoiceChat;
