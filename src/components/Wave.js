import * as React from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import { Feather } from "@expo/vector-icons";
// import { MotiView } from "@motify/components";
import { Easing } from "react-native-reanimated";
import { MotiView } from "moti";

const _color = "#9B0E10";
const _size = 100;

export default function Wave() {
  return (
    <View style={styles.container}>
      <View style={[styles.dot, styles.center]}>
        {[...Array(2).keys()].map((index) => (
          <MotiView
            from={{ opacity: 0.4, scale: 1 }}
            animate={{ opacity: 0, scale: 4 }}
            transition={{
              type: "timing",
              duration: 3000,
              easing: Easing.out(Easing.ease),
              delay: index * 400,
              repeatReverse: false,
              loop: true,
            }}
            key={index}
            style={[StyleSheet.absoluteFillObject, styles.dot]}
          />
        ))}
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
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  dot: {
    width: _size,
    height: _size,
    borderRadius: _size / 2, // Correct way to make a circle
    backgroundColor: _color,
  },
  center: {
    alignItems: "center",
    justifyContent: "center",
  },
  logoContainer: {
    width: _size,
    height: _size,
    borderRadius: _size / 2, // Correct way to make a circle
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
    fontSize: 34,
    color: "#000",
    fontWeight: "300",
    marginTop: 30,
    textAlign: "center",
  },
  appNameBold: {
    fontWeight: "bold",
  },
});
