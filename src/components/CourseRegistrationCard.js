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
import { useNavigation } from "@react-navigation/native";

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



const CourseRegistrationCard = ({ title, subTitle, startDate, endDate, iconName, linkUrl }) => {
  const navigation = useNavigation();
  // console.log("Link URL:", linkUrl);
  return (
  <ImageBackground
    source={require("../../assets/images/card1.png")}
    resizeMode="cover"
    style={[styles.cardContainer, { width: "100%" }]} 
    imageStyle={{ borderRadius: moderateScale(20) }}
  >
    <View style={styles.contentWrapper}>
      <View style={styles.headerRow}>
        <View style={styles.iconContainer}>
          <Ionicons
            name={iconName}
            size={28}
            color="#a52828"
            style={styles.icon}
          />
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.subtitle}>{subTitle}</Text>
        </View>
      </View>
      <StepIndicator
        direction="vertical"
        customStyles={customStyles}
        currentPosition={1}
        stepCount={2}
        labels={[`Start Date: ${startDate}`, `End Date: ${endDate}`]}
      />
      <TouchableOpacity
        style={styles.readMoreButton}
        onPress={() => {
          // console.log(linkUrl);
          navigation.navigate("Article", { id: linkUrl });
        }}
      >
        <Text style={styles.readMore}>Read More</Text>
        <Ionicons name="chevron-forward" size={20} color="#a52828" />
      </TouchableOpacity>
    </View>
  </ImageBackground>
);
};

const styles = StyleSheet.create({
  cardContainer: {
    borderRadius: moderateScale(20),
    // margin: moderateScale(8),
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 5,
    height: moderateVerticalScale(230, 0.2),
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
  iconContainer: {
    justifyContent: "center",
    marginRight: moderateScale(8),
  },
  icon: {
    // Remove marginTop since we're using flexbox centering
  },
  textContainer: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
  },
  title: {
    fontSize: moderateScale(18),
    fontWeight: "700",
    color: "#222",
    marginBottom: moderateScale(4),
  },
  subtitle: {
    fontSize: moderateScale(15),
    color: "#222",
    fontWeight: "400",
    marginBottom: moderateScale(0),
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
  readMoreButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(165, 40, 40, 0.1)",
    paddingHorizontal: moderateScale(12),
    paddingVertical: moderateScale(6),
    borderRadius: moderateScale(8),
    alignSelf: "flex-start",
    marginTop: moderateScale(10),
  },
  readMore: {
    color: "#a52828",
    fontWeight: "500",
    fontSize: moderateScale(16),
    marginRight: moderateScale(4),
  },
});

export default CourseRegistrationCard;
