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
import React, { useCallback, useEffect, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import ScreenHeader from "../components/ScreenHeader";
import { moderateScale } from "react-native-size-matters";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAllGuides } from "../hooks/useAllGuides";

const SearchScreen = ({ navigation }) => {
  const { isLoading, data: guides, error } = useAllGuides();
  console.log("SearchScreen - Guides data:", guides);

  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);


  // Memoize the search function to prevent recreation on every render
  const handleSearch = useCallback(
    (query) => {
      const searchTerm = query.trim().toLowerCase();

      // 🧹 Clear results if query is empty
      if (searchTerm.length === 0) {
        setSearchResults([]);
        return;
      }

      // 🛑 If the query is shorter than 4 characters, do nothing
      if (searchTerm.length < 3) {
        return;
      }

      const filtered =
        guides?.filter((guide) => {
          // 1️⃣ Basic top-level fields
          const matchesBasic =
            guide.title.toLowerCase().includes(searchTerm) ||
            guide.category.toLowerCase().includes(searchTerm) ||
            guide.description?.toLowerCase().includes(searchTerm);

          // Early return if basic match found (skip expensive JSON.stringify)
          if (matchesBasic) return true;

          // 2️⃣ Deep content search — only if basic search didn't match
          const contentText = JSON.stringify(guide.content || {}).toLowerCase();
          return contentText.includes(searchTerm);
        }) || [];

      setSearchResults(filtered);
    },
    [guides]
  ); // Only recreate if guides changes

  // Debounce logic
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      handleSearch(searchQuery);
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [searchQuery, handleSearch]); // Add handleSearch to dependencies

  const renderSearchResult = ({ item }) => {
    return (
      <TouchableOpacity
        onPress={() => {
          console.log(item._id);
          navigation.push("Article", { id: item._id });
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
    );
  };

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
              onChangeText={setSearchQuery}
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
              keyExtractor={(item) => item._id}
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
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  searchInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 4,
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
