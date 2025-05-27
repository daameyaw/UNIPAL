import React, { useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Platform,
  StatusBar,
  TouchableOpacity,
} from "react-native";
import {
  moderateScale,
  moderateVerticalScale,
} from "react-native-size-matters";
import BackButton from "../components/BackButton";
import { ThemeContext } from "../context/ThemeContext";
import Ionicons from "react-native-vector-icons/Ionicons";

const ProfileDetailsScreen = ({ navigation }) => {
  const { theme } = useContext(ThemeContext);

  return (
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor: theme.background }]}
    >
      <View style={[styles.headerBar, { backgroundColor: theme.primary }]}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Personal Info</Text>
        <View style={{ width: 24 }} />
      </View>
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <View style={styles.sectionTitleRow}>
          <Text style={[styles.sectionTitle, { color: theme.primary }]}>
            Personal Info
          </Text>
          <TouchableOpacity>
            <Ionicons name="pencil" size={22} color={theme.primary} />
          </TouchableOpacity>
        </View>
        <View style={styles.fieldBlock}>
          <Text style={[styles.label, { color: theme.primary }]}>
            First Name
          </Text>
          <View style={[styles.valueBox, { backgroundColor: theme.card }]}>
            <Text style={[styles.valueText, { color: theme.text }]}>
              David Asante
            </Text>
          </View>
        </View>
        <View style={styles.fieldBlock}>
          <Text style={[styles.label, { color: theme.primary }]}>Surname</Text>
          <View style={[styles.valueBox, { backgroundColor: theme.card }]}>
            <Text style={[styles.valueText, { color: theme.text }]}>
              Ameyaw
            </Text>
          </View>
        </View>
        <View style={styles.fieldBlock}>
          <Text style={[styles.label, { color: theme.primary }]}>Email</Text>
          <View style={[styles.valueBox, { backgroundColor: theme.card }]}>
            <Text style={[styles.valueText, { color: theme.text }]}>
              davidameyaw76@gmail.com
            </Text>
          </View>
        </View>
        <View style={styles.fieldBlock}>
          <Text style={[styles.label, { color: theme.primary }]}>Gender</Text>
          <View style={[styles.valueBox, { backgroundColor: theme.card }]}>
            <Text style={[styles.valueText, { color: theme.text }]}>Male</Text>
          </View>
        </View>
        <View style={styles.fieldBlock}>
          <Text style={[styles.label, { color: theme.primary }]}>
            Phone Number
          </Text>
          <View style={[styles.valueBox, { backgroundColor: theme.card }]}>
            <Text style={[styles.valueText, { color: theme.text }]}>
              +233552828309
            </Text>
          </View>
        </View>
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
  headerBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: moderateScale(16),
  },
  headerTitle: {
    fontSize: moderateScale(20),
    fontWeight: "700",
    color: "#fff",
  },
  sectionTitleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: moderateVerticalScale(24),
  },
  sectionTitle: {
    fontSize: moderateScale(20),
    fontWeight: "700",
  },
  fieldBlock: {
    marginBottom: moderateVerticalScale(16),
  },
  label: {
    fontSize: moderateScale(16),
    fontWeight: "700",
  },
  valueBox: {
    padding: moderateScale(12),
    borderRadius: moderateScale(8),
  },
  valueText: {
    fontSize: moderateScale(16),
  },
});

export default ProfileDetailsScreen;
