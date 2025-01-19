import { StatusBar } from "expo-status-bar";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createDrawerNavigator } from "@react-navigation/drawer";
import "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import React, { useEffect } from "react";
import { StyleSheet, Platform } from "react-native";

import { AuthProvider, useAuth } from "./app/screen/component/Auth";
import Home from "./app/screen/WelcomeScreen";

import Signup from "./app/screen/authentication/Signup";
import Login from "./app/screen/authentication/Login";
import LanguageSelection from "./app/screen/LanguageSelection";
import ExpertiseLevel from "./app/screen/ExpertiseLevel";
import DailyGoalScreen from "./app/screen/DailyGoalScreen";
import Dashboard from "./app/screen/Dashboard";
import Asking from "./app/screen/Asking";
import OrderingCofee from "./app/screen/OrderingCofee";
import AiChatBot from "./app/screen/chat/AiChatBot";
import ChatHome from "./app/screen/chat/ChatHome";
import VoiceChat from "./app/screen/chat/VoiceChat";
import AfterVoice from "./app/screen/chat/AfterVoice";
import LanugaeChat from "./app/screen/chat/LanugaeChat";
import ProfileScreen from "./app/screen/profile/ProfileScreen";
import SettingsPage from "./app/screen/setting/SettingsPage";
import ManageSubscription from "./app/screen/setting/ManageSubscription";
import FAQPage from "./app/screen/setting/FAQPage";
import HelpSupport from "./app/screen/setting/HelpSupport";
import TermsConditions from "./app/screen/setting/TermsConditions";
import Shooping from "./app/screen/Shopping";
import ForgotPassword from "./app/screen/authentication/ForgotPassword";
import OTPVerificationScreen from "./app/screen/authentication/OTPVerificationScreen";
import ResetPassword from "./app/screen/authentication/ResetPassword";
const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

function AuthStack() {
  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false }}
      initialRouteName="home"
    >
      <Stack.Screen name="home" component={Home} />
      <Stack.Screen name="signup" component={Signup} />
      <Stack.Screen name="login" component={Login} />
      <Stack.Screen name="language" component={LanguageSelection} />
      <Stack.Screen name="expertiselevel" component={ExpertiseLevel} />
      <Stack.Screen name="DailyGoalScreen" component={DailyGoalScreen} />
      <Stack.Screen name="dashborad" component={Dashboard} />
      <Stack.Screen name="asking" component={Asking} />
      <Stack.Screen name="OrderingCofee" component={OrderingCofee} />
      <Stack.Screen name="Shooping" component={Shooping} />
      <Stack.Screen name="AiChatBot" component={AiChatBot} />
      <Stack.Screen name="ChatHome" component={ChatHome} />
      <Stack.Screen name="VoiceChat" component={VoiceChat} />
      <Stack.Screen name="AfterVoice" component={AfterVoice} />
      <Stack.Screen name="LanguageChat" component={LanugaeChat} />
      <Stack.Screen name="profile" component={ProfileScreen} />
      <Stack.Screen name="SettingsPage" component={SettingsPage} />
      <Stack.Screen name="ManageSubscription" component={ManageSubscription} />
      <Stack.Screen name="FAQPage" component={FAQPage} />
      <Stack.Screen name="helpsupport" component={HelpSupport} />
      <Stack.Screen name="TermsConditions" component={TermsConditions} />
      <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
      <Stack.Screen name="ResetPassword" component={ResetPassword} />
      <Stack.Screen
        name="OTPVerificationScreen"
        component={OTPVerificationScreen}
      />
    </Stack.Navigator>
  );
}

function AppContent() {
  return <AuthStack />;
}

export default function App() {
  return (
    <AuthProvider>
      <SafeAreaProvider>
        <NavigationContainer>
          <AppContent />
        </NavigationContainer>
        <StatusBar style="light" backgroundColor="#121212" />
      </SafeAreaProvider>
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
    backgroundColor: Platform.OS === "white" ? StatusBar.currentHeight : 0,
  },
});
