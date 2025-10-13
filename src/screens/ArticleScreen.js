import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Platform,
  StatusBar,
} from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import ScreenHeader from "../components/ScreenHeader";

const ArticleScreen = ({ route }) => {
  // Extract parameters from navigation
  const { item } = route.params || {};

  // Console log the received parameters
  console.log("ArticleScreen - Received params:", route.params);
  console.log("ArticleScreen - Item data:", item);

  return (
    <SafeAreaView style={styles.background} edges={["top", "left", "right"]}>
      <ScreenHeader title="Article Details" />
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          {item ? (
            <View style={styles.articleContainer}>
              <Text style={styles.title}>Article Information</Text>

              <View style={styles.infoSection}>
                <Text style={styles.label}>Title:</Text>
                <Text style={styles.value}>
                  {item.title || "No title provided"}
                </Text>
              </View>

              <View style={styles.infoSection}>
                <Text style={styles.label}>Description:</Text>
                <Text style={styles.value}>
                  {item.description || "No description provided"}
                </Text>
              </View>

              <View style={styles.infoSection}>
                <Text style={styles.label}>Icon:</Text>
                <Text style={styles.value}>
                  {item.icon || "No icon provided"}
                </Text>
              </View>

              <View style={styles.infoSection}>
                <Text style={styles.label}>ID:</Text>
                <Text style={styles.value}>{item.id || "No ID provided"}</Text>
              </View>

              <View style={styles.rawDataSection}>
                <Text style={styles.rawDataTitle}>Raw Data (JSON):</Text>
                <Text style={styles.rawData}>
                  {JSON.stringify(item, null, 2)}
                </Text>
              </View>
            </View>
          ) : (
            <View style={styles.noDataContainer}>
              <Text style={styles.noDataText}>No article data received</Text>
              <Text style={styles.noDataSubtext}>
                Check the navigation parameters
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ArticleScreen;

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  container: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 24,
    paddingVertical: 24,
  },
  articleContainer: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#9B0E10",
    marginBottom: 20,
    textAlign: "center",
  },
  infoSection: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
  },
  value: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
    backgroundColor: "#f8f8f8",
    padding: 12,
    borderRadius: 8,
    borderLeftWidth: 3,
    borderLeftColor: "#9B0E10",
  },
  rawDataSection: {
    marginTop: 20,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
  },
  rawDataTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },
  rawData: {
    fontSize: 12,
    color: "#666",
    backgroundColor: "#f0f0f0",
    padding: 12,
    borderRadius: 8,
    fontFamily: Platform.OS === "ios" ? "Courier" : "monospace",
  },
  noDataContainer: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 40,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  noDataText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#666",
    marginBottom: 8,
  },
  noDataSubtext: {
    fontSize: 14,
    color: "#999",
    textAlign: "center",
  },
});
