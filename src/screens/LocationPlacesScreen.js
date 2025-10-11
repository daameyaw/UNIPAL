import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  FlatList,
  Image,
  TouchableOpacity,
  Linking,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../firebase";
import ScreenHeader from "../components/ScreenHeader";
import { useLocations } from "../hooks/useLocations";
import { urlFor } from "../../sanity";
import { moderateScale } from "react-native-size-matters";

const LocationPlacesScreen = ({ route }) => {
  const { code, title } = route.params || {};
  const { isLoading, data: locations, error } = useLocations(code);

  return (
    <SafeAreaView style={styles.container}>
      <ScreenHeader title={title || "Places"} />
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
          data={locations}
          keyExtractor={(item) => item.latitude}
          contentContainerStyle={{ padding: 16, gap: 16 }}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Image
                source={
                  item.image
                    ? { uri: urlFor(item.image).url() }
                    : require("../../assets/images/library.png")
                }
                style={styles.banner}
              />

              <View style={styles.meta}>
                <Text numberOfLines={1} style={styles.placeTitle}>
                  {item.name || "Unnamed"}
                </Text>
                {item.hours ? (
                  <View style={styles.hoursPill}>
                    <Text numberOfLines={1} style={styles.hoursText}>
                      {item.hours}
                    </Text>
                  </View>
                ) : null}
                {item.description ? (
                  <Text numberOfLines={2} style={styles.placeDesc}>
                    {item.description}
                  </Text>
                ) : null}
                {item.additionalInfo ? (
                  <Text numberOfLines={3} style={styles.additionalInfo}>
                    {item.additionalInfo}
                  </Text>
                ) : null}
              </View>

              <View style={styles.footerRow}>
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => openDirections(item)}
                  style={styles.directionsBtn}
                >
                  <Text style={styles.directionsText}>Get Directions</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => openDirections(item)}>
                  <Text style={styles.arrowIcon}>➜</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
          ListEmptyComponent={() => (
            <View style={styles.center}>
              <Text style={styles.emptyText}>
                No places found for this category yet.
              </Text>
            </View>
          )}
        />
      )}
    </SafeAreaView>
  );
};

export default LocationPlacesScreen;

const styles = StyleSheet.create({
  container: { flex: 1 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  errorText: { color: "#9B0E10" },
  emptyText: { color: "#555" },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#eee",
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
    marginBottom : 8,
    // width: "90%",
  },
  banner: {
    width: "100%",
    height: moderateScale(130,0.8),
  },
  meta: {
    paddingHorizontal: 12,
    paddingTop: 10,
    paddingBottom: 12,
  },
  placeTitle: {
    fontWeight: "700",
    color: "#121212",
    marginBottom: 8,
    fontSize: moderateScale(14,0.7),
  },
  placeDesc: {
    color: "#777",
    fontSize: moderateScale(13,0.6),
  },
  additionalInfo: {
    color: "#9B0E10",
    fontSize: moderateScale(11,0.8),
    fontStyle: "italic",
    marginTop: 6,
  },
  footerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
  },
  directionsBtn: {},
  directionsText: { fontWeight: "600", color: "#121212", fontSize: moderateScale(12,0.7) },
  arrowIcon: { fontSize: 18, color: "#9B0E10" },
  hoursPill: {
    alignSelf: "flex-start",
    backgroundColor: "#f3f3f3",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 14,
    marginBottom: 8,
  },
  hoursText: { color: "#555", fontSize: moderateScale(10,0.7), fontWeight: "600" },
});

// open maps for directions if lat/lng exists, otherwise try a query string

function openDirections(item) {
  // Safely extract fields
  const lat = item?.latitude ?? item?.lat;
  const lng = item?.longitude ?? item?.lng;
  const name = item?.name || "Destination";

  // Encode name for use in URL
  const query = encodeURIComponent(name);

  // Build the Google Maps search URL
  let url = `https://www.google.com/maps/search/?api=1&query=${query}`;

  // If coordinates are available, append them to make the search more accurate
  if (typeof lat === "number" && typeof lng === "number") {
    url += `%20(${lat},${lng})`; // e.g., "KNUST Library (6.67,-1.57)"
  }

  // Open Google Maps or browser
  Linking.openURL(url).catch((err) => {
    console.error("Failed to open map:", err);
  });
}