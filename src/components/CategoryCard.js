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

const CategoryCard = ({ icon, label, onPress, style }) => (
  <TouchableOpacity style={style} onPress={onPress} activeOpacity={0.8}>
    <ImageBackground
      source={require("../../assets/images/card1.png")}
      resizeMode="cover"
      style={styles.card}
      imageStyle={{ borderRadius: moderateScale(15) }}
    >
      <View style={styles.column}>
        <View style={styles.iconContainer}>
          <Ionicons name={icon} size={30} color="#9B0E10" />
        </View>
        <Text style={styles.label}>{label}</Text>
      </View>
    </ImageBackground>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  card: {
    width: moderateScale(152, 0.9),
    height: moderateVerticalScale(125, 0.8),
    backgroundColor: "#f0dcdc",
    borderRadius: moderateScale(15),
    marginBottom: moderateVerticalScale(12),
    justifyContent: "center",
    alignItems: "flex-start",
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: moderateScale(6),
    elevation: 1.5,
    padding: moderateScale(10),
  },
  column: {
    alignItems: "flex-start",
    paddingVertical: moderateVerticalScale(10),
    justifyContent: "space-around",
    flex: 1,
    width: "100%",
  },
  iconContainer: {
    marginBottom: moderateVerticalScale(8),
    alignSelf: "flex-start",
  },
  label: {
    color: "#9B0E10",
    fontWeight: "bold",
    fontSize: moderateScale(14),
    textAlign: "left",
    marginTop: 0,
    flexShrink: 1,
    maxWidth: moderateScale(85),
    marginLeft: 2,
  },
});

export default CategoryCard;
