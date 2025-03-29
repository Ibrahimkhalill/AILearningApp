import React, { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [isLoggedIn, setLoggedIn] = useState(false);
  const [token, setToken] = useState(null);

  useEffect(() => {
    const checkAuthentication = async () => {
      const storedToken = await AsyncStorage.getItem("token");
      const storedRefreshToken = await AsyncStorage.getItem("refresh_token");

      if (storedToken && storedRefreshToken) {
        setLoggedIn(true);
        setToken(storedToken);
      }
    };
    checkAuthentication();
  }, []);

  // ✅ Function to Refresh Access Token

  // ✅ Function to Login and Store Tokens
  const login = async (
    username,
    access_token,
    refresh_token,
    user_id,
    language,
    navigation
  ) => {
    setToken(access_token);
    setLoggedIn(true);
    await AsyncStorage.setItem("username", username);
    await AsyncStorage.setItem("token", access_token);
    await AsyncStorage.setItem("refresh_token", refresh_token);
    await AsyncStorage.setItem("userId", user_id);
    if (language) {
      
      await AsyncStorage.setItem("language", language);
    }
    

    if (language) {
      console.log("Navigating to dashboard");
      navigation.navigate("dashboard");
    } else {
      console.log("Navigating to language page");
      navigation.navigate("language");
    }

    console.log("language", language);

   


    // ✅ Fix: Use access_token directly instead of checking `token`
    
  };

  // ✅ Logout User & Remove Tokens
  const logout = async (navigation) => {
    setLoggedIn(false);
    setToken(null);
    navigation.navigate("login");
    await AsyncStorage.removeItem("username");
    await AsyncStorage.removeItem("token");
    await AsyncStorage.removeItem("refresh_token");
    await AsyncStorage.removeItem("userId");
    await AsyncStorage.removeItem("learningTime");
    console.log("logout");
    
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

const useAuth = () => useContext(AuthContext);

export { AuthProvider, useAuth };
