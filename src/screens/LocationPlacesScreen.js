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

const LocationPlacesScreen = ({ route }) => {
  const { code, title } = route.params || {};
  const [loading, setLoading] = useState(true);
  const [places, setPlaces] = useState([]);
  const [error, setError] = useState(null);

  //   useEffect(() => {
  //     const fetchPlaces = async () => {
  //       try {
  //         // Firestore: collection "locations" with field "code" equal to route code
  //         const q = query(collection(db, "locations"), where("code", "==", code));
  //         const snapshot = await getDocs(q);
  //         const rows = snapshot.docs.map((doc) => ({
  //           id: doc.id,
  //           ...doc.data(),
  //         }));
  //         setPlaces(rows);
  //       } catch (e) {
  //         setError(e?.message || "Failed to load locations");
  //       } finally {
  //         setLoading(false);
  //       }
  //     };
  //     fetchPlaces();
  //   }, [code]);
  const locations = [
    {
      id: "1",
      category: "Medical Center",
      name: "KNUST Medical Center",
      description:
        "Primary health center for students and staff. Offers general medical consultations and emergency care.",
      //   image: "https://placehold.co/600x400?text=Medical+Center",
      hours: "Mon–Sat, 8AM–6PM",
      latitude: 6.675076,
      longitude: -1.5729718,
    },


    {
      id: "2",
      category: "Library",
      name: "Prempeh II Library",
      description:
        "Main university library with study rooms, journals, and Wi-Fi access.",
      //   image: "https://placehold.co/600x400?text=Library",
      hours: "Mon–Fri, 8AM–10PM",
      latitude: 6.6782,
      longitude: -1.569,
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScreenHeader title={title || "Places"} />
      {/* {loading ? (
        <View style={styles.center}>
          <ActivityIndicator color="#9B0E10" />
        </View>
      ) : error ? (
        <View style={styles.center}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : ( */}
      <FlatList
        data={locations}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 16, gap: 16 }}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Image
              source={
                item.image
                  ? { uri: item.image }
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
      {/* )} */}
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
    // width: "90%",
  },
  banner: {
    width: "100%",
    height: 200,
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
  },
  placeDesc: {
    color: "#777",
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
  directionsText: { fontWeight: "600", color: "#121212" },
  arrowIcon: { fontSize: 18, color: "#9B0E10" },
  hoursPill: {
    alignSelf: "flex-start",
    backgroundColor: "#f3f3f3",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 14,
    marginBottom: 8,
  },
  hoursText: { color: "#555", fontSize: 12, fontWeight: "600" },
});

// open maps for directions if lat/lng exists, otherwise try a query string
function openDirections(item) {
  const lat = item?.latitude ?? item?.lat;
  const lng = item?.longitude ?? item?.lng;
  const query = encodeURIComponent(item?.name || "Destination");
  let url;
  if (typeof lat === "number" && typeof lng === "number") {
    url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
  } else {
    url = `https://www.google.com/maps/search/?api=1&query=${query}`;
  }
  Linking.openURL(url).catch(() => {});
}
