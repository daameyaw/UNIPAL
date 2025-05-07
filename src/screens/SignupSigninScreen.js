import { AntDesign } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";

const SignupSigninScreen = () => {
  const navigation = useNavigation();
  const handleSignup = () => {
    navigation.navigate("SignUpScreen");
    // Handle signup logic here
    console.log("Signup pressed");
  };

  const handleLogin = () => {
    navigation.navigate("LoginScreen");

    // Navigate to login screen or perform login action
    console.log("Login pressed");
  };

  const handleGoogleSignup = () => {
    // Handle Google signup here
    console.log("Google signup pressed");
  };

  return (
    <View style={styles.container}>
      {/* Placeholder for Logo/Image */}
      <View style={styles.logoPlaceholder}></View>

      {/* Description Text */}
      <Text style={styles.descriptionText}>Enter your gmail to sign up</Text>

      {/* Sign Up Button */}
      <TouchableOpacity style={styles.signupButton} onPress={handleSignup}>
        <Text style={styles.signupButtonText}>Sign up</Text>
      </TouchableOpacity>

      {/* Login Section */}
      <View style={styles.loginRow}>
        <Text style={styles.loginPrompt}>I already have an account? </Text>
        <TouchableOpacity onPress={handleLogin}>
          <Text style={styles.loginButton}>Login</Text>
        </TouchableOpacity>
      </View>

      {/* Divider with "Or sign up with" */}
      <View style={styles.dividerContainer}>
        <View style={styles.line} />
        <Text style={styles.dividerText}>Or sign up with</Text>
        <View style={styles.line} />
      </View>

      {/* Google Button/Icon */}
      <TouchableOpacity onPress={handleGoogleSignup}>
        <View className="p-3 bg-primary-200 rounded-full">
          <AntDesign name="google" size={24} color="#FF9D9E" />
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default SignupSigninScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 30,
    paddingTop: 0,
    alignItems: "center",
    justifyContent: "center",
  },
  logoPlaceholder: {
    width: 200,
    height: 100,
    backgroundColor: "#ddd",
    marginBottom: 300,
  },
  descriptionText: {
    fontSize: 18,
    color: "#000",
    marginBottom: 20,
  },
  signupButton: {
    backgroundColor: "#8B0000", // Deep red
    paddingVertical: 15,
    paddingHorizontal: 90,
    borderRadius: 30,
    marginBottom: 25,
  },
  signupButtonText: {
    color: "#fff",
    fontSize: 16,
  },
  loginRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 25,
  },
  loginPrompt: {
    color: "#333",
    fontSize: 14,
  },
  loginButton: {
    color: "#8B0000",
    fontSize: 16,
    fontStyle: "italic",
    // textDecorationLine: "underline",
  },
  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: "#888",
  },
  dividerText: {
    marginHorizontal: 10,
    color: "#555",
  },
  googleIcon: {
    width: 40,
    height: 40,
    resizeMode: "contain",
  },
});
