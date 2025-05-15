import React from "react";
import {
  StyleSheet,
  Text,
  View,
  ImageBackground,
  TouchableOpacity,
} from "react-native";

export default function WelcomeScreen({ navigation }) {
  return (
    <ImageBackground
      source={require("../../assets/Splash3.png")} // Updated image path
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.overlay}>
        <View style={styles.topHalf}>
          <Text style={styles.appName}>UNIPAL</Text>
          {/* <Text style={styles.tagline}>Academy</Text> */}
        </View>
        <View style={styles.bottomHalf}>
          <View style={styles.textContainer}>
            <Text style={styles.headerText}>One App.</Text>
            <Text style={styles.headerText}> Every Answer</Text>

            <Text style={styles.subText}>
              Find everything you need to thrive at university — academics,
              directions, advice, and updates in one place.
            </Text>
          </View>

          <TouchableOpacity
            style={styles.getStartedButton}
            onPress={() => navigation.navigate("OnBoarding")}
          >
            <Text style={styles.getStartedText}>Get Started</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate("Login")}>
            <Text style={styles.signInText}>
              Already have an account?{" "}
              <Text style={styles.signInLink}>Sign In</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.18)",
    paddingHorizontal: 32,
    paddingVertical: 60,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
  topHalf: {
    flex: 1,
    // backgroundColor: "yellow",

    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
  bottomHalf: {
    flex: 1,
    // backgroundColor: "green",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    paddingBottom: 90,
  },
  appName: {
    fontSize: 70,
    fontWeight: "bold",
    color: "#fff",
    marginTop: 0,
    textAlign: "center",
    fontFamily: "Roboto-Bold",
  },
  tagline: {
    fontSize: 26,
    color: "#B6D8F5",
    marginBottom: 32,
    fontWeight: "400",
    textAlign: "center",
  },
  textContainer: {
    marginVertical: 24,
  },
  headerText: {
    fontSize: 28,
    color: "#fff",
    fontWeight: "700",
    lineHeight: 32,
    textAlign: "center",
    fontFamily: "Roboto-Bold",
  },
  subText: {
    color: "#B6D8F5",
    fontSize: 18,
    marginTop: 18,
    lineHeight: 22,
    textAlign: "center",
    fontWeight: "400",
  },
  getStartedButton: {
    backgroundColor: "#C80D10",
    paddingVertical: 18,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 24,
    width: "80%",
    alignSelf: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 2,
  },
  getStartedText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
    letterSpacing: 0.5,
    fontFamily: "Roboto-Bold",
  },
  signInText: {
    color: "#ccc",
    textAlign: "center",
    fontSize: 15,
    marginTop: 0,
  },
  signInLink: {
    color: "#4B0405",
    fontWeight: "bold",
    fontFamily: "Roboto-Bold",
  },
});
