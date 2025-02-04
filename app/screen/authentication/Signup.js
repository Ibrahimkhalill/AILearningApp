import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  Alert,
  Button,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import axiosInstance from "../component/axiosInstance";
import * as WebBrowser from "expo-web-browser";
import * as AuthSession from "expo-auth-session";
import { requestTrackingPermissionsAsync } from "expo-tracking-transparency";
import {
  AccessToken,
  GraphRequest,
  GraphRequestManager,
  LoginManager,
  Settings,
  ShareDialog,
} from "react-native-fbsdk-next";
import {
  GoogleSignin,
  GoogleSigninButton,
} from "@react-native-google-signin/google-signin";

const passwordCriteria = [
  {
    label: "At least 8 characters.",
    check: (password) => password.length >= 8,
  },
  {
    label: "Contains at least one letter.",
    check: (password) => /[A-Za-z]/.test(password),
  },
  {
    label: "Contains at least one digit.",
    check: (password) => /\d/.test(password),
  },
  {
    label: "Contains at least one special character.",
    check: (password) => /[@$!%*?&]/.test(password),
  },
];

const PasswordCriteriaComponent = ({ password }) => {
  return (
    <View style={styles.criteriaContainer}>
      {passwordCriteria.map((criterion, index) => {
        const isValid = criterion.check(password);
        return (
          <View key={index} style={styles.criteriaItem}>
            <Ionicons
              name={isValid ? "checkmark-circle" : "close-circle"}
              size={16}
              color={isValid ? "green" : "red"}
              style={{ marginRight: 5 }}
            />
            <Text style={{ color: isValid ? "green" : "red" }}>
              {criterion.label}
            </Text>
          </View>
        );
      })}
    </View>
  );
};

export default function Signup({ navigation }) {
  const [formData, setFormData] = useState({
    userName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  WebBrowser.maybeCompleteAuthSession();
  const [errors, setErrors] = useState({});
  const [isChecked, setChecked] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [emailExitError, setEmailExitError] = useState("");

  // Email format validation

  const debounceTimeout = useRef(null);

  const checkEmailAvailability = (emailToCheck) => {
    // Clear the previous timeout if it exists
    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }

    // Set a new timeout
    debounceTimeout.current = setTimeout(async () => {
      try {
        const response = await axiosInstance.post("/auth/check-email", {
          email: emailToCheck,
        });
        if (response.data.exists) {
          setEmailExitError("This email is already registered.");
        }
      } catch (error) {
        console.log("Error checking email availability:", error);
        setErrors((prevErrors) => ({
          ...prevErrors,
          email: "Unable to verify email. Please try again later.",
        }));
      }
    }, 500); // 500ms delay
  };

  const validateEmailFormat = (email) => {
    const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return regex.test(email);
  };
  // Handle field changes and validations
  const handleTextChange = (field, value) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      [field]: value,
    }));

    // Clear the error for the specific field
    setErrors((prevErrors) => ({ ...prevErrors, [field]: "" }));

    // Additional validation for specific fields
    if (field === "email") {
      if (validateEmailFormat(value)) {
        // If email format is valid, check availability
        checkEmailAvailability(value);
      } else {
        setErrors((prevErrors) => ({
          ...prevErrors,
          email: "Please enter a valid email address.",
        }));
        setEmailExitError("");
      }
    }

    if (field === "password") {
      if (validatePasswordFormat(value)) {
        setErrors((prevErrors) => ({ ...prevErrors, password: "" }));
      } else {
        setErrors((prevErrors) => ({
          ...prevErrors,
          password:
            "Password must be at least 8 characters long and contain a number, a letter, and a special character.",
        }));
      }
    }

    if (field === "confirmPassword" && formData.confirmPassword) {
      if (value === formData.password) {
        setErrors((prevErrors) => ({ ...prevErrors, confirmPassword: "" }));
      } else {
        setErrors((prevErrors) => ({
          ...prevErrors,
          confirmPassword: "Passwords do not match.",
        }));
      }
    }
  };
  useEffect(() => {
    if (formData.password && formData.confirmPassword) {
      if (formData.password === formData.confirmPassword) {
        setErrors((prevErrors) => ({ ...prevErrors, confirmPassword: "" }));
      } else {
        setErrors((prevErrors) => ({
          ...prevErrors,
          confirmPassword: "Passwords do not match.",
        }));
      }
    }
  }, [formData.password, formData.confirmPassword]);

  // Validate password
  const validatePasswordFormat = (password) => {
    return passwordCriteria.every((criterion) => criterion.check(password));
  };

  // Handle Signup Submission
  const handleUserSignup = async () => {
    const formErrors = {};

    // Field Validation
    if (!formData.userName) formErrors.userName = "User Name is required.";
    if (!formData.email) formErrors.email = "Email Address is required.";
    if (!formData.password) formErrors.password = "Password is required.";
    if (!formData.confirmPassword)
      formErrors.confirmPassword = "Confirm Password is required.";

    // Specific Validations
    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      formErrors.email = "Invalid Email Address.";
    }
    if (formData.password && !validatePasswordFormat(formData.password)) {
      formErrors.password = "Password must meet the required criteria.";
    }
    if (formData.password !== formData.confirmPassword) {
      formErrors.confirmPassword = "Passwords do not match.";
    }
    if (!isChecked) {
      Alert.alert(
        "Terms Not Accepted",
        "You must accept the Terms and Privacy Policy."
      );
      return;
    }

    // Set Errors or Proceed
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    try {
      // Perform email availability check

      // Proceed with signup (send-otp)
      const response = await axiosInstance.post(`/auth/password/reset`, {
        email: formData.email,
      });

      if (response.status === 200) {
        navigation.navigate("OTP", {
          formData: formData,

          // Add other data you want to send
        });
      }
    } catch (error) {
      if (error.response) {
        // If the server returned a response (e.g., 400 status)
        const errorMessage = error.response.data.error || "Invalid request"; // Adjust based on your API structure
        console.log("Server error:", error.response);

        // Display the error message in a toast or alert
        notifyMessage(errorMessage);

        // Optionally set it in state to display in the UI
      } else {
        // Handle other types of errors (e.g., network issues)
        console.log("Error without response:", error.message);
        notifyMessage("Network error. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const [error, setError] = useState();
  const [userInfo, setUserInfo] = useState();

  useEffect(() => {
    GoogleSignin.configure({
      webClientId:
        "213689067467-08de6om0f6r09achc242q8211jtlg613.apps.googleusercontent.com",
    });
  }, []);

  const signin = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const user = await GoogleSignin.signIn();
      console.log("user", user);
      const userName = response.data.user.name;
      const userEmail = response.data.user.email;
      const userProfilePic = response.data.user.photo;
      setUserInfo(user);
      setError();
    } catch (e) {
      setError(e);
    }
  };

  useEffect(() => {
    const requestTracking = async () => {
      const { status } = await requestTrackingPermissionsAsync();

      Settings.initializeSDK();

      if (status === "granted") {
        await Settings.setAdvertiserTrackingEnabled(true);
      }
    };

    requestTracking();
  }, []);

  const getData = () => {
    const infoRequest = new GraphRequest("/me", null, (error, result) => {
      console.log(error || result);
    });
    new GraphRequestManager().addRequest(infoRequest).start();
  };

  const handleFacebookLogin = () => {
    // Request login with both public_profile and email permissions
    LoginManager.logInWithPermissions(["public_profile", "email"]).then(
      (result) => {
        if (result.isCancelled) {
          console.log("Login cancelled");
        } else {
          console.log(
            "Login success with permissions: " +
              result.grantedPermissions.toString()
          );

          // Get current access token
          const access_token = AccessToken.getCurrentAccessToken().then(
            (data) => {
              console.log("Access Token", data);

              // Fetch user info including email
              fetch(
                `https://graph.facebook.com/v12.0/${data.userID}?fields=name,email,picture&access_token=${data.accessToken}`
              )
                .then((response) => response.json())
                .then((userData) => {
                  console.log("User Info: ", userData);
                  // You should now have the user's email in userData.email
                })
                .catch((error) => {
                  console.log("Error fetching user data: ", error);
                });
            }
          );
          const infoRequest = new GraphRequest(
            "/me",

            {
              accessToken: access_token.accessToken.toString(),

              parameters: {
                fields: "email",
              },
            },

            (error, data) => {
              if (!error) {
                // data.email will contain the user's email address

                console.log("User email:", data.email);
              } else {
                console.error("Error fetching user data:", error);
              }
            }
          );
          new GraphRequestManager().addRequest(infoRequest).start();
        }
      },
      (error) => {
        console.log("Login fail with error: " + error);
      }
    );
  };

  return (
    <ScrollView>
      <View style={styles.container}>
        <Image
          source={require("../../assets/signup.png")}
          style={styles.image}
          resizeMode="contain"
        />
        <Text style={styles.header}>New journey starts</Text>
        <Text style={styles.subHeader}>
          Start learning your favorite language
        </Text>

        <View style={styles.inputContainer}>
          {/* User Name */}
          <Text style={styles.label}>Your Name</Text>
          <View
            style={[
              styles.inputWrapper,
              errors.userName && { borderColor: "red" }, // Red border if error exists
            ]}
          >
            <Ionicons name="person-outline" size={20} color="#888" />
            <TextInput
              style={styles.input}
              placeholder="@Your name"
              placeholderTextColor="#888"
              value={formData.userName}
              onChangeText={(value) => handleTextChange("userName", value)}
            />
          </View>
          {errors.userName && (
            <Text style={styles.errorText}>{errors.userName}</Text>
          )}

          {/* Email */}
          <Text style={styles.label}>Email Address</Text>
          <View
            style={[
              styles.inputWrapper,
              (emailExitError || errors.email) && { borderColor: "red" }, // Red border if error exists
            ]}
          >
            <MaterialCommunityIcons
              name="email-outline"
              size={20}
              color="#888"
            />
            <TextInput
              style={styles.input}
              placeholder="Email Address"
              placeholderTextColor="#888"
              value={formData.email}
              onChangeText={(value) => handleTextChange("email", value)}
            />
          </View>
          {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
          {emailExitError && (
            <Text style={styles.errorText}>{emailExitError}</Text>
          )}

          {/* Password */}
          <Text style={styles.label}>Password</Text>
          <View
            style={[
              styles.inputWrapper,
              errors.password && { borderColor: "red" }, // Red border if error exists
            ]}
          >
            <Ionicons name="lock-closed-outline" size={20} color="#888" />
            <TextInput
              style={styles.input}
              placeholder="*************"
              secureTextEntry={!passwordVisible}
              placeholderTextColor="#888"
              value={formData.password}
              onChangeText={(value) => handleTextChange("password", value)}
            />
            <TouchableOpacity
              onPress={() => setPasswordVisible(!passwordVisible)}
            >
              <Ionicons
                name={passwordVisible ? "eye-off" : "eye"}
                size={20}
                color="#888"
              />
            </TouchableOpacity>
          </View>
          {errors.password && (
            <Text style={styles.errorText}>{errors.password}</Text>
          )}
          {errors.password && (
            <PasswordCriteriaComponent password={formData.password} />
          )}
          {/* Confirm Password */}
          <Text style={styles.label}>Confirm Password</Text>
          <View
            style={[
              styles.inputWrapper,
              errors.confirmPassword && { borderColor: "red" }, // Red border if error exists
            ]}
          >
            <Ionicons name="lock-closed-outline" size={20} color="#888" />
            <TextInput
              style={styles.input}
              placeholder="*************"
              secureTextEntry
              placeholderTextColor="#888"
              value={formData.confirmPassword}
              onChangeText={(value) =>
                handleTextChange("confirmPassword", value)
              }
            />
          </View>
          {errors.confirmPassword && (
            <Text style={styles.errorText}>{errors.confirmPassword}</Text>
          )}
        </View>

        {/* Checkbox */}
        <View style={styles.checkboxContainer}>
          <TouchableOpacity
            onPress={() => setChecked(!isChecked)}
            style={styles.checkbox}
          >
            <Ionicons
              name={isChecked ? "checkbox" : "square-outline"}
              size={25}
              color="#fff"
            />
          </TouchableOpacity>
          <Text style={styles.checkboxLabel}>
            You Accept The Terms Of Service And Privacy Policy
          </Text>
        </View>

        {/* Sign Up Button */}
        <TouchableOpacity onPress={handleUserSignup} style={styles.button}>
          <LinearGradient
            colors={["#8E44AD", "#8E44AD"]}
            style={styles.gradientButton}
          >
            <Text style={styles.buttonText}>SIGN UP</Text>
          </LinearGradient>
        </TouchableOpacity>
        <Text style={styles.orText}>Or continue with</Text>
        <View style={styles.socialButtons}>
          <TouchableOpacity
            style={styles.socail_button}
            onPress={() => signin()}
          >
            <Ionicons name="logo-google" size={30} color="#DB4437" />
          </TouchableOpacity>
          {/* <LoginButton
            onLogoutFinished={() => console.log("Logged out")}
            onLoginFinished={(error, data) => {
              console.log(error || data);
              AccessToken.getCurrentAccessToken().then((data) =>
                console.log(data)
              );
            }}
          /> */}
          <TouchableOpacity
            style={styles.socail_button}
            onPress={handleFacebookLogin}
          >
            <FontAwesome5 name="facebook" size={30} color="#0A66C2" />
          </TouchableOpacity>
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
    padding: 20,
  },
  inputContainer: {
    width: "100%",
    marginBottom: 20,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1E1E1E",
    paddingHorizontal: 10,
    borderRadius: 8,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#444",
  },
  input: {
    flex: 1,
    color: "#FFFFFF",
    padding: 15,
    fontSize: 14,
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  checkboxLabel: {
    color: "#FFFFFF",
    fontSize: 12,
  },
  errorText: {
    color: "red",
    fontSize: 12,
    marginBottom: 10,
  },
  button: {
    width: "100%",
    borderRadius: 8,
    overflow: "hidden",
  },
  gradientButton: {
    paddingVertical: 15,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  criteriaContainer: {
    marginVertical: 10,
  },
  criteriaItem: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 5,
  },
  label: {
    color: "#A4A4A4",
    marginBottom: 5,
  },
  errorText: {
    color: "red",
    fontSize: 12,
    marginBottom: 10,
  },
  socail_button: {
    width: 60,
    height: 52,
    backgroundColor: "#1E1E1E",
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 8, // For Android shadow
    borderWidth: 1,
    borderColor: "#444",
  },
  image: {
    width: 400,
    height: 258,
    marginBottom: 20,
  },
  header: {
    fontSize: 34,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 10,
  },
  subHeader: {
    fontSize: 14,
    color: "#AAAAAA",
    marginBottom: 30,
  },
  inputContainer: {
    width: "100%",
    marginBottom: 20,
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
    marginBottom: 10,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: "#444",
  },
  icon: {
    marginRight: 3,
  },
  input: {
    flex: 1,
    color: "#FFFFFF",
    padding: 15,
    fontSize: 14,
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  checkbox: {
    marginRight: 10,
  },
  checkboxLabel: {
    color: "#FFFFFF",
    fontSize: 12,
  },
  button: {
    width: "100%",
    borderRadius: 8,
    overflow: "hidden",
    marginBottom: 20,
  },
  gradientButton: {
    paddingVertical: 15,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  orText: {
    color: "#AAAAAA",
    marginBottom: 10,
  },
  socialButtons: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    width: "70%",
  },
});
