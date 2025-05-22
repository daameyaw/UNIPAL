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
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import {
  moderateScale,
  moderateVerticalScale,
} from "react-native-size-matters";
// import { StatusBar } from "expo-status-bar";

const SettingsScreen = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleDarkMode = () => setIsDarkMode((previousState) => !previousState);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity>
            <Ionicons name="arrow-back" size={24} color="black" />
          </TouchableOpacity>
          <Text style={styles.headerText}>Settings</Text>
          <View style={{ width: 24 }} /> {/* Placeholder for alignment */}
        </View>

        {/* Profile Section */}
        <TouchableOpacity style={styles.profileCard}>
          <Image
            source={{ uri: "https://i.pravatar.cc/100" }}
            style={styles.avatar}
          />
          <View style={styles.profileText}>
            <Text style={styles.name}>Alfred Daniel</Text>
            <Text style={styles.role}>Product/UI Designer</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#ccc" />
        </TouchableOpacity>

        {/* Other Settings */}
        <Text style={styles.sectionTitle}>Other settings</Text>

        <View style={styles.card}>
          <SettingItem icon="person-outline" label="Profile details" />
          <SettingItem icon="lock-closed-outline" label="Password" />
          <SettingItem icon="notifications-outline" label="Notifications" />
          <View style={styles.settingRow}>
            <View style={styles.settingLeft}>
              <Ionicons name="moon-outline" size={22} color="#333" />
              <Text style={styles.settingLabel}>Dark mode</Text>
            </View>
            <Switch
              value={isDarkMode}
              onValueChange={toggleDarkMode}
              thumbColor={isDarkMode ? "#222" : "#f4f3f4"}
              trackColor={{ false: "#ccc", true: "#767577" }}
            />
          </View>
        </View>

        {/* Additional Section */}
        <View style={styles.card}>
          <SettingItem
            icon="information-circle-outline"
            label="About application"
          />
          <SettingItem icon="chatbubble-ellipses-outline" label="Help/FAQ" />
          <SettingItem
            icon="trash-outline"
            label="Deactivate my account"
            labelStyle={{ color: "red" }}
            iconColor="red"
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const SettingItem = ({ icon, label, labelStyle, iconColor = "#333" }) => (
  <TouchableOpacity style={styles.settingRow}>
    <View style={styles.settingLeft}>
      <Ionicons name={icon} size={22} color={iconColor} />
      <Text style={[styles.settingLabel, labelStyle]}>{label}</Text>
    </View>
    <Ionicons name="chevron-forward" size={20} color="#ccc" />
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f8f8f8",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  container: {
    flex: 1,
    backgroundColor: "#f8f8f8",
    paddingHorizontal: moderateScale(16),
    paddingTop: moderateVerticalScale(30),
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
