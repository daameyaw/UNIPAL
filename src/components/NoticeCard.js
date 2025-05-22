import React from "react";
import { View, Text, StyleSheet, ImageBackground } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import {
  moderateScale,
  moderateVerticalScale,
} from "react-native-size-matters";

const NoticeCard = ({ title = "Notice", message }) => (
  <ImageBackground
    source={require("../../assets/images/card1.png")}
    resizeMode="cover"
    style={[styles.cardContainer, { width: "100%" }]}
    imageStyle={{ borderRadius: moderateScale(20) }}
  >
    <View style={styles.contentWrapper}>
      <View style={styles.headerRow}>
        <MaterialIcons
          name="notifications-active"
          size={28}
          color="#a52828"
          style={styles.icon}
        />
        <Text style={styles.title}>{title}</Text>
      </View>
      <Text style={styles.message}>{message}</Text>
    </View>
  </ImageBackground>
);

const styles = StyleSheet.create({
  cardContainer: {
    borderRadius: moderateScale(20),
    margin: moderateScale(16),
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 5,
    height: moderateVerticalScale(230, 0.2),
    width: "100%",
    alignSelf: "center",
  },
  contentWrapper: {
    padding: moderateScale(20),
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "flex-start",
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: moderateScale(6),
  },
  icon: {
    marginRight: moderateScale(8),
  },
  title: {
    fontSize: moderateScale(18),
    fontWeight: "700",
    color: "#222",
  },
  message: {
    fontSize: moderateScale(15),
    color: "#222",
    fontWeight: "400",
    marginTop: moderateScale(8),
  },
});

export default NoticeCard;
