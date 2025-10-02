import { StyleSheet, Text, View, ScrollView } from "react-native";
import React from "react";
import MapView from "react-native-maps";
import LocationListItem from "../components/LocationListItem";
import { SafeAreaView } from "react-native-safe-area-context";
import ScreenHeader from "../components/ScreenHeader";
import { useNavigation } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";

const MapScreen = () => {
  const navigation = useNavigation();
  const items = [
    {
      title: "Shuttle Stops",
      icon: "bus",
      description:
        "Official campus shuttle pick-up and drop-off points with schedules and routes.",
      code: "shuttle_stops",
    },
    {
      title: "School Libraries",
      icon: "library-outline",
      description:
        "Quiet study areas, book borrowing, and access to digital resources across campus.",
      code: "school_libraries",
    },
    {
      title: "Colleges",
      icon: "school-outline",
      description:
        "Academic colleges and faculties, including administration blocks and lecture complexes.",
      code: "colleges",
    },
    {
      title: "Medical Centers",
      icon: "medkit-outline",
      description:
        "On-campus clinics providing first aid, consultations, and emergency health support.",
      code: "medical_centers",
    },
    {
      title: "Biometric Centers",
      icon: "finger-print-outline",
      description:
        "Student ID registration, renewals, and biometric verification service points.",
      code: "biometric_centers",
    },
    {
      title: "Halls of Residences",
      icon: "home-outline",
      description:
        "Student hostels and residential halls with porters' lodges and common rooms.",
      code: "halls_of_residences",
    },
    {
      title: "Food Joints",
      icon: "restaurant-outline",
      description:
        "Cafeterias, canteens, and popular food spots offering meals and snacks all day.",
      code: "food_joints",
    },
    {
      title: "Banks and ATMs",
      icon: "card-outline",
      description:
        "Bank branches, service desks, and ATM locations for quick cash and payments.",
      code: "banks_atms",
    },
    {
      title: "Printing Centers",
      icon: "print-outline",
      description:
        "Document printing, photocopying, and binding services for assignments and reports.",
      code: "printing_centers",
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <ScreenHeader title="Locations" />
      <ScrollView contentContainerStyle={styles.list}>
        {items.map((it) => (
          <LocationListItem
            key={it.title}
            iconName={it.icon}
            title={it.title}
            description={it.description}
            onPress={() =>
              navigation.navigate("LocationPlaces", {
                code: it.code,
                title: it.title,
              })
            }
            style={styles.item}
          />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

export default MapScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  list: {
    padding: 16,
    gap: 14,
  },
  item: {
    marginBottom: 14,
  },
});
