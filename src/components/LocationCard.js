import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import {
  moderateScale,
  moderateVerticalScale,
} from "react-native-size-matters";

const LocationCard = ({ icon, label, onPress, style, children }) => (
  <TouchableOpacity style={style} onPress={onPress} activeOpacity={0.8}>
    <ImageBackground
      source={require("../../assets/images/card1.png")}
      resizeMode="cover"
      style={styles.card}
      imageStyle={{ borderRadius: moderateScale(12) }}
    >
      <View style={styles.column}>
        <View style={styles.iconContainer}>
          <Ionicons name={icon} size={26} color="#9B0E10" />
        </View>
        <Text style={styles.label}>{label}</Text>
        {children}
      </View>
    </ImageBackground>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  card: {
    width: moderateScale(105),
    height: moderateScale(91),
    backgroundColor: "#f0dcdc",
    borderRadius: moderateScale(12),
    marginRight: moderateScale(10),
    justifyContent: "center",
    alignItems: "flex-start",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: moderateScale(2),
    elevation: 1,
    padding: moderateScale(8),
  },
  column: {
    alignItems: "flex-start",
    justifyContent: "space-around",
    flex: 1,
    width: "100%",
  },
  iconContainer: {
    marginBottom: moderateVerticalScale(4),
    alignSelf: "flex-start",
  },
  label: {
    color: "#9B0E10",
    fontWeight: "bold",
    fontSize: moderateScale(13),
    textAlign: "left",
    maxWidth: moderateScale(70,0.3),
    flexShrink: 1,
    marginLeft: 2,
  },
});

export default LocationCard;
