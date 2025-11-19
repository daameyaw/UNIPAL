import React, { useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ImageBackground,
  FlatList,
  Image,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { Ionicons } from "@expo/vector-icons";
import { getAuth, signOut } from "firebase/auth";
import { app } from "../../firebase";
import { AuthContext } from "../../Store/AuthContext";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  moderateScale,
  moderateVerticalScale,
} from "react-native-size-matters";
import MyCarousel from "../components/MyCarousel";
import { getMotivation } from "../services/apiMotivation";
import { useMotivation } from "../hooks/useMotivation";
import { useSelector } from "react-redux";
import { selectFullName } from "../store/features/userSlice";
import AsyncStorage from "@react-native-async-storage/async-storage";
import LocationCard from "../components/LocationCard";
import CategoryCard from "../components/CategoryCard";
import { useAllGuides } from "../hooks/useAllGuides";
import { useAcademicEvents } from "../hooks/useAcademicEvents";
import { query, queryAll } from "../services/apiGuides";
import { academicEventsQuery } from "../services/apiAcademicEvents";
import client from "../../sanity";

const getGreeting = () => {
  const hour = new Date().getHours();

  if (hour >= 5 && hour < 12) {
    return "Good Morning";
  } else if (hour >= 12 && hour < 17) {
    return "Good Afternoon";
  } else if (hour >= 17 && hour < 21) {
    return "Good Evening";
  } else {
    return "Good Night";
  }
};

const initialCategories = [
  {
    icon: "navigate-outline",
    label: "CAMPUS NAVIGATION",
    id: "navigation",
    title: "CAMPUS NAVIGATION",
  },
  {
    icon: "book-outline",
    label: "ACADEMICS",
    id: "academics",
    title: "ACADEMICS",
  },
  {
    icon: "headset-outline",
    label: "SUPPORT SERVICES",
    id: "support",
    title: "SUPPORT SERVICES",
  },
  {
    icon: "people-circle-outline",
    label: "CAMPUS LIFE",
    id: "life",
    title: "CAMPUS LIFE",
  },
  {
    icon: "school-outline",
    label: "ADMISSIONS",
    id: "admissions",
    title: "ADMISSIONS",
  },
  {
    label: "ARRIVAL & SETTLING-IN",
    icon: "airplane-outline",
    id: "arrival-settling",
    title: "ARRIVAL & SETTLING-IN",
  },
  {
    label: "PROGRAMS",
    icon: "leaf-outline",
    id: "programs",
    title: "PROGRAMS",
  },
];

const locationItems = [
  {
    id: 1,
    icon: "medkit-outline",
    label: "Medical Centers",
    code: "medical_centers",
    title: "Medical Centers",
  },
  {
    id: 2,
    icon: "finger-print-outline",
    label: "Biometric Centers",
    code: "biometric_centers",
    title: "Biometric Centers",
  },
  {
    id: 3,
    icon: "bus-outline",
    label: "Shuttle Stops",
    code: "shuttle_stops",
    title: "Shuttle Stops",
  },
  {
    id: 4,
    icon: "library-outline",
    label: "School libraries",
    code: "school_libraries",
    title: "School Libraries",
  },
  {
    id: 5,
    icon: "school-outline",
    label: "Colleges",
    code: "colleges",
    title: "Colleges",
  },
  {
    id: 6,
    icon: "home-outline",
    label: "Halls of Residence",
    code: "halls_of_residences",
    title: "Halls of Residences",
  },
];

function shuffleArray(array) {
  return array
    .map((value) => ({ value, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ value }) => value);
}

const isEventActive = (event) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const startDate = new Date(event.startDate);
  const endDate = new Date(event.endDate);

  // Define the last day we care about (80 days from now)
  const nextMonth = new Date();
  nextMonth.setDate(nextMonth.getDate() + 80);
  nextMonth.setHours(23, 59, 59, 999);

  const isCurrent = today >= startDate && today <= endDate;

  const isUpcomingWithinMonth = startDate > today && startDate <= nextMonth;

  return isCurrent || isUpcomingWithinMonth;
};

// Function to get dynamic guides based on active events
const getDynamicGuides = async (events, guides) => {
  // Step 1: Filter active events
  // const activeEvents = academicEvents.filter(isEventActive);

  const activeEvents = events.filter(isEventActive) || [];

  // Step 2: If there are active events, find guides linked to them
  if (activeEvents.length > 0) {
    const activeEventIds = activeEvents.map((event) => event._id);

    // Filter guides that are linked to any of the active events
    const eventRelatedGuides = guides.filter((guide) => {
      if (!guide.relatedEvents || guide.relatedEvents.length === 0) {
        return false;
      }

      // Check if guide is linked to any active event
      return guide.relatedEvents.some((eventObj) =>
        activeEventIds.includes(eventObj._id)
      );
    });

    // Sort by rank number (lower = higher priority)
    eventRelatedGuides.sort(
      (a, b) => (a.rankNumber || 999) - (b.rankNumber || 999)
    );

    // Return up to 4 guides
    if (eventRelatedGuides.length >= 4) {
      return eventRelatedGuides.slice(0, 8);
    }

    // If we have some event-related guides but less than 4,
    // fill the rest with featured guides
    const featuredGuides = guides
      .filter((g) => g.isFeatured && !eventRelatedGuides.includes(g))
      .sort((a, b) => (a.rankNumber || 999) - (b.rankNumber || 999));

    const combinedGuides = [
      ...eventRelatedGuides,
      ...featuredGuides.slice(0, 6 - eventRelatedGuides.length),
    ];

    return combinedGuides.slice(0, 8);
  }

  // Step 3: No active events - return featured guides
  const featuredGuides = guides
    .filter((guide) => guide.isFeatured)
    .sort((a, b) => (a.rankNumber || 999) - (b.rankNumber || 999));

  return featuredGuides.slice(0, 7);
};

const guidesQuery = `*[_type == "guides"] {
  _id,
  title,
  subtitle,
  category,
  icon,
  rankNumber,
  isFeatured,
  "relatedEvents": relatedEvents[]->{ 
    _id, 
    title,
    startDate,
    endDate
  },
}`;

// GROQ query to fetch academic events
const eventsQuery = `*[_type == "academicEvent"] {
  _id,
  title,
  description,
  startDate,
  endDate,
  linkUrl,
  iconName
}`;

const fetchExploreGuides = async () => {
  try {
    // Fetch both guides and events from Sanity
    const [guides, events] = await Promise.all([
      client.fetch(guidesQuery),
      client.fetch(eventsQuery),
    ]);

    const exploreGuides = await getDynamicGuides(events, guides);

    return exploreGuides;
  } catch (error) {
    console.error("Error fetching explore guides:", error);
    return [];
  }
};

const HomeScreen = ({ navigation }) => {
  const [exploreGuides, setExploreGuides] = useState([]);
  // const { isLoading, quote, author, date, error } = useMotivation();
  const authCtx = useContext(AuthContext);
  const fullName = useSelector(selectFullName);
  const [greeting, setGreeting] = useState(getGreeting());
  const [loadingGuides, setLoadingGuides] = useState(true);
  const [categories, setCategories] = useState([]);
  // const { isLoading, data: guides, error } = useAllGuides();
  const {
    isLoading: isLoadingEvents,
    data: events,
    error: eventsError,
  } = useAcademicEvents();

  // console.log("Name", fullName);

  const handleSignOut = async () => {
    authCtx.logout();
    // console.log("logged-out");
  };

  // Update greeting every minute
  useEffect(() => {
    const interval = setInterval(() => {
      setGreeting(getGreeting());
      // console.log(greeting);
    }, 60000); // Update every minute

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    setCategories(shuffleArray(initialCategories).slice(0, 4));
  }, []);

  useEffect(() => {
    const loadGuides = async () => {
      setLoadingGuides(true);
      const guides = await fetchExploreGuides();
      setExploreGuides(guides);
      setLoadingGuides(false);
    };

    loadGuides();
  }, [events]);

  const renderHeader = () => (
    <>
      <View style={styles.statusBarBackground} pointerEvents="none" />
      <StatusBar style="light" />
      <ImageBackground
        source={require("../../assets/images/Hero1.png")}
        style={styles.topBar}
        imageStyle={{
          borderBottomLeftRadius: moderateScale(55),
          borderBottomRightRadius: moderateScale(55),
        }}
      >
        <View style={styles.topBarContent}>
          <TouchableOpacity onPress={() => console.log("clicked")}>
            <Image
              source={{ uri: "https://i.pravatar.cc/100" }}
              style={styles.avatar}
            />
          </TouchableOpacity>
          <View style={styles.usernameBlock}>
            <View style={styles.usernameLine}>
              <Text style={styles.text1}>{greeting}</Text>
            </View>
            <View style={styles.usernameLineShort}>
              <Text style={styles.text2}>{fullName}</Text>
            </View>
          </View>
          <TouchableOpacity
            onPress={handleSignOut}
            style={styles.searchIconContainer}
          >
            <Ionicons
              name="search"
              size={20}
              color="#9B0E10"
              style={styles.searchIcon}
            />
          </TouchableOpacity>
        </View>
      </ImageBackground>

      <MyCarousel />

      {/* Locations */}
      <Text style={styles.sectionTitle}>Need directions?</Text>
      <FlatList
        horizontal
        data={locationItems}
        renderItem={({ item }) => (
          <LocationCard
            icon={item.icon}
            label={item.label}
            onPress={() => {
              console.log(item.title);
              navigation.navigate("LocationPlaces", {
                code: item.code,
                title: item.title,
              });
            }}
          />
        )}
        keyExtractor={(item) => item.id.toString()}
        showsHorizontalScrollIndicator={false}
        style={styles.horizontalScroll}
        contentContainerStyle={styles.horizontalScrollContent}
      />

      {/* Categories */}
      <Text style={styles.sectionTitle}>Categories</Text>
      <FlatList
        data={categories}
        numColumns={2}
        renderItem={({ item }) => (
          <CategoryCard
            icon={item.icon}
            label={item.label}
            onPress={() => {
              navigation.navigate("Articles", {
                code: item.id,
                title: item.title,
              });
            }}
          />
        )}
        keyExtractor={(_, index) => index.toString()}
        scrollEnabled={false}
        columnWrapperStyle={styles.categoryRow}
      />

      {/* Explore Section */}
      <Text style={styles.sectionTitle}>Explore</Text>
    </>
  );

  const renderExploreItem = ({ item, index }) => (
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
          <Text numberOfLines={1} style={styles.cardSubtitle}>
            {item.subtitle}
          </Text>
        </View>
        <Ionicons name="arrow-forward" size={20} color="#9B0E10" />
      </View>
    </TouchableOpacity>
  );

  return (
    <FlatList
      data={exploreGuides}
      renderItem={renderExploreItem}
      keyExtractor={(_, index) => index.toString()}
      ListHeaderComponent={renderHeader}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollContent: {
    paddingHorizontal: moderateScale(16),
  },
  horizontalScrollContent: {
    paddingHorizontal: 16, // Add horizontal padding
    paddingRight: 20, // Extra padding on the right
    gap: 12,
  }, // If supported, otherwise use margin on LocationCard  },}
  statusBarBackground: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: StatusBar.currentHeight, // leave as-is, dynamic
    backgroundColor: "#7e1d1d",
    zIndex: -1,
  },
  topBar: {
    // backgroundColor: "#7e1d1d",
    marginBottom: moderateVerticalScale(12, 0.8),
    borderBottomLeftRadius: moderateScale(60, 0.8),
    borderBottomRightRadius: moderateScale(60, 0.8),
    marginHorizontal: moderateScale(-16),
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: moderateVerticalScale(2),
    },
    shadowOpacity: 0.15,
    shadowRadius: moderateScale(6),

    // Android shadow
    elevation: 4,
  },
  topBarContent: {
    padding: moderateScale(20, 0.9),
    paddingBottom: moderateVerticalScale(35, 0.7),
    paddingTop: moderateVerticalScale(45, 0.9),
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  avatar: {
    width: moderateScale(60, 0.9),
    height: moderateScale(60, 0.9),
    borderRadius: moderateScale(100),
    backgroundColor: "#eee",
    marginRight: moderateScale(7),
  },
  usernameBlock: {
    flex: 1,
  },
  usernameLine: {
    color: "white",
    marginBottom: moderateVerticalScale(4),
    borderRadius: moderateScale(4),
    fontSize: moderateScale(18),
    fontWeight: "bold",
  },
  text1: {
    color: "#fff",
    fontSize: moderateScale(16, 0.8),
    fontWeight: "bold",
  },
  text2: {
    color: "#fff",
    fontSize: moderateScale(18, 0.8),
    fontWeight: "bold",
  },
  usernameLineShort: {
    borderRadius: moderateScale(4),
    fontSize: moderateScale(16),
    fontWeight: "600",
  },
  searchIconContainer: {
    backgroundColor: "#FFFFFF",
    padding: moderateScale(8),
    borderRadius: moderateScale(100),
    marginRight: moderateScale(8),
  },
  searchIcon: {
    fontSize: moderateScale(20, 0.8),
  },
  heroCard: {
    height: moderateVerticalScale(160, 0.8),
    backgroundColor: "#f0dcdc",
    borderRadius: moderateScale(20),
    marginBottom: moderateVerticalScale(20),
    overflow: "hidden",

    // iOS shadow
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: moderateVerticalScale(2),
    },
    shadowOpacity: 0.15,
    shadowRadius: moderateScale(6),

    // Android shadow
    elevation: 0.8,
  },
  heroContent: {
    flex: 1,
    padding: moderateScale(20),
    justifyContent: "center",
  },
  heroTitle: {
    color: "#fff",
    fontSize: moderateScale(24),
    fontWeight: "bold",
    marginBottom: moderateVerticalScale(8),
  },
  heroSubtitle: {
    color: "#fff",
    fontSize: moderateScale(16),
    fontWeight: "500",
  },
  sectionTitle: {
    fontSize: moderateScale(16, 0.9),
    fontWeight: "medium",
    marginBottom: moderateVerticalScale(10, 0.6),
    marginTop: moderateVerticalScale(10),
    // color: "#9B0E10",
  },
  horizontalScroll: {
    flexDirection: "row",
    marginBottom: moderateVerticalScale(16),
  },
  locationItem: {
    width: moderateScale(115),
    height: moderateScale(90),
    backgroundColor: "#f0dcdc",
    borderRadius: moderateScale(15),
    marginRight: moderateScale(10),

    // iOS shadow
    // shadowColor: "#000",
    // shadowOffset: {
    //   width: 0,
    //   height: moderateVerticalScale(2),
    // },
    // shadowOpacity: 0.08,
    // shadowRadius: moderateScale(2),

    // // Android shadow
    // elevation: 1,
  },
  categoryItem: {
    width: "48%",
    height: moderateVerticalScale(125, 0.8),
    backgroundColor: "#f0dcdc",
    borderRadius: moderateScale(28),
    marginBottom: moderateVerticalScale(12),

    // iOS shadow
    shadowColor: "#000",
    // shadowOffset: {
    //   width: 0,
    //   height: moderateVerticalScale(2),
    // },
    shadowOpacity: 0.15,
    shadowRadius: moderateScale(6),

    // Android shadow
    elevation: 1.5,
  },
  categoryRow: {
    justifyContent: "space-between",
    marginBottom: moderateVerticalScale(12),
  },
  exploreCard: {
    backgroundColor: "#fff",
    borderRadius: moderateScale(10),
    padding: moderateScale(16),
    height: moderateVerticalScale(90),
    marginBottom: moderateVerticalScale(12),
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: moderateScale(5),
    elevation: 2,
  },
  exploreTitle: {
    fontWeight: "bold",
    fontSize: moderateScale(14),
    color: "#000",
  },
  exploreText: {
    fontSize: moderateScale(12),
    color: "#555",
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

export default HomeScreen;
