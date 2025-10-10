import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Platform,
  StatusBar,
  ImageBackground,
} from "react-native";
import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import ScreenHeader from "../components/ScreenHeader";
import { moderateScale } from "react-native-size-matters";

const categories = [
  {
    id: "admissions",
    title: "ADMISSIONS",
    subtitle: "XXXXXXXXXXXXXXXX",
    icon: "school-outline",
  },
  {
    id: "academics",
    title: "ACADEMICS",
    subtitle: "XXXXXXXXXXXXXXXX",
    icon: "book-outline",
  },
  {
    id: "navigation",
    title: "CAMPUS NAVIGATION",
    subtitle: "XXXXXXXXXXXXXXXX",
    icon: "map-outline",
  },
  {
    id: "support",
    title: "SUPPORT SERVICES",
    subtitle: "XXXXXXXXXXXXXXXX",
    icon: "help-buoy-outline",
  },
  {
    id: "life",
    title: "CAMPUS LIFE",
    subtitle: "XXXXXXXXXXXXXXXX",
    icon: "happy-outline",
  },
];

const ExploreScreen = () => {
  return (
    <SafeAreaView style={styles.background} edges={["top", "left", "right"]}>
      <ScreenHeader title="Guides" />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {categories.map((c) => (
          <TouchableOpacity key={c.id} activeOpacity={0.9} style={styles.card}>
            <ImageBackground
              source={require("../../assets/images/card1.png")}
              resizeMode="cover"
              style={styles.cardBg}
              imageStyle={{ borderRadius: 16 }}
            >
              <View style={styles.cardRow}>
                <View style={styles.leftIconWrap}>
                  <Ionicons name={c.icon} size={22} color="#9B0E10" />
                </View>
                <View style={styles.textWrap}>
                  <Text style={styles.cardTitle}>{c.title}</Text>
                  <Text style={styles.cardSubtitle}>{c.subtitle}</Text>
                </View>
                <Ionicons name="arrow-forward" size={20} color="#9B0E10" />
              </View>
            </ImageBackground>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

export default ExploreScreen;

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingVertical: 24,
  },
  card: {
    borderRadius: 16,
    marginBottom: 30,
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
    overflow: "hidden",
  },
  cardBg: {
    width: "100%",
    // height: "100%", // Add this
    // minHeight: 120, // Add minimum height
  },
  cardRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: moderateScale(25,0.8), // Move padding here
    paddingHorizontal: 16, // Move padding here
  },
  leftIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
    backgroundColor: "#fff0f0",
  },
  textWrap: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 0.2,
  },
  cardSubtitle: {
    marginTop: 10,
    color: "#333",
    opacity: 0.8,
  },
});
