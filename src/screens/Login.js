import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert,
  Dimensions,
  ScrollView,
  ImageBackground,
} from "react-native";
import {
  moderateScale,
  moderateVerticalScale,
} from "react-native-size-matters";

import React, { useContext, useEffect, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebase";
import { AuthContext } from "../../Store/AuthContext";
import { LinearGradient } from "expo-linear-gradient";
import BackButton from "../components/BackButton";

const { height } = Dimensions.get("window");

export default function Login() {
  const authCtx = useContext(AuthContext);

  const [email, setEmail] = useState("davidameyaw607@gmail.com");
  const [password, setPassword] = useState("Lhegacy");
  const [emailError, setEmailError] = useState("");
  const [isFormValid, setIsFormValid] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigation = useNavigation();
  const [passwordError, setPasswordError] = useState("");

  const withTimeout = (promise, timeout = 30000) => {
    return Promise.race([
      promise,
      new Promise((_, reject) =>
        setTimeout(() => {
          reject(new Error("timeout-error"));
        }, timeout)
      ),
    ]);
  };
  const handleLogin = async () => {
    setLoading(true);
    setError("");
    try {
      const userCredential = await withTimeout(
        signInWithEmailAndPassword(auth, email, password)
      );
      const token = await userCredential.user.getIdToken();
      console.log(token);

      authCtx.authenticate(token);

      // navigation.navigate("Home");
    } catch (error) {
      console.log(error.code);
      if (error.code === "auth/invalid-credential") {
        Alert.alert(
          "Login Failed",
          "Email or password is incorrect. Please try again.",
          [{ text: "OK" }]
        );
      }
      if (error.code === "auth/network-request-failed") {
        Alert.alert(
          "Network Error",
          "Unable to complete the signup process due to a network issue. Please check your internet connection and try again.",
          [{ text: "OK" }]
        );
        setError(
          "Network request failed. Please ensure you're connected to the internet."
        );
      }
      if (error.message === "timeout-error") {
        Alert.alert(
          "Timeout",
          "The signup process is taking too long. Please check your connection and try again.",
          [{ text: "OK" }]
        );
        setError("Signup timed out. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };
  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email.toLowerCase());
  };

  const validatePassword = (password) => {
    return password.length >= 6; // You can adjust this rule as needed
  };

  const handleEmailChange = (text) => {
    setEmail(text);
    if (text.length > 0 && !validateEmail(text)) {
      setEmailError("Please enter a valid email address");
    } else {
      setEmailError("");
    }
  };

  const handlePasswordChange = (text) => {
    setPassword(text);
    if (text.length > 0 && !validatePassword(text)) {
      setPasswordError("Password must be at least 6 characters");
    } else {
      setPasswordError("");
    }
  };

  useEffect(() => {
    const isEmailValid = validateEmail(email);
    const isPasswordValid = validatePassword(password);
    const noEmailError = emailError === "";

    setIsFormValid(isEmailValid && isPasswordValid && noEmailError);
  }, [email, password, emailError]);

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardAvoidingView}
      >
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={styles.scroll}
          showsVerticalScrollIndicator={false}
        >
          {/* Background header */}
          <ImageBackground
            source={require("../../assets/Splash3.png")} // Updated image path
            style={styles.header}
            resizeMode="cover"
          >
            <View style={styles.wrap}>
              <View style={styles.overlay}>
                <Text style={styles.logo}>UNIPAL</Text>
              </View>
              <BackButton color="white" />
              {/* Bottom Sheet */}
              <View style={styles.bottomSheet}>
                <ScrollView
                  showsVerticalScrollIndicator={false}
                  contentContainerStyle={{ paddingBottom: 20 }}
                >
                  <Text style={styles.title}>Sign in</Text>
                  <Text style={styles.description}>
                    with the same email address and password you used to open
                    the account during registration
                  </Text>
                  <TextInput
                    style={[
                      styles.input,
                      emailError ? styles.inputError : null,
                    ]}
                    placeholder="Enter your email"
                    value={email}
                    onChangeText={handleEmailChange}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    placeholderTextColor="#777"
                  />
                  {emailError ? (
                    <Text style={styles.errorText}>{emailError}</Text>
                  ) : null}
                  <View
                    style={[
                      styles.passwordContainer,
                      passwordError ? styles.inputError : null,
                    ]}
                  >
                    <TextInput
                      style={styles.passwordInput}
                      placeholder="Enter your password"
                      value={password}
                      onChangeText={handlePasswordChange}
                      secureTextEntry={!showPassword}
                      placeholderTextColor="#777"
                    />
                    <TouchableOpacity
                      onPress={() => setShowPassword(!showPassword)}
                      style={styles.eyeIcon}
                    >
                      <Ionicons
                        name={showPassword ? "eye" : "eye-off"}
                        size={22}
                        color="#9B0E10"
                      />
                    </TouchableOpacity>
                  </View>

                  <TouchableOpacity
                    onPress={handleLogin}
                    disabled={loading || !isFormValid}
                    style={
                      !isFormValid || loading
                        ? styles.buttonDisabledWrapper
                        : null
                    }
                  >
                    <LinearGradient
                      colors={
                        isFormValid && !loading
                          ? ["#9B0E10", "#C80D10"]
                          : ["#cccccc", "#aaaaaa"]
                      }
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                      style={styles.button}
                    >
                      {loading ? (
                        <ActivityIndicator color="#fff" />
                      ) : (
                        <Text style={styles.buttonText}>Sign In</Text>
                      )}
                    </LinearGradient>
                  </TouchableOpacity>
                  <Text
                    onPress={() => navigation.navigate("ForgotPasswordScreen")}
                    style={styles.loginText}
                  >
                    Forgot Password?
                  </Text>

                  <Text
                    onPress={() => navigation.navigate("SignUp")}
                    style={styles.loginText}
                  >
                    Sign up{" "}
                    <Text style={styles.loginLink}>
                      if you don't have an account.
                    </Text>
                  </Text>
                </ScrollView>
              </View>
            </View>
          </ImageBackground>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  scroll: {
    flexGrow: 1,
    // padding: 20,
    // paddingTop: 50,
  },
  header: {
    flex: 1, // or a fixed height like height: '100%' or height: 400
    width: "100%",
    height: "100%",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    // marginTop: Platform.OS === "android" ? 30 : 0,
  },
  inputError: {
    borderColor: "#FF0000",
  },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    marginBottom: 12,
    overflow: "hidden",
    fontSize: 14,
    // padding: 16,
  },
  overlay: {
    flex: 1,
    // backgroundColor: "rgba(0,0,0,0.4)",
    width: "100%",
    paddingTop: Platform.OS === "ios" ? 150 : 120, // Add padding for safe area
    alignItems: "center", // Keep items centered horizontally
    justifyContent: "flex-start", // Align items to the top
  },
  backButton: {
    position: "absolute",
    top: Platform.OS === "ios" ? 50 : 30,
    left: 20,
    zIndex: 20, // Ensure it's on top of everything
    padding: 6,
    backgroundColor: "rgba(0,0,0,0.2)",
    borderRadius: 12,
  },
  logo: {
    paddingTop: Platform.OS === "ios" ? 150 : 120, // Add padding for safe area
    fontSize: 56,
    color: "#fff",
    fontWeight: "bold",
    zIndex: 10, // Ensure it's on top
  },
  subLogo: {
    fontSize: 20,
    color: "#cce7ff",
  },

  bottomSheet: {
    // position: "absolute",
    bottom: 0,
    width: "100%",
    height: height * 0.45,
    backgroundColor: "#fff",
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    paddingHorizontal: 30,
    paddingTop: 20,

    // Shadow for iOS
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: -3,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,

    // Shadow for Android
    elevation: 10,
  },
  title: {
    fontSize: moderateScale(24, 0.8),
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
    color: "#222",
  },
  buttonDisabledWrapper: {
    opacity: 0.6, // Makes the gradient appear dim when loading
  },
  description: {
    // width: "50%",
    textAlign: "center",
    color: "#666",
    fontSize: 14,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    padding: 16,
    fontSize: 14,
    marginBottom: 12,
    color: "#333",
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    paddingHorizontal: 16,
    backgroundColor: "white",
    marginBottom: 12,
    height: 50,
  },

  passwordInput: {
    flex: 1,
    fontSize: 14,
    color: "#333",
  },
  buttonDisabled: {
    backgroundColor: "#ccc",
  },

  eyeIcon: {
    marginLeft: 10,
  },
  wrap: {
    flex: 1,
    // backgroundColor: "rgba(0, 0, 0, 0.18)",
    // paddingHorizontal: 32,
    // paddingVertical: 60,
    // justifyContent: "center",
    // alignItems: "center",
    width: "100%",
  },
  keyboardAvoidingView: {
    flex: 1,
  },

  button: {
    // backgroundColor: "#0096FF",
    borderRadius: 10,
    paddingVertical: 19,
    alignItems: "center",
    marginTop: 10,
    // paddingHorizontal: 16,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  loginText: {
    textAlign: "center",
    marginTop: 15,
    fontSize: 14,
    color: "#9B0E10",
  },
  loginLink: {
    fontWeight: "bold",
    color: "#666",
  },
});
