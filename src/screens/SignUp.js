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
  Keyboard,
} from "react-native";
import {
  moderateScale,
  moderateVerticalScale,
} from "react-native-size-matters";
import { useDispatch, useSelector } from "react-redux";
import {
  setFullName,
  setLevel,
  setUniversity,
  setSelectedCollege,
  setUserInfo,
  selectUser,
} from "../store/features/userSlice";

import { app, auth, db } from "../../firebase";
import {
  createUserWithEmailAndPassword,
  updateProfile,
  getAuth,
} from "firebase/auth";
import { doc, setDoc, getFirestore, getDoc } from "firebase/firestore";
import { AuthContext } from "../../Store/AuthContext";
import { Picker } from "@react-native-picker/picker";
import { LinearGradient } from "expo-linear-gradient";
import BackButton from "../components/BackButton";
import AsyncStorage from "@react-native-async-storage/async-storage";

const { height } = Dimensions.get("window");

const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export default function SignUp() {
  const authCtx = useContext(AuthContext);
  const route = useRoute();
  const dispatch = useDispatch();
  const userState = useSelector(selectUser);

  const [fullName, setFullName] = useState("dav");
  const [email, setEmail] = useState("davidameyaw607@gmail.com");
  const [emailError, setEmailError] = useState("");
  const [password, setPassword] = useState("Lhegacy");
  const [confirmPassword, setConfirmPassword] = useState("Lhegacy");
  const [passwordError, setPasswordError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [selectedLevel, setSelectedLevel] = useState("");
  const [selectedUniversity, setSelectedUniversity] = useState(null);
  const [selectedCollege, setSelectedCollege] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isFormValid, setIsFormValid] = useState(false);
  const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);

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
      colleges: [{ label: "Select after admission", value: "SAA" }],
    },
    KNUST: {
      colleges: [
        {
          label: "College of Agriculture and Natural Resources",
          value: "CANR",
        },
        { label: "College of Art and Built Environment (CABE)", value: "CABE" },
        { label: "College of Engineering", value: "COE" },
        { label: "College of Health Sciences", value: "CHS" },
        { label: "College of Humanities and Social Sciences", value: "CHSS" },
        { label: "College of Science", value: "COS" },
      ],
    },
    UG: {
      colleges: [
        { label: "College of Basic and Applied Sciences", value: "CBAS" },
        { label: "College of Education", value: "COE" },
        { label: "College of Health Sciences", value: "CHS" },
        { label: "College of Humanities", value: "CHUM" },
        {
          label: "College of Agriculture and Consumer Sciences",
          value: "CACS",
        },
      ],
    },
    UCC: {
      colleges: [
        { label: "College of Agriculture and Natural Sciences", value: "CANS" },
        { label: "College of Education Studies", value: "COES" },
        { label: "College of Humanities and Legal Studies", value: "CHLS" },
        { label: "College of Health and Allied Sciences", value: "CHAS" },
      ],
    },
  };

  const handleUniversityChange = (university) => {
    setSelectedUniversity(university);
    setSelectedCollege(""); // Reset college when university changes
  };

  useEffect(() => {
    // For iOS devices
    const keyboardDidShowListener = Keyboard.addListener(
      Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow",
      () => {
        setIsKeyboardOpen(true);
      }
    );

    // For Android devices
    const keyboardDidHideListener = Keyboard.addListener(
      Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide",
      () => {
        setIsKeyboardOpen(false);
      }
    );

    // Clean up listeners when component unmounts
    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  // Now you can use the isKeyboardOpen state variable anywhere in your component
  console.log("Is keyboard open?", isKeyboardOpen);

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
      if (selectedUniversity === "Applying" || selectedCollege) {
        try {
          setLoading(true);
          setErrorMessage("");

          // Create user with email and password
          const userCredential = await withTimeout(
            createUserWithEmailAndPassword(auth, email, password)
          );

          const token = await userCredential.user.getIdToken();

          // Create user document in Firestore
          const userDoc = {
            fullName: fullName,
            email,
            level: selectedLevel,
            university: {
              label: selectedUniversity.label,
              value: selectedUniversity.value,
            },
            college: {
              label: selectedCollege.label,
              value: selectedCollege.value,
            },
            createdAt: new Date().toISOString(),
          };

          try {
            // Step 1: Write user doc to Firestore
            await setDoc(doc(db, "users", userCredential.user.uid), userDoc);
            console.log("✅ User document written to Firestore.");

            // Step 2: Fetch the created document to verify
            const userRef = doc(db, "users", userCredential.user.uid);
            const userSnap = await getDoc(userRef);

            if (!userSnap.exists()) {
              throw new Error("User document does not exist after creation");
            }

            const userData = userSnap.data();
            console.log("✅ User data fetched from Firestore:", userData);

            // Step 3: Store in Redux and AsyncStorage
            const userDataToStore = {
              fullName: userData.fullName,
              level: userData.level,
              university: userData.university.value,
              selectedCollege: userData.college.value,
            };

            // Store in AsyncStorage
            await AsyncStorage.setItem("user", JSON.stringify(userDataToStore));
            console.log(
              "✅ User data stored in AsyncStorage:",
              userDataToStore
            );

            // Store in Redux
            dispatch(setUserInfo(userDataToStore));
            console.log("✅ User data dispatched to Redux");
            console.log("📦 Current Redux Store State:", userState);

            // Navigate to home screen after successful signup
            // navigation.navigate("Home");
          } catch (firestoreError) {
            console.error("Firestore error:", firestoreError);
            throw firestoreError; // Re-throw to be caught by outer catch
          }
          authCtx.authenticate(token);
        } catch (error) {
          setErrorMessage(error.message);
          console.error("Error during sign up:", error.code);

          if (error.code === "auth/email-already-in-use") {
            Alert.alert(
              "Account Exists",
              "An account with this email already exists. Would you like to log in instead?",
              [
                { text: "Cancel", style: "cancel" },
                {
                  text: "Log In",
                  onPress: () => navigation.navigate("Login"),
                },
              ]
            );
            setErrorMessage(
              "An account with this email already exists. Please try logging in."
            );
          } else if (error.code === "auth/network-request-failed") {
            Alert.alert(
              "Network Error",
              "Unable to complete the signup process due to a network issue. Please check your internet connection and try again.",
              [{ text: "OK" }]
            );
            setErrorMessage(
              "Network request failed. Please ensure you're connected to the internet."
            );
          } else if (error.message === "timeout-error") {
            Alert.alert(
              "Timeout",
              "The signup process is taking too long. Please check your connection and try again.",
              [{ text: "OK" }]
            );
            setErrorMessage("Signup timed out. Please try again.");
          }
        } finally {
          setLoading(false);
        }
      } else {
        setErrorMessage("Please select a college.");
      }
    } else {
      setErrorMessage("Please fill in all required fields.");
    }
  };

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
                <Text
                  style={[styles.logo, { opacity: isKeyboardOpen ? 0.3 : 1 }]}
                >
                  UNIPAL
                </Text>
              </View>

              <BackButton color="white" />
              {/* Bottom Sheet */}
              <View style={styles.bottomSheet}>
                <ScrollView
                  showsVerticalScrollIndicator={false}
                  contentContainerStyle={{ paddingBottom: 20 }}
                >
                  <Text style={styles.title}>Sign up</Text>
                  <Text style={styles.description}>
                    Complete the registration with the required information.
                  </Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Full Name"
                    placeholderTextColor="#777"
                    value={fullName}
                    onChangeText={setFullName}
                  />
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
                      onPress={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                    >
                      <Ionicons
                        name={showConfirmPassword ? "eye" : "eye-off"}
                        size={24}
                        color="#9B0E10"
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
                      {["100", "200", "300", "400", "500", "600"].map(
                        (level) => (
                          <Picker.Item
                            key={level}
                            label={`Level ${level}`}
                            value={level}
                          />
                        )
                      )}
                    </Picker>
                  </View>
                  <View style={styles.pickerWrapper}>
                    <Picker
                      selectedValue={selectedUniversity?.value || ""}
                      onValueChange={(itemValue) => {
                        const label = itemValue; // because university keys are used as both value and label
                        setSelectedUniversity({ label, value: itemValue });
                        setSelectedCollege(null); // Reset college when university changes
                      }}
                    >
                      <Picker.Item
                        label="Select university..."
                        value=""
                        enabled={false}
                      />
                      {Object.keys(universities).map((universityKey) => (
                        <Picker.Item
                          key={universityKey}
                          label={universityKey}
                          value={universityKey}
                        />
                      ))}
                    </Picker>
                  </View>
                  {/* //COLLEGE PICKER */}
                  <View style={styles.pickerWrapper}>
                    <Picker
                      selectedValue={selectedCollege?.value || ""}
                      onValueChange={(itemValue) => {
                        const college = universities[
                          selectedUniversity?.value
                        ]?.colleges.find((c) => c.value === itemValue);
                        if (college) setSelectedCollege(college);
                      }}
                      enabled={!!selectedUniversity}
                    >
                      <Picker.Item
                        label="Select college..."
                        value=""
                        enabled={false}
                      />
                      {selectedUniversity &&
                        universities[selectedUniversity?.value].colleges?.map(
                          (college) => (
                            <Picker.Item
                              key={college.value}
                              label={college.label}
                              value={college.value}
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
                        <Text style={styles.buttonText}>Create account</Text>
                      )}
                    </LinearGradient>
                  </TouchableOpacity>
                  <Text
                    onPress={() => navigation.navigate("Login")}
                    style={styles.loginText}
                  >
                    Log In{" "}
                    <Text style={styles.loginLink}>
                      if you have an account.
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
    // paddingBottom: 20,
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
    position: "absolute",
    bottom: 0,
    width: "100%",
    height: height * 0.7,
    backgroundColor: "#fff",
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    paddingHorizontal: 30,
    paddingTop: 20,
    // marginTop: 40,

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
    color: "#9B0E10",
  },
  loginLink: {
    fontWeight: "bold",
    color: "#666",
  },
});
