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
    subtitle: "Everything you need to know before stepping on campus!",
    icon: "school-outline",
  },
  {
    id: "programs",
    title: "PROGRAMS",
    subtitle:
      "Explore entry requirements, cut-off points, and programs under each college.",
    icon: "leaf-outline",
  },
  {
    id: "academics",
    title: "ACADEMICS",
    subtitle: "Study smarter, ace your courses, and make learning easier.",
    icon: "book-outline",
  },
  {
    id: "navigation",
    title: "CAMPUS NAVIGATION",
    subtitle: "Find your way around campus like a true insider.",
    icon: "map-outline",
  },
  {
    id: "support",
    title: "SUPPORT SERVICES",
    subtitle: "Get the help you need—mental health, finance, or academics.",
    icon: "help-buoy-outline",
  },
  {
    id: "life",
    title: "CAMPUS LIFE",
    subtitle:
      "Discover events, hangouts, and tips for living your best campus life!",
    icon: "happy-outline",
  },
];

const ExploreScreen = ({ navigation }) => {
  // const handleCategoryPress = (categoryId) => {
  //   if (categoryId === "admissions") {
  //     navigation.navigate("Articles", {
  //       code :
  //     };
  //   }
  //   // Add navigation for other categories as needed
  // };

  return (
    <SafeAreaView style={styles.background} edges={["top", "left", "right"]}>
      <ScreenHeader title="Guides" />
      <View style={styles.searchContainer}>
        <TouchableOpacity
          style={styles.searchButton}
          activeOpacity={0.7}
          onPress={() => navigation.navigate("Search")}
        >
          <Ionicons name="search-outline" size={20} color="#666" />
          <Text style={styles.searchText}>Search guides...</Text>
        </TouchableOpacity>
      </View>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {categories.map((c) => (
          <TouchableOpacity
            key={c.id}
            activeOpacity={0.9}
            style={styles.card}
            onPress={() =>
              navigation.navigate("Articles", { code: c.id, title: c.title })
            } // Navigate to Articles screen with category
          >
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
  searchContainer: {
    marginTop: 10,
    paddingHorizontal: 24,
    paddingBottom: 16,
  },
  searchButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  searchText: {
    marginLeft: 12,
    fontSize: 16,
    color: "#666",
    flex: 1,
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
    paddingVertical: moderateScale(25, 0.8), // Move padding here
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
