import React from "react";
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

const ContactSupportScreen = () => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <BackButton />
          <Text style={styles.headerText}>Contact Support</Text>
          <View style={{ width: 24 }} />
        </View>

        {/* Add your contact support content here */}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f8f8f8",
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
