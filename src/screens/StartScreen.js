import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  StatusBar,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Wave from "../components/Wave";
import { useNavigation } from "@react-navigation/native";

const StartScreen = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f5f5f5" />

      {/* Background Circle with Gradient */}
      {/* <LinearGradient
        colors={["#e0e0e0", "#f5f5f5"]}
        style={styles.backgroundCircle}
        start={{ x: 0.5, y: 0.5 }}
        end={{ x: 0.5, y: 1 }}
      >
        //Logo
        <View style={styles.logoContainer}>
          <View style={styles.logoCircle}>
            <Image
              source={require("../../assets/icon.png")} // Replace with your actual logo path
              style={styles.logo}
              resizeMode="contain"
            />
          </View>
          <Text style={styles.appName}>
            UNI
            <Text style={styles.appNameBold}>PAL</Text>
          </Text>
        </View>
      </LinearGradient> */}
      {/* <Wave /> */}

      {/* Tagline */}
      <View style={styles.textContainer}>
        <Text style={styles.tagline}>
          <Text className="font-heading" style={styles.italicText}></Text>
        </Text>
        <Text style={styles.tagline}>Navigate Uni Like a Pro.</Text>
      </View>

      {/* Button */}
      <TouchableOpacity
        onPress={() => navigation.navigate("OnBoarding")}
        style={styles.button}
      >
        <Text style={styles.buttonText}>Get Started Today</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    alignItems: "center",
    justifyContent: "space-around",
    paddingVertical: 40,
  },
  backgroundCircle: {
    width: 300,
    height: 300,
    borderRadius: 150,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 40,
  },
  logoContainer: {
    alignItems: "center",
  },
  logoCircle: {
    width: 100,
    height: 100,
    backgroundColor: "#ffffff",
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
    elevation: 4, // subtle shadow for Android
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 }, // iOS shadow
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  logo: {
    width: 50,
    height: 50,
  },
  appName: {
    fontSize: 28,
    color: "#000",
    fontWeight: "300",
    marginTop: 10,
  },
  appNameBold: {
    fontWeight: "bold",
  },
  textContainer: {
    marginBottom: 80,
    alignItems: "center",
  },
  tagline: {
    fontSize: 30,
    fontWeight: "400",
    color: "#000",
    textAlign: "center",
  },
  italicText: {
    // fontStyle: "italic",
  },
  button: {
    backgroundColor: "#9B0E10",
    paddingVertical: 25,
    paddingHorizontal: 60,
    borderRadius: 30,
    marginBottom: 60,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default StartScreen;
