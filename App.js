import { StatusBar } from "expo-status-bar";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { StyleSheet, Platform } from "react-native";

import { AuthProvider, useAuth } from "./app/screen/component/Auth";
import Home from "./app/screen/WelcomeScreen";
import i18n from "./app/screen/component/language/i18n"; // Import your i18n instance
import { I18nextProvider } from "react-i18next"; // Import the provider
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
import SignupOtpVerification from "./app/screen/authentication/SignupOtpVerification";
import PasswordChanged from "./app/screen/authentication/PasswordChanged";
import { LearningTimeProvider } from "./app/screen/component/LearningTimeContext";
import firebase from "firebase/app";
import "firebase/auth";

const Stack = createNativeStackNavigator();

// ✅ Authentication Stack
function AuthStack() {
  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false }}
      initialRouteName="home"
    >
      <Stack.Screen name="home" component={Home} />
      <Stack.Screen name="signup" component={Signup} />
      <Stack.Screen name="login" component={Login} />
      <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
      <Stack.Screen name="ResetPassword" component={ResetPassword} />
      <Stack.Screen name="OTP" component={SignupOtpVerification} />
      <Stack.Screen name="PasswordChanged" component={PasswordChanged} />
      <Stack.Screen
        name="OTPVerificationScreen"
        component={OTPVerificationScreen}
      />
       <Stack.Screen name="language" component={LanguageSelection} />
    </Stack.Navigator>
  );
}

// ✅ App Stack After Login
function AfterLogin() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="dashborad" component={Dashboard} />
      <Stack.Screen name="language" component={LanguageSelection} />
      <Stack.Screen name="expertiselevel" component={ExpertiseLevel} />
      <Stack.Screen name="DailyGoalScreen" component={DailyGoalScreen} />
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
    </Stack.Navigator>
  );
}

// ✅ Select Stack Based on Authentication
function AppContent() {
  const { isLoggedIn } = useAuth();
  return isLoggedIn ? <AfterLogin /> : <AuthStack />;
}

// ✅ App Entry Point
export default function App() {
  return (
    <I18nextProvider i18n={i18n}>
    <AuthProvider>
      <LearningTimeProvider>
        <SafeAreaProvider>
          <NavigationContainer>
            <AppContent />
          </NavigationContainer>
          {/* Ensure consistent status bar background */}
          <StatusBar style="light" backgroundColor="#000000" />
        </SafeAreaProvider>
      </LearningTimeProvider>
    </AuthProvider>
    </I18nextProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
    backgroundColor: "#000000", // Ensure the background color is set to black
  },
});
