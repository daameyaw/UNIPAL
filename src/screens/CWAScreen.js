import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ImageBackground,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

const quickActions = [
  {
    id: "semester-calculator",
    label: "SEMESTER CALCULATOR",
    icon: "hourglass-outline",
  },
  {
    id: "goal-scenarios",
    label: "GOALS & SCENARIOS",
    icon: "stats-chart-outline",
  },
];

const cwaTips = [
  "Focus more on high-credit courses — they influence your CWA the most.",
  "Track each semester so dips never catch you off guard.",
  "Use scenarios to know the scores you need before assessments arrive.",
];

const guideCards = [
  {
    id: "calc",
    title: "Calculation of CWA",
    subtitle:
      "Get the full picture — when forms are released, deadlines, more.",
    icon: "document-text-outline",
  },
];

export default function CWAScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.heroWrapper}>
          <ImageBackground
            source={require("../../assets/images/card1.png")}
            style={styles.heroCard}
            imageStyle={styles.heroImage}
            resizeMode="cover"
          >
            <View style={styles.heroIcon}>
              <Ionicons name="calculator-outline" size={24} color="#9B0E10" />
            </View>
            <Text style={styles.heroTitle}>CWA Calculator</Text>
            <Text style={styles.heroBody}>No CWA yet - let&apos;s start</Text>
            <TouchableOpacity style={styles.heroButton}>
              <Text style={styles.heroButtonText}>
                Calculate My First Semester
              </Text>
              <Ionicons name="arrow-forward" size={18} color="#9B0E10" />
            </TouchableOpacity>
          </ImageBackground>
        </View>

        <View style={styles.quickActionsContainer}>
          {quickActions.map((action) => (
            <TouchableOpacity
              key={action.id}
              style={styles.quickActionCard}
              onPress={() => navigation.navigate("SemCalc")}
            >
              <Ionicons name={action.icon} size={22} color="#9B0E10" />
              <Text style={styles.quickActionLabel}>{action.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Tips for Boosting Your CWA</Text>
          {cwaTips.map((tip, index) => (
            <View key={tip} style={styles.tipCard}>
              <View style={styles.tipIcon}>
                <Ionicons name="flag-outline" size={18} color="#9B0E10" />
              </View>
              <Text style={styles.tipText}>{tip}</Text>
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>CWA Guides</Text>
          {guideCards.map((guide) => (
            <TouchableOpacity key={guide.id} style={styles.guideCard}>
              <View style={styles.guideTextBlock}>
                <Text style={styles.guideTitle}>{guide.title}</Text>
                <Text style={styles.guideSubtitle}>{guide.subtitle}</Text>
              </View>
              <Ionicons name="arrow-forward" size={20} color="#9B0E10" />
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  scrollContent: {
    paddingVertical: 24,
    paddingHorizontal: 20,
    gap: 24,
  },
  heroWrapper: {
    shadowColor: "#9B0E10",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 20,
    elevation: 12,
    borderRadius: 24,
    overflow: "hidden",
  },
  heroCard: {
    borderRadius: 24,
    padding: 24,
  },
  heroImage: {
    borderRadius: 24,
  },
  heroIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 18,
  },
  heroTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#2D0A0A",
  },
  heroBody: {
    fontSize: 15,
    color: "#4F3C3C",
    marginTop: 6,
    marginBottom: 20,
  },
  heroButton: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    gap: 8,
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 999,
    backgroundColor: "#FFFFFF",
  },
  heroButtonText: {
    color: "#9B0E10",
    fontWeight: "600",
  },
  quickActionsContainer: {
    flexDirection: "row",
    gap: 16,
  },
  quickActionCard: {
    flex: 1,
    paddingVertical: 20,
    paddingHorizontal: 14,
    backgroundColor: "#FFF8F8",
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  quickActionLabel: {
    fontSize: 12,
    textAlign: "center",
    color: "#4F3C3C",
    fontWeight: "600",
  },
  section: {
    gap: 14,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#2D0A0A",
  },
  tipCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },
  tipIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#FFF1F1",
    alignItems: "center",
    justifyContent: "center",
  },
  tipText: {
    flex: 1,
    color: "#4F3C3C",
    fontSize: 14,
    lineHeight: 20,
  },
  guideCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 18,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    gap: 12,
  },
  guideTextBlock: {
    flex: 1,
    gap: 6,
  },
  guideTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#2D0A0A",
  },
  guideSubtitle: {
    fontSize: 13,
    color: "#5C4A4A",
    lineHeight: 18,
  },
});
