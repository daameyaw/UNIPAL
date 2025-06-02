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
  { icon: "home", label: "STUDENT HOUSING" },
  { icon: "navigate-outline", label: "CAMPUS NAVIGATION" },
  { icon: "book-outline", label: "ACADEMICS" },
  { icon: "headset-outline", label: "SUPPORT SERVICES" },
  { icon: "people-circle-outline", label: "CAMPUS LIFE" },
  { icon: "school-outline", label: "ADMISSIONS" },
];

function shuffleArray(array) {
  return array
    .map((value) => ({ value, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ value }) => value);
}

const HomeScreen = ({ navigation }) => {
  // const { isLoading, quote, author, date, error } = useMotivation();
  const authCtx = useContext(AuthContext);
  const fullName = useSelector(selectFullName);
  const [greeting, setGreeting] = useState(getGreeting());
  const [categories, setCategories] = useState([]);

  const auth = getAuth(app);

  console.log("Name", fullName);

  const handleSignOut = async () => {
    authCtx.logout();
    // console.log("logged-out");
  };

  // Update greeting every minute
  useEffect(() => {
    const interval = setInterval(() => {
      setGreeting(getGreeting());
      console.log(greeting);
    }, 60000); // Update every minute

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    setCategories(shuffleArray(initialCategories).slice(0, 4));
  }, []);

  // useEffect(() => {
  //   async function fetchMotivation() {
  //     const motivation = await getMotivation();
  //     console.log(motivation);
  //   }
  //   fetchMotivation();
  // }, []);

  const renderHeader = () => (
    <>
      <View style={styles.statusBarBackground} />
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
              <Text style={styles.text2}>Ameyaw David Asante</Text>
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
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.horizontalScroll}
      >
        <LocationCard
          icon="medkit-outline"
          label="Medical Centers"
          onPress={() => {}}
        />
        <LocationCard
          icon="finger-print-outline"
          label="Biometric Check"
          onPress={() => {}}
        />
        <LocationCard
          icon="bus-outline"
          label="Shuttle Stops"
          onPress={() => {}}
        />
        <LocationCard
          icon="library-outline"
          label="School libraries"
          onPress={() => {}}
        />
      </ScrollView>

      {/* Categories */}
      <Text style={styles.sectionTitle}>Categories</Text>
      <FlatList
        data={categories}
        numColumns={2}
        renderItem={({ item }) => (
          <CategoryCard
            icon={item.icon}
            label={item.label}
            onPress={() => {}}
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
    <TouchableOpacity style={styles.exploreCard}>
      <View>
        <Text style={styles.exploreTitle}>STUFFFFFFFF</Text>
        <Text style={styles.exploreText}>XXXXXXXXXXXXXXX</Text>
      </View>
      <Ionicons name="arrow-forward" size={20} color="#9B0E10" />
    </TouchableOpacity>
  );

  return (
    <FlatList
      data={[...Array(4)]}
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
  statusBarBackground: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: StatusBar.currentHeight, // leave as-is, dynamic
    backgroundColor: "#7e1d1d",
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
});

export default HomeScreen;
