import React, { useState, useRef, useEffect } from "react";
import {
  Text,
  View,
  TextInput,
  ToastAndroid,
  TouchableOpacity,
  Platform,
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  StyleSheet,
} from "react-native";
import SimpleLineIcon from "react-native-vector-icons/SimpleLineIcons";
import axiosInstance from "../component/axiosInstance";
import { useFocusEffect } from "@react-navigation/native";
import * as Clipboard from "expo-clipboard";
import CircularButton from "../component/BackButton";
import { useTranslation } from "react-i18next"; // Import useTranslation

function ForgetPasswordOtp({ route, navigation }) {
  const { email } = route.params || {};
  console.log("email",email);
  
  const [ForgetPasswordOtpFields, setForgetPasswordOtpFields] = useState([
    "",
    "",
    "",
    "",
  ]);
  const [isOtpFilled, setIsOtpFilled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(120);
  const inputRefs = useRef([]);
  const { t } = useTranslation(); // Initialize translation hook

  useEffect(() => {
    if (timeLeft === 0) return;

    const timerId = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timerId);
  }, [timeLeft]);

  const notifyMessage = (msg) => {
    if (Platform.OS === "android") {
      ToastAndroid.showWithGravityAndOffset(
        msg,
        ToastAndroid.SHORT,
        ToastAndroid.TOP,
        25,
        160
      );
    } else {
      Alert.alert(t("warning"), msg);
    }
  };

  const handleVerifyForgetPasswordOtp = async () => {
    if (ForgetPasswordOtpFields.some((field) => field === "")) {
      notifyMessage(t("enter_all_otp_fields"));
      return;
    }
    if (timeLeft === 0) {
      notifyMessage(t("otp_expired_resend"));
      setForgetPasswordOtpFields(["", "", "", ""]);
      if (inputRefs.current[0]) {
        inputRefs.current[0].focus();
      }
      return;
    }

    const ForgetPasswordOtp = ForgetPasswordOtpFields.join("");
    setIsLoading(true);

    try {
      const response = await axiosInstance.post(`/auth/verify-otp`, {
        otp: ForgetPasswordOtp,
        email: email,
      });
      if (response.status === 200) {
        notifyMessage(t("otp_verified_successfully"));
        navigation.navigate("ResetPassword", {
          email: email,
        });
      } else {
        notifyMessage(t("invalid_otp_try_again"));
      }
    } catch (error) {
      if (error.response) {
        const errorMessage = error.response.data.error || t("invalid_request"); // Adjust based on your API structure
        console.log("Server error:", error.response);
        notifyMessage(errorMessage);
        setForgetPasswordOtpFields(["", "", "", ""]);
        if (inputRefs.current[0]) {
          inputRefs.current[0].focus();
        }
      } else {
        console.log("Error without response:", error.message);
        notifyMessage(t("network_error"));
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpChange = (value, index) => {
    const updatedOtpFields = [...ForgetPasswordOtpFields];

    if (value.length > 1) {
      const pastedValues = value.slice(0, updatedOtpFields.length).split("");
      pastedValues.forEach((char, idx) => {
        if (index + idx < updatedOtpFields.length) {
          updatedOtpFields[index + idx] = char;
        }
      });
      setForgetPasswordOtpFields(updatedOtpFields);

      const lastIndex = index + pastedValues.length - 1;
      if (lastIndex < inputRefs.current.length) {
        inputRefs.current[lastIndex]?.focus();
      } else {
        inputRefs.current[inputRefs.current.length - 1]?.blur();
      }
    } else {
      updatedOtpFields[index] = value;
      setForgetPasswordOtpFields(updatedOtpFields);

      if (value && index < inputRefs.current.length - 1) {
        inputRefs.current[index + 1]?.focus();
      }
    }
  };

  const handleResendForgetPasswordOtp = async () => {
    setForgetPasswordOtpFields(["", "", "", ""]);
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
    try {
      const response = await axiosInstance.post(`/auth/password/reset/`, {
        email: email,
      });

      if (response.status === 200) {
        setTimeLeft(120);
        notifyMessage(t("otp_resent"));
      }
    } catch (error) {
      console.log("error", error);
      notifyMessage(t("error") + ": " + error.message);
    }
  };

  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      if (inputRefs.current[0]) {
        inputRefs.current[0].focus();
      }
      setForgetPasswordOtpFields(["", "", "", ""]);
    }, [])
  );

  const [lastClipboardContent, setLastClipboardContent] = useState("");

  useEffect(() => {
    const checkClipboard = async () => {
      const clipboardContent = await Clipboard.getStringAsync();
      if (
        clipboardContent !== lastClipboardContent &&
        /^\d{4}$/.test(clipboardContent)
      ) {
        const otpArray = clipboardContent.split("");
        setForgetPasswordOtpFields(otpArray);
        setLastClipboardContent(clipboardContent);
        await Clipboard.setStringAsync("");
        const lastInputIndex = inputRefs.current.length - 1;
        inputRefs.current[lastInputIndex]?.focus();
      }
    };
    const interval = setInterval(() => {
      checkClipboard();
    }, 1000);

    return () => clearInterval(interval);
  }, [lastClipboardContent]);

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1, backgroundColor:"#121212" }}>
      <View className="py-16 items-center bg-[#000] w-full px-5 h-full">
        <View style={styles.backButton}>
          <CircularButton navigation={navigation} />
        </View>

        <View style={styles.iconWrapper}>
          <Image
            source={require("../../assets/main_logo.png")}
            style={styles.icon}
          />
        </View>
        <View className="py-3 w-[80%]">
          <Text className="text-[27px] text-center font-semibold text-white">
            {t("otp_verification")}
          </Text>
          <Text className="text-[14px] mt-5 font-semibold text-center text-gray-500">
            {t("enter_verification_code_email")}
          </Text>
        </View>
        <View className="my-5 rounded-lg w-full flex items-center">
          <View className="flex-row items-center justify-center gap-2 mt-2">
            {ForgetPasswordOtpFields.map((field, index) => (
              <TextInput
                key={index}
                ref={(el) => (inputRefs.current[index] = el)}
                className="px-4 py-1 bg-[#8E44AD] text-white rounded-[5px] w-[56px] h-[50px] text-[30px] text-center"
                keyboardType="numeric"
                onChangeText={(value) => handleOtpChange(value, index)}
                value={field}
                onKeyPress={({ nativeEvent }) => {
                  if (
                    nativeEvent.key === "Backspace" &&
                    ForgetPasswordOtpFields[index] === "" &&
                    index > 0
                  ) {
                    const updatedOtp = [...ForgetPasswordOtpFields];
                    updatedOtp[index - 1] = "";
                    setForgetPasswordOtpFields(updatedOtp);
                    inputRefs.current[index - 1]?.focus();
                  }
                }}
              />
            ))}
          </View>

          <TouchableOpacity
            onPress={() => handleVerifyForgetPasswordOtp()}
            className="w-[80%] h-[50px] bg-[#8E44AD] text-white mt-10 rounded-xl flex items-center justify-center"
          >
            {isLoading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text className="text-center text-white text-[18px]">
                {t("verify_otp")}
              </Text>
            )}
          </TouchableOpacity>

          <View className="mt-3 flex-row items-center">
            <Text className="text-[14px] text-gray-600">
              {`${String(Math.floor(timeLeft / 60)).padStart(2, "0")}:${String(
                timeLeft % 60
              ).padStart(2, "0")}`}
            </Text>
            <TouchableOpacity
              onPress={handleResendForgetPasswordOtp}
              disabled={timeLeft > 0}
            >
              <Text
                className={`text-[#8E44AD] ml-1 font-medium ${
                  timeLeft > 0 ? "opacity-50" : ""
                }`}
              >
                {t("resend_otp")}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 50,
  },
  backButton: {
    width: "100%",
    alignItems: "flex-start",
  },
  backButtonText: {
    color: "#FFF",
    fontSize: 20,
  },
  iconWrapper: {
    marginBottom: 30,
    marginTop: 50,
  },
  icon: {
    width: 100,
    height: 100,
  },
  title: {
    color: "#FFF",
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  subtitle: {
    color: "#FFF",
    fontSize: 14,
    textAlign: "center",
    marginBottom: 40,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1E1E1E",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 8, // For Android shadow
    borderRadius: 8,
    marginBottom: 15,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: "#444",
    width: "100%",
    height: 55,
  },
  input: {
    flex: 1,
    color: "#FFFFFF",
    fontSize: 14,
  },
  gradientButton: {
    paddingVertical: 15,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
    width: "100%",
  },
  sendButton: {
    width: "100%",
    marginVertical: 20,
  },
  sendButtonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  loginText: {
    color: "#FFF",
    fontSize: 14,
  },
  loginLink: {
    color: "#8E44AD",
    fontWeight: "bold",
  },
});

export default ForgetPasswordOtp;