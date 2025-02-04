import React, { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Create the Learning Time Context
const LearningTimeContext = createContext();

// Provider to manage learning time
export const LearningTimeProvider = ({ children }) => {
  const [learningTime, setLearningTime] = useState({ hours: 0, minutes: 0 });

  // Function to update learning time
  const updateLearningTime = (totalSeconds) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    setLearningTime({ hours, minutes });
  };

  // Fetch initial data from AsyncStorage
  useEffect(() => {
    const fetchInitialLearningTime = async () => {
      const storedData = await AsyncStorage.getItem("learningTime");
      if (storedData) {
        const learningData = JSON.parse(storedData);
        const today = new Date().toISOString().split("T")[0]; // Get today's date

        const todayEntry = learningData.find((entry) => entry.date === today);
        if (todayEntry) {
          updateLearningTime(todayEntry.time); // Update global learning time from storage
        }
      }
    };

    fetchInitialLearningTime(); // Fetch the initial learning time
  }, []); // This only runs once when the component is mounted

  return (
    <LearningTimeContext.Provider value={{ learningTime, updateLearningTime }}>
      {children}
    </LearningTimeContext.Provider>
  );
};

// Custom hook to use learning time
export const useLearningTime = () => useContext(LearningTimeContext);
