import React, { useState, useEffect } from "react";
import { View, TouchableOpacity, StyleSheet, Text } from "react-native";
import { Audio } from "expo-av";
import { FontAwesome } from "@expo/vector-icons"; // For Play/Pause icon
import Svg, { Rect } from "react-native-svg";

export default function VoiceMessagePlayer({ source }) {
  const [sound, setSound] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0); // Total duration of the audio
  const [position, setPosition] = useState(0); // Current position of the audio

  const waveformData = [
    5, 20, 35, 40, 15, 10, 5, 10, 20, 25, 20, 10, 5, 15, 25, 15, 10, 12, 13, 40,
    10, 20, 25, 20, 10, 20, 10, 20, 25, 20, 10,
  ];

  // Function to load audio
  async function loadAudio() {
    if (sound) {
      await sound.unloadAsync(); // Unload previous audio
      setSound(null);
    }

    try {
      const { sound: newSound } = await Audio.Sound.createAsync(
        { uri: source } // Audio URL
      );
      setSound(newSound);
      newSound.setOnPlaybackStatusUpdate(updateStatus);
      console.log("Audio loaded successfully");
    } catch (error) {
      console.error("Error loading audio", error);
    }
  }

  // Function to update playback status
  function updateStatus(status) {
    if (status.isLoaded) {
      setDuration(status.durationMillis || 0); // Total duration in milliseconds
      setPosition(status.positionMillis || 0); // Current position in milliseconds
      if (status.didJustFinish) {
        setIsPlaying(false); // Stop playback when finished
      }
    } else {
      console.error("Error: Audio not loaded properly");
    }
  }

  // Function to handle Play/Pause
  async function togglePlayback() {
    if (sound) {
      if (isPlaying) {
        await sound.pauseAsync();
        console.log("Audio paused");
      } else {
        await sound.playAsync();
        console.log("Audio playing");
      }
      setIsPlaying(!isPlaying);
    } else {
      console.log("====================================");
      console.log("play");
      console.log("====================================");
      await loadAudio(); // Load and play audio if not already loaded
      await sound.playAsync();
      setIsPlaying(true);
      console.log("Audio started playing");
    }
  }

  // Calculate the number of bars to be filled based on playback progress
  const filledBars = Math.floor((position / duration) * waveformData.length);

  return (
    <View style={{ alignItems: "center" }}>
      <View style={styles.container}>
        {/* Play/Pause Button */}
        <TouchableOpacity style={styles.playButton} onPress={togglePlayback}>
          <FontAwesome
            name={isPlaying ? "pause" : "play"}
            size={15}
            color="#fff"
          />
        </TouchableOpacity>

        {/* Waveform Visualization */}
        <Svg height="50" width="160" style={styles.waveform}>
          {waveformData.map((height, index) => (
            <Rect
              key={index}
              x={index * 6} // Spacing between bars
              y={(50 - height) / 2} // Center the bars vertically
              width={2} // Bar width
              height={height} // Bar height
              fill={index < filledBars ? "#32CD32" : "#ccc"} // Green for played, gray for unplayed
              rx={2} // Rounded corners
            />
          ))}
        </Svg>
        <Text style={styles.timer}>{formatTime(duration - position)}</Text>
      </View>
    </View>
  );
}

// Function to format time in mm:ss
function formatTime(millis) {
  const minutes = Math.floor(millis / 60000);
  const seconds = Math.floor((millis % 60000) / 1000);
  return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
}

// Styles
const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 10,
    shadowColor: "#000",
    shadowRadius: 5,
  },
  playButton: {
    width: 30,
    height: 30,
    backgroundColor: "#32CD32",
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  waveform: {
    flex: 1,
  },
  timer: {
    fontSize: 12,
    textAlign: "center",
    color: "#777",
  },
});
