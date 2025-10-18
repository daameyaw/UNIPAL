import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Platform,
  StatusBar,
  ActivityIndicator,
  FlatList,
} from "react-native";
import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import ScreenHeader from "../components/ScreenHeader";
import { moderateScale } from "react-native-size-matters";
import { useGuides } from "../hooks/useGuides";

const articles = [
  {
    id: "how-admissions-work",
    title: "How Admissions Work",
    description:
      "Get the full picture when forms are released, deadlines, and how the whole process flows from application to admission letter.",
    icon: "school-outline",
  },
  {
    id: "buying-application-forms",
    title: "Buying Application Forms",
    description:
      "Step-by-step on where to buy forms, how to get your eVoucher, and avoid getting scammed. Whether you're applying to KNUST, UG, or UCC — we got you.",
    icon: "card-outline",
  },
  {
    id: "choosing-programme",
    title: "Choosing the Right Programme",
    description:
      "Get the full picture when forms are released, deadlines, and how the whole process flows from application to admission letter.",
    icon: "library-outline",
  },
  {
    id: "choosing-programme-2",
    title: "Choosing the Right Programme",
    description:
      "Get the full picture when forms are released, deadlines, and how the whole process flows from application to admission letter.",
    icon: "library-outline",
  },
  {
    id: "choosing-programme-3",
    title: "Choosing the Right Programme",
    description:
      "Get the full picture when forms are released, deadlines, and how the whole process flows from application to admission letter.",
    icon: "library-outline",
  },
];

const ArticlesScreen = ({ route, navigation }) => {
  const { code, title } = route.params || {};
  const { isLoading, data: guides, error } = useGuides(code);
  // console.log("ArticlesScreen - Guides data:", guides);

  // Instead of:
  // console.log(guides);

  // Use:
  // console.log(JSON.stringify(guides, null, 2));

  return (
    <SafeAreaView style={styles.background} edges={["top", "left", "right"]}>
      <ScreenHeader title={title} />
      {isLoading ? (
        <View style={styles.center}>
          <ActivityIndicator color="#9B0E10" />
        </View>
      ) : error ? (
        <View style={styles.center}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : (
        <FlatList
          data={guides}
          keyExtractor={(item) => item.title}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => {
                // console.log("Single - Item data:", item),
                navigation.navigate("Article", {
                  guide: item,
                })
              }}
              activeOpacity={0.9}
              style={styles.card}
            >
              <View style={styles.cardRow}>
                <View style={styles.leftIconWrap}>
                  <Ionicons name={item.icon} size={22} color="#9B0E10" />
                </View>
                <View style={styles.textWrap}>
                  <Text style={styles.cardTitle}>{item.title}</Text>
                  <Text style={styles.cardSubtitle}>{item.subtitle}</Text>
                </View>
                <Ionicons name="arrow-forward" size={20} color="#9B0E10" />
              </View>
            </TouchableOpacity>
          )}
          ListEmptyComponent={() => (
            <View style={styles.center}>
              <Text style={styles.emptyText}>
                No guides found for this category yet.
              </Text>
            </View>
          )}
        />
      )}
    </SafeAreaView>
  );
};

export default ArticlesScreen;

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingVertical: 24,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    marginBottom: 24,
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  cardRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: moderateScale(15, 0.8),
    paddingHorizontal: 16,
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
    fontSize: 18,
    fontWeight: "700",
    letterSpacing: 0.2,
    marginBottom: 6,
  },
  cardSubtitle: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
    letterSpacing: 0.1,
    width: "95%",
    fontStyle: "italic",
  },
});
