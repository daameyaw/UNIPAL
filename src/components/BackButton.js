import React from "react";
import { TouchableOpacity, StyleSheet, Platform } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import {
  moderateScale,
  moderateVerticalScale,
} from "react-native-size-matters";

const BackButton = ({ style, color = "#9B0E10" }) => {
  const navigation = useNavigation();

  return (
    <TouchableOpacity
      onPress={() => navigation.goBack()}
      style={[styles.backButton, style]}
    >
      <Ionicons name="chevron-back" size={20} color={color} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  backButton: {
    position: "absolute",
    top:
      Platform.OS === "ios"
        ? moderateVerticalScale(50)
        : moderateVerticalScale(30),
    left: moderateScale(20),
    zIndex: 20, // Ensure it's on top of everything
    padding: moderateScale(10),
    backgroundColor: "rgba(0,0,0,0.2)",
    borderRadius: moderateScale(12),
  },
});

export default BackButton;
