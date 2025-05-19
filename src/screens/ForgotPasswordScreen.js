import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Image,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
  StatusBar,
} from "react-native";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../../firebase"; // Adjust path if needed
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import BackButton from "../components/BackButton";
import {
  moderateScale,
  moderateVerticalScale,
} from "react-native-size-matters";

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false); // New loading stat
  const navigation = useNavigation();

  // Email validation regex
  /**
   * The function `validateEmail` uses a regular expression to check if a given email address is valid.
   * @param email - The `validateEmail` function takes an email address as a parameter and uses a regular
   * expression to check if the email address is in a valid format. The regular expression
   * `/^[^\s@]+@[^\s@]+\.[^\s@]+$/` ensures that the email address has the following format
   * @returns The `validateEmail` function is returning a boolean value indicating whether the `email`
   * parameter passed to it is a valid email address according to the regular expression defined in the
   * function.
   */
  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email.toLowerCase());
  };

  const isEmailValid = validateEmail(email);

  const handlePasswordReset = async () => {
    if (!email) {
      Alert.alert("Error", "Please enter your email address.");
      return;
    }
    if (!isEmailValid) {
      Alert.alert("Error", "Please enter a valid email address.");
      return;
    }
    setLoading(true); // Start loading
    try {
      await sendPasswordResetEmail(auth, email);
      setMessage("Reset email sent! Check your inbox.");
      Alert.alert("Success", "Reset email sent! Please check your inbox.");
    } catch (error) {
      console.error(error);
      if (error.code === "auth/user-not-found") {
        Alert.alert("Error", "No user found with this email.");
      } else if (error.code === "auth/invalid-email") {
        Alert.alert("Error", "Invalid email address.");
      } else {
        Alert.alert("Error", error.message);
      }
    } finally {
      setLoading(false); // Stop loading
      navigation.navigate("Login");
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar />
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={[styles.backButton]}
        >
          <Ionicons name="chevron-back" size={20} color="#9B0E10" />
        </TouchableOpacity>

        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.Viewcontainer}>
            <View style={styles.titleContainer}>
              <Text style={styles.header}>Forget Password</Text>
              <Text style={styles.subText}>
                Enter your email account to reset your UniPAL account password
              </Text>
            </View>

            <Image
              source={require("../../assets/forgot.png")}
              style={styles.image}
              resizeMode="contain"
            />

            <TextInput
              style={styles.input}
              placeholder="Enter your email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />

            <TouchableOpacity
              style={[
                styles.button,
                (!isEmailValid || loading) && styles.buttonDisabled,
              ]}
              onPress={handlePasswordReset}
              disabled={!isEmailValid || loading} // Disable when invalid or loading
            >
              {loading ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Text style={styles.buttonText}>Reset</Text>
              )}
            </TouchableOpacity>
            {message !== "" && <Text style={styles.success}>{message}</Text>}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
// Replace with the actual import path for your scaling functions

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
    // paddingTop: moderateVerticalScale(120),
  },
  Viewcontainer: {
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    flexDirection: "column",
    gap: moderateVerticalScale(30),
    // backgroundColor: "green",
  },
  titleContainer: {
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    gap: moderateVerticalScale(10),
    // marginBottom: moderateVerticalScale(20),
  },

  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollContainer: {
    flexGrow: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: moderateScale(20),
    paddingVertical: moderateVerticalScale(10),
  },
  backButton: {
    position: "absolute",
    top:
      Platform.OS === "ios"
        ? moderateVerticalScale(20)
        : moderateVerticalScale(10),
    left: moderateScale(20),
    zIndex: 20,
    padding: moderateScale(10),
    backgroundColor: "rgba(0,0,0,0.2)",
    borderRadius: moderateScale(12),
  },

  header: {
    fontSize: moderateScale(20),
    color: "#8B0000",
    fontWeight: "bold",
    // marginBottom: moderateVerticalScale(10),
  },
  subText: {
    fontSize: moderateScale(14),
    color: "#333",
    textAlign: "center",
    paddingHorizontal: moderateScale(10),
    // marginBottom: moderateVerticalScale(20),
  },
  image: {
    width: moderateScale(250),
    height: moderateVerticalScale(300),
    // marginBottom: moderateVerticalScale(20),
  },
  input: {
    width: "90%",
    borderColor: "#9B0E10",
    borderWidth: 1,
    borderRadius: moderateScale(10),
    padding: moderateScale(12),
    // paddingHorizontal: moderateScale(24),
    // marginBottom: moderateVerticalScale(20),
  },
  button: {
    backgroundColor: "#8B0000",
    paddingVertical: moderateVerticalScale(12),
    paddingHorizontal: moderateScale(32),
    borderRadius: moderateScale(12),
    width: "90%",
    alignItems: "center",
    marginTop: moderateVerticalScale(25),
    shadowColor: "#000",
    shadowOffset: { width: 0, height: moderateVerticalScale(2) },
    shadowOpacity: 0.15,
    shadowRadius: moderateScale(4),
    elevation: 2,
  },
  buttonText: {
    color: "#fff",
    fontSize: moderateScale(16),
    fontWeight: "600",
  },
  success: {
    color: "green",
    marginTop: moderateVerticalScale(20),
    textAlign: "center",
  },
  buttonDisabled: {
    backgroundColor: "#aaa",
  },
});
