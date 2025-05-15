import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import React, { useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
  Platform,
  ImageBackground,
  ScrollView,
  KeyboardAvoidingView,
  ActivityIndicator,
  Alert,
} from "react-native";
import { app, auth, db } from "../../firebase";
import {
  createUserWithEmailAndPassword,
  updateProfile,
  getAuth,
} from "firebase/auth";
import { doc, setDoc, getFirestore } from "firebase/firestore";
import { AuthContext } from "../../Store/AuthContext";
import { Picker } from "@react-native-picker/picker";
import { LinearGradient } from "expo-linear-gradient";

const { height } = Dimensions.get("window");

const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export default function SignUp() {
  const authCtx = useContext(AuthContext);
  const route = useRoute();

  const [fullName, setFullName] = useState("dav");
  const [email, setEmail] = useState("davidameyaw607@gmail.com");
  const [emailError, setEmailError] = useState("");
  const [password, setPassword] = useState("Lhegacy");
  const [confirmPassword, setConfirmPassword] = useState("Lhegacy");
  const [passwordError, setPasswordError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [selectedLevel, setSelectedLevel] = useState("");
  const [selectedUniversity, setSelectedUniversity] = useState("");
  const [selectedCollege, setSelectedCollege] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isFormValid, setIsFormValid] = useState(false);
  const auth = getAuth();

  const navigation = useNavigation();

  useEffect(() => {
    // For applying students, college is optional
    const collegeIsValid =
      selectedUniversity === "Applying" || !!selectedCollege;

    const valid =
      fullName.trim() !== "" &&
      email.trim() !== "" &&
      password.trim() !== "" &&
      confirmPassword.trim() !== "" &&
      password === confirmPassword &&
      validateEmail(email) &&
      !emailError &&
      !passwordError &&
      !!selectedLevel &&
      !!selectedUniversity &&
      collegeIsValid;

    setIsFormValid(valid);
  }, [
    fullName,
    email,
    password,
    confirmPassword,
    emailError,
    passwordError,
    selectedLevel,
    selectedUniversity,
    selectedCollege,
  ]);
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
    if (confirmPassword && text !== confirmPassword) {
      setPasswordError("Passwords do not match");
    } else {
      setPasswordError("");
    }
  };

  const handleConfirmPasswordChange = (text) => {
    setConfirmPassword(text);
    if (password && text !== password) {
      setPasswordError("Passwords do not match");
    } else {
      setPasswordError("");
    }
  };

  const handleContinue = () => {
    if (!validateEmail(email)) {
      setEmailError("Please enter a valid email address");
      return;
    }
    navigation.navigate("CompleteSignUpScreen", {
      fullName,
      email,
      password,
      confirmPassword,
    });
  };

  const universities = {
    Applying: {
      colleges: ["Select after admission"],
    },
    KNUST: {
      colleges: [
        "College of Agriculture and Natural Resources",
        "College of Art and Built Environment (CABE)",
        "College of Engineering",
        "College of Health Sciences",
        "College of Humanities and Social Sciences",
        "College of Science",
      ],
    },
    UG: {
      colleges: [
        "College of Basic and Applied Sciences",
        "College of Education",
        "College of Health Sciences",
        "College of Humanities",
        "College of Agriculture and Consumer Sciences",
      ],
    },
    UCC: {
      colleges: [
        "College of Agriculture and Natural Sciences",
        "College of Education Studies",
        "College of Humanities and Legal Studies",
        "College of Health and Allied Sciences",
      ],
    },
  };

  const handleUniversityChange = (university) => {
    setSelectedUniversity(university);
    setSelectedCollege(""); // Reset college when university changes
  };

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
  const handleSubmit = async () => {
    if (isFormValid) {
      // For applying students, college is optional
      if (selectedUniversity === "Applying" || selectedCollege) {
        try {
          setLoading(true);
          setError("");

          // Create user with email and password
          const userCredential = await withTimeout(
            createUserWithEmailAndPassword(auth, email, password)
          );

          const token = await userCredential.user.getIdToken();
          console.log(token);

          authCtx.authenticate(token);

          // Update user profile with display name
          await updateProfile(userCredential.user, {
            displayName: fullName,
          });

          // Create user document in Firestore
          const userDoc = {
            fullName,
            email,
            level: selectedLevel,
            university: selectedUniversity,
            college: selectedCollege,
            createdAt: new Date().toISOString(),
          };
          console.log(userDoc);

          try {
            await setDoc(doc(db, "users", userCredential.user.uid), userDoc);
            console.log("User doc written");
          } catch (firestoreError) {
            console.error("Firestore error:", firestoreError);
          }

          // Navigate to home screen or wherever appropriate
          Alert.alert("Success", "Your account has been created successfully!");
          // navigation.navigate("Home");
        } catch (error) {
          setError(error.message);
          console.error(error.code);
          if (error.code === "auth/email-already-in-use") {
            Alert.alert(
              "Account Exists",
              "An account with this email already exists. Would you like to log in instead?",
              [
                { text: "Cancel", style: "cancel" },
                {
                  text: "Log In",
                  onPress: () => navigation.navigate("LoginScreen"),
                },
              ]
            );
            setError(
              "An account with this email already exists. Please try logging in."
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

          console.error("Error during sign up:", error.code);
        } finally {
          setLoading(false);
        }
      } else {
        setError("Please select a college.");
      }
    } else {
      setError("Please fill in all required fields.");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardAvoidingView}
      >
        <ScrollView contentContainerStyle={styles.scroll}>
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

              <TouchableOpacity
                onPress={() => navigation.goBack()}
                style={styles.backButton}
              >
                <Ionicons name="chevron-back" size={28} color="white" />
              </TouchableOpacity>

              {/* Bottom Sheet */}
              <View style={styles.bottomSheet}>
                <Text style={styles.title}>Sign up</Text>
                <Text style={styles.description}>
                  Complete the registration with the required information. By
                  registering, you can enroll in the course of your choice.
                </Text>
                <TextInput
                  style={styles.input}
                  placeholder="Full Name"
                  placeholderTextColor="#777"
                  value={fullName}
                  onChangeText={setFullName}
                />
                <TextInput
                  style={[styles.input, emailError ? styles.inputError : null]}
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
                      color="gray"
                    />
                  </TouchableOpacity>
                </View>

                <View
                  style={[
                    styles.passwordContainer,
                    passwordError ? styles.inputError : null,
                  ]}
                >
                  <TextInput
                    style={styles.passwordInput}
                    placeholder="Confirm your password"
                    value={confirmPassword}
                    onChangeText={handleConfirmPasswordChange}
                    secureTextEntry={!showConfirmPassword}
                  />
                  <TouchableOpacity
                    onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    <Ionicons
                      name={showConfirmPassword ? "eye" : "eye-off"}
                      size={24}
                      color="gray"
                    />
                  </TouchableOpacity>
                </View>
                {passwordError ? (
                  <Text style={styles.errorText}>{passwordError}</Text>
                ) : null}
                <View style={styles.pickerWrapper}>
                  <Picker
                    selectedValue={selectedLevel}
                    onValueChange={(itemValue) => setSelectedLevel(itemValue)}
                  >
                    <Picker.Item
                      label="Select level..."
                      value=""
                      enable={false}
                    />
                    <Picker.Item label="Applying" value="Applying" />
                    {["100", "200", "300", "400", "500", "600"].map((level) => (
                      <Picker.Item
                        key={level}
                        label={`Level ${level}`}
                        value={level}
                      />
                    ))}
                  </Picker>
                </View>
                <View style={styles.pickerWrapper}>
                  <Picker
                    selectedValue={selectedUniversity}
                    onValueChange={handleUniversityChange}
                  >
                    <Picker.Item
                      label="Select university..."
                      value=""
                      enabled={false}
                    />
                    {Object.keys(universities).map((university) => (
                      <Picker.Item
                        key={university}
                        label={university}
                        value={university}
                      />
                    ))}
                  </Picker>
                </View>
                <View style={styles.pickerWrapper}>
                  <Picker
                    selectedValue={selectedCollege}
                    onValueChange={(itemValue) => setSelectedCollege(itemValue)}
                    enabled={!!selectedUniversity}
                  >
                    <Picker.Item label="Select college..." value="" />
                    {selectedUniversity &&
                      universities[selectedUniversity].colleges.map(
                        (college, index) => (
                          <Picker.Item
                            key={index}
                            label={college}
                            value={college}
                          />
                        )
                      )}
                  </Picker>
                </View>
                <TouchableOpacity
                  onPress={handleSubmit}
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
                        ? ["#FF3437", "#ED1518"]
                        : ["#cccccc", "#aaaaaa"]
                    }
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.button}
                  >
                    {loading ? (
                      <ActivityIndicator color="#fff" />
                    ) : (
                      <Text style={styles.buttonText}>Create account</Text>
                    )}
                  </LinearGradient>
                </TouchableOpacity>
                <Text
                  onPress={() => navigation.navigate("Login")}
                  style={styles.loginText}
                >
                  Log In{" "}
                  <Text style={styles.loginLink}>if you have an account.</Text>
                </Text>
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
  buttonDisabledWrapper: {
    opacity: 0.6, // Makes the gradient appear dim when loading
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
    top: Platform.OS === "ios" ? 50 : 40,
    left: 20,
    zIndex: 20, // Ensure it's on top of everything
    padding: 12,
    backgroundColor: "rgba(0,0,0,0.2)",
    borderRadius: 20,
  },
  logo: {
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
    height: height * 0.7,
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
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
    color: "#222",
  },
  description: {
    textAlign: "center",
    color: "#666",
    fontSize: 16,
    marginBottom: 20,
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
    color: "#C80D10",
  },
  loginLink: {
    fontWeight: "bold",
    color: "#666",
  },
});
