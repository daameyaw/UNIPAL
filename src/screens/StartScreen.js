import React from "react";
import {
  StyleSheet,
  Text,
  View,
  ImageBackground,
  TouchableOpacity,
} from "react-native";
import { scale, verticalScale, moderateScale } from "react-native-size-matters";

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
            <View style={styles.mainText}>
              <Text style={styles.headerText}>One App</Text>
              <Text style={styles.headerText}> Every Answer</Text>
            </View>

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
  mainText: {
    // No direct size, so leave as is for now
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.18)",
    paddingHorizontal: scale(32),
    paddingVertical: verticalScale(60),
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
  topHalf: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
  bottomHalf: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    gap: verticalScale(20),
  },
  appName: {
    fontSize: moderateScale(50),
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
    fontFamily: "Roboto-Bold",
  },
  tagline: {
    fontSize: moderateScale(30),
    color: "#B6D8F5",
    fontWeight: "400",
    textAlign: "center",
  },
  textContainer: {
    flexDirection: "column",
    gap: verticalScale(20),
  },
  headerText: {
    fontSize: moderateScale(24),
    color: "#fff",
    fontWeight: "700",
    lineHeight: verticalScale(32),
    textAlign: "center",
    fontFamily: "Roboto-Bold",
  },
  subText: {
    color: "#fff",
    fontSize: moderateScale(16),
    lineHeight: verticalScale(22),
    textAlign: "center",
    fontWeight: "400",
  },
  getStartedButton: {
    backgroundColor: "#C80D10",
    paddingVertical: verticalScale(12),

    borderRadius: moderateScale(12),
    alignItems: "center",
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
    fontSize: moderateScale(20),
    fontWeight: "bold",
    letterSpacing: scale(0.5),
    fontFamily: "Roboto-Bold",
  },
  signInText: {
    color: "#ccc",
    textAlign: "center",
    fontSize: moderateScale(14),
    marginTop: verticalScale(0),
  },
  signInLink: {
    color: "#fff",
    fontWeight: "bold",
    fontFamily: "Roboto-Bold",
  },
});
