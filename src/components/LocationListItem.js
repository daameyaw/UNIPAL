import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { moderateScale } from "react-native-size-matters";

const LocationListItem = ({ iconName, title, description, onPress, style }) => {
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      style={[styles.wrapper, style]}
    >
      <ImageBackground
        source={require("../../assets/images/card1.png")}
        resizeMode="cover"
        style={styles.bg}
        imageStyle={styles.bgImage}
      >
        <View style={styles.leftSection}>
          <View style={styles.leftIconWrap}>
            <Ionicons
              name={iconName}
              size={24}
              color="#9B0E10"
              style={styles.leftIcon}
            />
          </View>
          <View style={styles.textBlock}>
            <Text style={styles.title}>{title}</Text>
            <View style={styles.descriptionBox}>
              {description ? (
                <Text numberOfLines={3} style={styles.descriptionText}>
                  {description}
                </Text>
              ) : null}
            </View>
          </View>
        </View>
        <Ionicons name="arrow-forward" size={20} color="#9B0E10" />
      </ImageBackground>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    alignSelf: "center",
    width: "95%",
    borderRadius: 12,
    overflow: "hidden",
  },
  bg: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: moderateScale(22, 0.8),
    paddingHorizontal: 16,
    backgroundColor: "#dedede",
  },
  leftIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
    backgroundColor: "#fff0f0",
  },

  bgImage: {
    borderRadius: 12,
  },
  leftSection: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  // leftIcon: {
  //   marginRight: 10,
  // },
  textBlock: {
    flex: 1,
  },
  title: {
    fontSize: moderateScale(14, 0.7),
    color: "#121212",
    fontWeight: "700",
    letterSpacing: 0.2,
  },
  descriptionBox: {
    marginTop: 4,
    minHeight: 28,
    // backgroundColor: "#ffffff",
    borderRadius: 6,
    width: "85%",
    justifyContent: "center",
    paddingHorizontal: 0,
  },
  descriptionText: {
    color: "#555555",
    fontSize: moderateScale(10, 0.6),
    marginLeft: 0,
    lineHeight: 18,
  },
});

export default LocationListItem;
