import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import { collection, query, where, getDocs, orderBy, deleteDoc, doc } from "firebase/firestore";
import { auth, db } from "../../firebase";

export default function SavedScenariosScreen({ navigation }) {
  const [scenarios, setScenarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDeletingScenario, setIsDeletingScenario] = useState(false);

  useEffect(() => {
    loadScenarios();
  }, []);

  const loadScenarios = async () => {
    try {
      const currentUser = auth.currentUser;
      
      if (!currentUser) {
        Alert.alert("Error", "You must be logged in to view saved scenarios.");
        navigation.goBack();
        return;
      }

      // Query scenarios from users/{userId}/cwaScenarios subcollection
      const scenariosRef = collection(db, "users", currentUser.uid, "cwaScenarios");
      const q = query(scenariosRef, orderBy("createdAt", "desc"));
      const querySnapshot = await getDocs(q);

      const scenariosData = [];
      querySnapshot.forEach((doc) => {
        scenariosData.push({
          id: doc.id,
          ...doc.data(),
        });
      });

      setScenarios(scenariosData);
    } catch (error) {
      console.error("Error loading scenarios:", error);
      Alert.alert("Error", "Failed to load saved scenarios.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteScenario = (scenarioId) => {
    Alert.alert(
      "Delete Scenario",
      "Are you sure you want to delete this scenario?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              setIsDeletingScenario(true);
              const currentUser = auth.currentUser;
              if (!currentUser) return;

              await deleteDoc(
                doc(db, "users", currentUser.uid, "cwaScenarios", scenarioId)
              );
              
              // Reload scenarios
              await loadScenarios();
              Alert.alert("Success", "Scenario deleted successfully.");
            } catch (error) {
              console.error("Error deleting scenario:", error);
              Alert.alert("Error", "Failed to delete scenario.");
            } finally {
              setIsDeletingScenario(false);
            }
          },
        },
      ]
    );
  };

  const handleViewScenario = (scenario) => {
    // Navigate to CWAResultsScreen with saved scenario data
    navigation.navigate("CWAResults", {
      savedScenario: scenario,
      isSavedScenario: true,
    });
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return "Unknown date";
    
    // Handle Firestore timestamp
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <StatusBar style="dark" />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#9B0E10" />
          <Text style={styles.loadingText}>Loading scenarios...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="dark" />
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#9B0E10" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Saved Scenarios</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {scenarios.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="document-outline" size={64} color="#C2A9A9" />
            <Text style={styles.emptyTitle}>No Saved Scenarios</Text>
            <Text style={styles.emptyText}>
              Your saved CWA calculation scenarios will appear here.
            </Text>
            <TouchableOpacity
              style={styles.createButton}
              onPress={() => navigation.navigate("SemCalc")}
            >
              <Text style={styles.createButtonText}>Create New Scenario</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            <Text style={styles.sectionTitle}>
              {scenarios.length} Saved Scenario{scenarios.length !== 1 ? "s" : ""}
            </Text>
            {scenarios.map((scenario) => {
              const mockData = scenario.mockData || {};
              const predictedCWA = mockData.predictedCWA || scenario.predictedCWA || 0;
              const currentCWA = mockData.currentCWA || scenario.currentCWA || 0;
              const targetCWA = mockData.targetCWA || scenario.targetCWA || 0;
              const change = mockData.change || (predictedCWA - currentCWA).toFixed(2);
              const isPositive = mockData.isPositive !== undefined 
                ? mockData.isPositive 
                : predictedCWA > currentCWA;

              return (
                <TouchableOpacity
                  key={scenario.id}
                  style={styles.scenarioCard}
                  onPress={() => handleViewScenario(scenario)}
                >
                  <View style={styles.scenarioHeader}>
                    <View style={styles.scenarioInfo}>
                      <Text style={styles.scenarioDate}>
                        {formatDate(scenario.createdAt)}
                      </Text>
                      <View style={styles.cwaRow}>
                        <View style={styles.cwaItem}>
                          <Text style={styles.cwaLabel}>Current</Text>
                          <Text style={styles.cwaValue}>
                            {Number(currentCWA).toFixed(2)}
                          </Text>
                        </View>
                        <View style={styles.cwaItem}>
                          <Text style={styles.cwaLabel}>Predicted</Text>
                          <Text
                            style={[
                              styles.cwaValue,
                              styles.cwaValuePredicted,
                            ]}
                          >
                            {Number(predictedCWA).toFixed(2)}
                          </Text>
                        </View>
                        <View style={styles.cwaItem}>
                          <Text style={styles.cwaLabel}>Target</Text>
                          <Text style={styles.cwaValue}>
                            {Number(targetCWA).toFixed(2)}
                          </Text>
                        </View>
                      </View>
                    </View>
                    <TouchableOpacity
                      style={styles.deleteButton}
                      onPress={() => handleDeleteScenario(scenario.id)}
                    >
                      <Ionicons name="trash-outline" size={20} color="#EF4444" />
                    </TouchableOpacity>
                  </View>

                  <View style={styles.changeRow}>
                    <View
                      style={[
                        styles.changeBadge,
                        isPositive
                          ? styles.changeBadgePositive
                          : styles.changeBadgeNegative,
                      ]}
                    >
                      <Ionicons
                        name={isPositive ? "arrow-up" : "arrow-down"}
                        size={14}
                        color={isPositive ? "#10B981" : "#EF4444"}
                      />
                      <Text
                        style={[
                          styles.changeText,
                          isPositive
                            ? styles.changeTextPositive
                            : styles.changeTextNegative,
                        ]}
                      >
                        {Math.abs(Number(change)).toFixed(2)}
                      </Text>
                    </View>
                    <Text style={styles.courseCount}>
                      {scenario.courses?.length || 0} course
                      {(scenario.courses?.length || 0) !== 1 ? "s" : ""}
                    </Text>
                  </View>

                  <View style={styles.viewButton}>
                    <Text style={styles.viewButtonText}>View Details</Text>
                    <Ionicons name="chevron-forward" size={18} color="#9B0E10" />
                  </View>
                </TouchableOpacity>
              );
            })}
          </>
        )}
      </ScrollView>

      {isDeletingScenario && (
        <View style={styles.deletingOverlay}>
          <ActivityIndicator size="large" color="#9B0E10" />
          <Text style={styles.deletingOverlayText}>Deleting scenario...</Text>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  deletingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 9999,
  },
  deletingOverlayText: {
    marginTop: 12,
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "500",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#F2E6E6",
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#2D0A0A",
  },
  placeholder: {
    width: 32,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingVertical: 24,
    gap: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 12,
  },
  loadingText: {
    fontSize: 14,
    color: "#6B4D4D",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 60,
    gap: 16,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#2D0A0A",
  },
  emptyText: {
    fontSize: 14,
    color: "#6B4D4D",
    textAlign: "center",
    paddingHorizontal: 40,
  },
  createButton: {
    marginTop: 8,
    paddingVertical: 12,
    paddingHorizontal: 24,
    backgroundColor: "#9B0E10",
    borderRadius: 12,
  },
  createButtonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "600",
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#2D0A0A",
    marginBottom: 8,
  },
  scenarioCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 18,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
    gap: 12,
  },
  scenarioHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  scenarioInfo: {
    flex: 1,
    gap: 12,
  },
  scenarioDate: {
    fontSize: 12,
    color: "#8B7A7A",
    fontWeight: "500",
  },
  cwaRow: {
    flexDirection: "row",
    gap: 16,
  },
  cwaItem: {
    gap: 4,
  },
  cwaLabel: {
    fontSize: 11,
    color: "#6B4D4D",
    fontWeight: "500",
  },
  cwaValue: {
    fontSize: 18,
    fontWeight: "700",
    color: "#9B0E10",
  },
  cwaValuePredicted: {
    color: "#3B82F6",
  },
  deleteButton: {
    padding: 8,
  },
  changeRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: "#F2E6E6",
  },
  changeBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  changeBadgePositive: {
    backgroundColor: "#ECFDF5",
  },
  changeBadgeNegative: {
    backgroundColor: "#FEF2F2",
  },
  changeText: {
    fontSize: 13,
    fontWeight: "700",
  },
  changeTextPositive: {
    color: "#10B981",
  },
  changeTextNegative: {
    color: "#EF4444",
  },
  courseCount: {
    fontSize: 12,
    color: "#6B4D4D",
  },
  viewButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: "#F2E6E6",
  },
  viewButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#9B0E10",
  },
});
