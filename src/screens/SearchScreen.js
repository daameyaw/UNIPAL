import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import React, { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import ScreenHeader from "../components/ScreenHeader";
import { moderateScale } from "react-native-size-matters";
import { SafeAreaView } from "react-native-safe-area-context";

const SearchScreen = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  // Mock search results - replace with actual search logic
  const mockResults = [
    {
      id: "1",
      title: "How to Apply for Admission",
      category: "Admissions",
      description: "Complete guide to university admission process",
    },
    {
      id: "2",
      title: "Course Registration Guide",
      category: "Academics",
      description: "Step-by-step course registration instructions",
    },
    {
      id: "3",
      title: "Campus Map Navigation",
      category: "Navigation",
      description: "Find your way around campus buildings",
    },
    {
      id: "4",
      title: "Student Support Services",
      category: "Support",
      description: "Mental health and academic support resources",
    },
    {
      id: "5",
      title: "Campus Events Calendar",
      category: "Life",
      description: "Upcoming events and activities on campus",
    },
  ];

  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query.trim() === "") {
      setSearchResults([]);
      return;
    }

    // Simple search logic - replace with actual search implementation
    const filtered = mockResults.filter(
      (item) =>
        item.title.toLowerCase().includes(query.toLowerCase()) ||
        item.category.toLowerCase().includes(query.toLowerCase()) ||
        item.description.toLowerCase().includes(query.toLowerCase())
    );
    setSearchResults(filtered);
  };

  const renderSearchResult = ({ item }) => (
    <TouchableOpacity
      style={styles.resultItem}
      onPress={() => {
        // Navigate to article or handle result selection
        console.log("Selected:", item.title);
      }}
    >
      <View style={styles.resultContent}>
        <Text style={styles.resultTitle}>{item.title}</Text>
        <Text style={styles.resultCategory}>{item.category}</Text>
        <Text style={styles.resultDescription}>{item.description}</Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color="#9B0E10" />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <KeyboardAvoidingView
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
      >
        <ScreenHeader title="Search Guides" />

        <View style={styles.searchContainer}>
          <View style={styles.searchInputContainer}>
            <Ionicons
              name="search-outline"
              size={20}
              color="#666"
              style={styles.searchIcon}
            />
            <TextInput
              style={styles.searchInput}
              placeholder="Search guides..."
              value={searchQuery}
              onChangeText={handleSearch}
              autoFocus={true}
              returnKeyType="search"
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity
                onPress={() => {
                  setSearchQuery("");
                  setSearchResults([]);
                }}
                style={styles.clearButton}
              >
                <Ionicons name="close-circle" size={20} color="#666" />
              </TouchableOpacity>
            )}
          </View>
        </View>

        <View style={styles.resultsContainer}>
          {searchQuery.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons name="search-outline" size={48} color="#ccc" />
              <Text style={styles.emptyStateText}>Search for guides</Text>
              <Text style={styles.emptyStateSubtext}>
                Find admission info, academic guides, campus navigation, and
                more
              </Text>
            </View>
          ) : searchResults.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons name="search-outline" size={48} color="#ccc" />
              <Text style={styles.emptyStateText}>No results found</Text>
              <Text style={styles.emptyStateSubtext}>
                Try different keywords or check your spelling
              </Text>
            </View>
          ) : (
            <FlatList
              data={searchResults}
              renderItem={renderSearchResult}
              keyExtractor={(item) => item.id}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.resultsList}
            />
          )}
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default SearchScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  searchContainer: {
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  searchInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: "#333",
  },
  clearButton: {
    marginLeft: 8,
  },
  resultsContainer: {
    flex: 1,
    paddingHorizontal: 24,
  },
  resultsList: {
    paddingBottom: 20,
  },
  resultItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
    borderWidth: 1,
    borderColor: "#f0f0f0",
  },
  resultContent: {
    flex: 1,
  },
  resultTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
  },
  resultCategory: {
    fontSize: 12,
    color: "#9B0E10",
    fontWeight: "500",
    marginBottom: 6,
  },
  resultDescription: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    lineHeight: 20,
  },
});
