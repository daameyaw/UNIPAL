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
import StepIndicator from "react-native-step-indicator";

const labels = ["Start Date", "End Date"];
const customStyles = {
  stepIndicatorSize: 15,
  currentStepIndicatorSize: 15,
  separatorStrokeWidth: 2,
  currentStepStrokeWidth: 3,
  stepStrokeWidth: 3,
  stepStrokeCurrentColor: "#9B0E10",
  stepStrokeFinishedColor: "#9B0E10",
  stepStrokeUnFinishedColor: "#9B0E10",
  separatorFinishedColor: "#9B0E10",
  separatorUnFinishedColor: "#9B0E10",
  stepIndicatorFinishedColor: "#9B0E10",
  stepIndicatorUnFinishedColor: "#9B0E10",
  stepIndicatorCurrentColor: "#9B0E10",
  stepIndicatorLabelFontSize: 13,
  currentStepIndicatorLabelFontSize: 13,
  stepIndicatorLabelCurrentColor: "#9B0E10",
  stepIndicatorLabelFinishedColor: "#9B0E10",
  stepIndicatorLabelUnFinishedColor: "#9B0E10",
  labelColor: "#000",
  labelSize: 16,
  currentStepLabelColor: "#000",
  stepIndicatorVerticalPadding: 30, // Only works in some versions!
};

const CourseRegistrationCard = ({ title, subTitle, startDate, endDate }) => (
  <ImageBackground
    source={require("../../assets/images/card1.png")}
    resizeMode="cover"
    style={[styles.cardContainer, { width: "100%" }]}
    imageStyle={{ borderRadius: moderateScale(20) }}
  >
    <View style={styles.contentWrapper}>
      <View style={styles.headerRow}>
        <Ionicons
          name="school-outline"
          size={28}
          color="#a52828"
          style={styles.icon}
        />
        <Text style={styles.title}>{title}</Text>
      </View>
      <Text style={styles.subtitle}>{subTitle}</Text>
      <StepIndicator
        direction="vertical"
        customStyles={customStyles}
        currentPosition={1}
        stepCount={2}
        labels={[`Start Date: ${startDate}`, `End Date: ${endDate}`]}
      />
      <TouchableOpacity>
        <Text style={styles.readMore}>Read More</Text>
      </TouchableOpacity>
    </View>
  </ImageBackground>
);

const styles = StyleSheet.create({
  cardContainer: {
    // backgroundColor: "",
    borderRadius: moderateScale(20),
    // paddingVertical: moderateScale(10),
    margin: moderateScale(16),
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 5,
    height: moderateVerticalScale(230, 0.2),
    // width: "50%",
    alignSelf: "center",
  },
  contentWrapper: {
    padding: moderateScale(20),
    flex: 1,
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
    fontSize: moderateScale(22),
    fontWeight: "700",
    color: "#222",
  },
  subtitle: {
    fontSize: moderateScale(15),
    color: "#222",
    fontWeight: "400",
    marginBottom: moderateScale(0),
    marginLeft: moderateScale(30), // aligns with text after icon
  },
  timelineContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginVertical: moderateScale(10),
    marginBottom: moderateScale(4),
  },
  timeline: {
    alignItems: "center",
    marginRight: moderateScale(12),
    marginTop: moderateScale(2),
  },
  dot: {
    width: moderateScale(12),
    height: moderateScale(12),
    borderRadius: 6,
    backgroundColor: "#a52828",
    marginVertical: moderateScale(2),
  },
  line: {
    width: 2,
    height: moderateScale(50),
    backgroundColor: "#a52828",
  },
  dates: {
    flex: 1,
    justifyContent: "space-between",
    height: moderateScale(84),
  },
  dateLabel: {
    fontSize: moderateScale(15),
    color: "#222",
    fontWeight: "500",
  },
  dateText: {
    fontWeight: "400",
    color: "#222",
  },
  readMore: {
    color: "#a52828",
    fontWeight: "500",
    fontSize: moderateScale(16),
    marginTop: moderateScale(10),
  },
});

export default CourseRegistrationCard;
