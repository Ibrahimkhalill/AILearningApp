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
    await AsyncStorage.setItem("username", username);
    await AsyncStorage.setItem("token", access_token);
    await AsyncStorage.setItem("refresh_token", refresh_token);
    await AsyncStorage.setItem("userId", user_id);
    await AsyncStorage.setItem("language", language);

    console.log("language", language);

    setLoggedIn(true);
    setToken(access_token);

    // ✅ Fix: Use access_token directly instead of checking `token`
    if (access_token) {
      if (language) {
        console.log("jjdk");

        navigation.replace("dashboard"); // ✅ Use `replace` to avoid going back
      } else {
        console.log("login");

        navigation.replace("language");
      }
    }
  };

  // ✅ Logout User & Remove Tokens
  const logout = async () => {
    await AsyncStorage.removeItem("username");
    await AsyncStorage.removeItem("token");
    await AsyncStorage.removeItem("refresh_token");
    await AsyncStorage.removeItem("userId");
    await AsyncStorage.removeItem("language");
    await AsyncStorage.removeItem("learningTime");

    setLoggedIn(false);
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

const useAuth = () => useContext(AuthContext);

export { AuthProvider, useAuth };
