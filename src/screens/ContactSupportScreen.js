import React, { useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Platform,
  StatusBar,
} from "react-native";
import {
  moderateScale,
  moderateVerticalScale,
} from "react-native-size-matters";
import BackButton from "../components/BackButton";
import { ThemeContext } from "../context/ThemeContext";

const ContactSupportScreen = () => {
  const { theme } = useContext(ThemeContext);

  return (
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor: theme.background }]}
    >
      <View style={[styles.header, { backgroundColor: theme.primary }]}>
        <BackButton color="#fff" />
        <Text style={[styles.headerText, { color: "#fff" }]}>
          Contact Support
        </Text>
        <View style={{ width: 24 }} />
      </View>
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        {/* Add your contact support content here */}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  container: {
    flex: 1,
    paddingHorizontal: moderateScale(16),
    paddingVertical: moderateVerticalScale(20),
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: moderateVerticalScale(24),
  },
  headerText: {
    fontSize: moderateScale(20),
    fontWeight: "700",
  },
});

export default ContactSupportScreen;
