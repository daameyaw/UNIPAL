import React, { useContext, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  ActivityIndicator,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { AntDesign } from "@expo/vector-icons";
import { useRoute, useNavigation } from "@react-navigation/native";
// import {
//   getAuth,
//   createUserWithEmailAndPassword,
//   updateProfile,
// } from "../../firebase/auth";
// import { getFirestore, doc, setDoc } from "../../firebase/firestore";
import { app, auth, db } from "../../firebase";
import {
  createUserWithEmailAndPassword,
  updateProfile,
  getAuth,
} from "firebase/auth";
import { doc, setDoc, getFirestore } from "firebase/firestore";
import { AuthContext } from "../../Store/AuthContext";
// import { auth } from "../../firebase";

const CompleteSignUpScreen = () => {
  const authCtx = useContext(AuthContext);
  const route = useRoute();
  const navigation = useNavigation();
  const {
    fullName = "",
    email = "",
    password = "",
    confirmPassword = "",
  } = route.params || {};

  const [selectedLevel, setSelectedLevel] = useState("");
  const [selectedUniversity, setSelectedUniversity] = useState("");
  const [selectedCollege, setSelectedCollege] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const auth = getAuth();
  //   const db = getFirestore(app);

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

  const handleSubmit = async () => {
    if (selectedLevel && selectedUniversity) {
      // For applying students, college is optional
      if (selectedUniversity === "Applying" || selectedCollege) {
        try {
          setLoading(true);
          setError("");

          // Create user with email and password
          const userCredential = await createUserWithEmailAndPassword(
            auth,
            email,
            password
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
          // navigation.navigate("Home");
        } catch (error) {
          setError(error.message);
          console.error("Error during sign up:", error);
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
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <AntDesign name="left" size={20} color="#a00" />
        </TouchableOpacity>

        <View style={styles.logoPlaceholder} />

        <View style={styles.formContainer}>
          {error ? <Text style={styles.errorText}>{error}</Text> : null}

          <Text style={styles.label}>Level</Text>
          <View style={styles.pickerWrapper}>
            <Picker
              selectedValue={selectedLevel}
              onValueChange={(itemValue) => setSelectedLevel(itemValue)}
            >
              <Picker.Item label="Select level..." value="" />
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

          <Text style={styles.label}>University</Text>
          <View style={styles.pickerWrapper}>
            <Picker
              selectedValue={selectedUniversity}
              onValueChange={handleUniversityChange}
            >
              <Picker.Item label="Select university..." value="" />
              {Object.keys(universities).map((university) => (
                <Picker.Item
                  key={university}
                  label={university}
                  value={university}
                />
              ))}
            </Picker>
          </View>

          <Text style={styles.label}>College</Text>
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
                    <Picker.Item key={index} label={college} value={college} />
                  )
                )}
            </Picker>
          </View>

          <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={handleSubmit}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Create account</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
  },
  container: {
    flexGrow: 1,
    padding: 20,
    paddingTop: 50,
  },
  backButton: {
    width: 40,
    height: 40,
    backgroundColor: "#f2f2f2",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 20,
    marginBottom: 20,
  },
  logoPlaceholder: {
    width: 160,
    height: 40,
    backgroundColor: "#d3d3d3",
    alignSelf: "center",
    marginBottom: 40,
  },
  formContainer: {
    marginTop: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    marginTop: 20,
    marginBottom: 8,
  },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 20,
    marginBottom: 15,
    overflow: "hidden",
  },
  button: {
    backgroundColor: "#a00",
    paddingVertical: 12,
    borderRadius: 25,
    marginTop: 40,
    alignItems: "center",
  },
  buttonDisabled: {
    backgroundColor: "#ccc",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  errorText: {
    color: "#ff0000",
    textAlign: "center",
    marginBottom: 15,
  },
});

export default CompleteSignUpScreen;
