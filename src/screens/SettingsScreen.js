import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  Switch,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Platform,
  StatusBar,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import {
  moderateScale,
  moderateVerticalScale,
} from "react-native-size-matters";
import { useSelector } from "react-redux";
import { selectUser } from "../store/features/userSlice";
import BackButton from "../components/BackButton";
import { useNavigation } from "@react-navigation/native";
import { ThemeContext } from "../context/ThemeContext";
// import { StatusBar } from "expo-status-bar";

const SettingsScreen = () => {
  const userState = useSelector(selectUser);
  const navigation = useNavigation();
  const { theme, toggleTheme } = React.useContext(ThemeContext);

  console.log("User State", userState);

  const isDarkMode = theme.mode === "dark";

  return (
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor: theme.background }]}
    >
      <ScrollView
        style={[styles.container, { backgroundColor: theme.background }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={[styles.header, { backgroundColor: theme.card }]}>
          {/* <BackButton/> */}
          <TouchableOpacity>
            <Ionicons name="arrow-back" size={24} color={theme.primary} />
          </TouchableOpacity>
          <Text style={[styles.headerText, { color: theme.text }]}>
            Settings
          </Text>
          <View style={{ width: 24 }} />
        </View>

        {/* Profile Section */}
        <TouchableOpacity
          style={[styles.profileCard, { backgroundColor: theme.card }]}
        >
          <Image
            source={{ uri: "https://i.pravatar.cc/100" }}
            style={styles.avatar}
          />
          <View style={styles.profileText}>
            <Text style={[styles.name, { color: theme.text }]}>
              Alfred Daniel
            </Text>
            <Text style={[styles.role, { color: theme.text }]}>
              Product/UI Designer
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={theme.primary} />
        </TouchableOpacity>

        {/* Other Settings */}
        <Text style={[styles.sectionTitle, { color: theme.text }]}>
          Other settings
        </Text>

        <View style={[styles.card, { backgroundColor: theme.card }]}>
          <SettingItem
            icon="person-outline"
            label="Profile details"
            screenName="ProfileDetails"
            navigation={navigation}
          />
          <View style={[styles.settingRow, styles.darkModeRow]}>
            <View style={styles.settingLeft}>
              <Ionicons name="moon-outline" size={22} color="#9B0E10" />
              <Text style={styles.settingLabel}>Dark mode</Text>
            </View>
            <Switch
              value={isDarkMode}
              onValueChange={toggleTheme}
              thumbColor={isDarkMode ? "#9B0E10" : "#f4f3f4"}
              trackColor={{ false: "#ccc", true: "#767577" }}
            />
          </View>
          <SettingItem
            icon="gift-outline"
            label="Our Referral System"
            screenName="ReferralSystem"
            navigation={navigation}
          />
        </View>

        {/* Additional Section */}
        <View style={[styles.card, { backgroundColor: theme.card }]}>
          <SettingItem
            icon="help-circle-outline"
            label="Help/FAQ"
            screenName="HelpFAQ"
            navigation={navigation}
          />
          <SettingItem
            icon="warning-outline"
            label="Report a problem"
            screenName="ReportProblem"
            navigation={navigation}
          />
          <SettingItem
            icon="headset-outline"
            label="Contact Support"
            screenName="ContactSupport"
            navigation={navigation}
          />
        </View>

        {/* Contact & Legal Section */}
        <View style={[styles.card, { backgroundColor: theme.card }]}>
          <SettingItem
            icon="information-circle-outline"
            label="About application"
            screenName="AboutApplication"
            navigation={navigation}
          />

          <SettingItem
            icon="star-outline"
            label="Rate the App"
            screenName="RateApp"
            navigation={navigation}
          />
          <SettingItem
            icon="log-out-outline"
            label="Log out"
            labelStyle={{ color: "red" }}
            iconColor="red"
            screenName="Logout"
            navigation={navigation}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const SettingItem = ({
  icon,
  label,
  labelStyle,
  iconColor = "#9B0E10",
  screenName,
  navigation,
}) => {
  const handlePress = () => {
    if (screenName === "Logout") {
      Alert.alert(
        "Logout",
        "Are you sure you want to logout?",
        [
          {
            text: "Cancel",
            style: "cancel",
          },
          {
            text: "Logout",
            style: "destructive",
            onPress: () => {
              // Add your logout logic here
              console.log("User logged out");
            },
          },
        ],
        { cancelable: true }
      );
    } else {
      navigation.navigate(screenName);
    }
  };

  return (
    <TouchableOpacity style={styles.settingRow} onPress={handlePress}>
      <View style={styles.settingLeft}>
        <Ionicons name={icon} size={20} color={iconColor} />
        <Text style={[styles.settingLabel, labelStyle]}>{label}</Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color="#9B0E10" />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f8f8f8",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
    // paddingVertical: moderateVerticalScale(50),
  },
  container: {
    flex: 1,
    backgroundColor: "#f8f8f8",
    paddingHorizontal: moderateScale(16),
    paddingVertical: moderateVerticalScale(20),
    paddingBottom: moderateVerticalScale(30),
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
  profileCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: moderateScale(16),
    borderRadius: moderateScale(12),
    marginBottom: moderateVerticalScale(24),
    elevation: 2,
  },
  avatar: {
    width: moderateScale(48),
    height: moderateScale(48),
    borderRadius: moderateScale(24),
    marginRight: moderateScale(12),
  },
  profileText: {
    flex: 1,
  },
  name: {
    fontWeight: "700",
    fontSize: moderateScale(16),
  },
  role: {
    color: "#777",
    fontSize: moderateScale(13),
  },
  sectionTitle: {
    fontSize: 14,
    color: "#777",
    marginBottom: moderateVerticalScale(8),
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: moderateScale(12),
    marginBottom: moderateVerticalScale(24),
    elevation: 1,
  },
  settingRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: moderateVerticalScale(12),
    paddingHorizontal: moderateScale(14),
    borderBottomColor: "#eee",
    borderBottomWidth: 1,
  },
  darkModeRow: {
    paddingVertical: moderateVerticalScale(4),
  },
  settingLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  settingLabel: {
    marginLeft: moderateScale(12),
    fontSize: moderateScale(15),
    color: "#333",
  },
});
export default SettingsScreen;
