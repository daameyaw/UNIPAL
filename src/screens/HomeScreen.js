import React, { useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ImageBackground,
  FlatList,
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

const HomeScreen = ({ navigation }) => {
  const authCtx = useContext(AuthContext);

  const auth = getAuth(app);

  const handleSignOut = () => {
    authCtx.logout();
    // console.log("logged-out");
  };

  return (
    <>
      {/* // <SafeAreaView style={styles.container}> */}
      <View style={styles.statusBarBackground} />
      <StatusBar style="light" />
      <ScrollView
        style={styles.container}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Top Profile Bar */}
        <ImageBackground
          source={require("../../assets/images/Hero1.png")}
          style={styles.topBar}
          imageStyle={{
            borderBottomLeftRadius: 50,
            borderBottomRightRadius: 50,
          }}
        >
          <View style={styles.topBarContent}>
            <View style={styles.avatar} />
            <View style={styles.usernameBlock}>
              <View style={styles.usernameLine}>
                <Text style={styles.text1}>Good Morning,</Text>
              </View>
              <View style={styles.usernameLineShort}>
                <Text style={styles.text2}> David Asante Ameyaw</Text>
              </View>
            </View>
            <TouchableOpacity onPress={handleSignOut}>
              <Ionicons
                name="search"
                size={20}
                color="#fff"
                style={styles.searchIcon}
              />
            </TouchableOpacity>
          </View>
        </ImageBackground>

        {/* Hero Card */}
        <ImageBackground
          source={require("../../assets/images/card1.png")}
          style={styles.heroCard}
          imageStyle={{ borderRadius: moderateScale(20) }}
        >
          <View style={styles.heroContent}>
            {/* <Text style={styles.heroTitle}>Welcome to UniPAL</Text>
            <Text style={styles.heroSubtitle}>Your University Companion</Text> */}
          </View>
        </ImageBackground>

        {/* Locations */}
        <Text style={styles.sectionTitle}>Locations</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.horizontalScroll}
        >
          {[...Array(5)].map((_, i) => (
            <View key={i} style={styles.locationItem} />
          ))}
        </ScrollView>

        {/* Categories */}
        <Text style={styles.sectionTitle}>Categories</Text>
        <FlatList
          data={[...Array(4)]}
          numColumns={2}
          renderItem={({ item, index }) => <View style={styles.categoryItem} />}
          keyExtractor={(_, index) => index.toString()}
          columnWrapperStyle={styles.categoryRow}
        />

        {/* Explore Section */}
        <Text style={styles.sectionTitle}>Explore</Text>
        <FlatList
          data={[...Array(4)]}
          renderItem={({ item, index }) => (
            <TouchableOpacity style={styles.exploreCard}>
              <View>
                <Text style={styles.exploreTitle}>STUFFFFFFFF</Text>
                <Text style={styles.exploreText}>XXXXXXXXXXXXXXX</Text>
              </View>
              <Ionicons name="arrow-forward" size={20} color="#9B0E10" />
            </TouchableOpacity>
          )}
          keyExtractor={(_, index) => index.toString()}
          scrollEnabled={false}
        />
      </ScrollView>
      {/* </SafeAreaView> */}
    </>
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
    borderBottomLeftRadius: moderateScale(50, 0.8),
    borderBottomRightRadius: moderateScale(50, 0.8),
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
    paddingBottom: moderateVerticalScale(40, 0.7),
    paddingTop: moderateVerticalScale(45, 0.9),
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  avatar: {
    width: moderateScale(65, 0.9),
    height: moderateScale(65, 0.9),
    borderRadius: moderateScale(100),
    backgroundColor: "#eee",
    marginRight: moderateScale(12),
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
    fontSize: moderateScale(16),
    fontWeight: "bold",
  },
  text2: {
    color: "#fff",
    fontSize: moderateScale(14),
    fontWeight: "600",
  },
  usernameLineShort: {
    borderRadius: moderateScale(4),
    fontSize: moderateScale(16),
    fontWeight: "600",
  },
  searchIcon: {
    marginRight: moderateScale(8),
    fontSize: moderateScale(20),
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
    elevation: 4,
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
    fontSize: moderateScale(14, 0.9),
    fontWeight: "bold",
    marginBottom: moderateVerticalScale(8),
    marginTop: moderateVerticalScale(10),
    color: "#9B0E10",
  },
  horizontalScroll: {
    flexDirection: "row",
    marginBottom: moderateVerticalScale(16),
  },
  locationItem: {
    width: moderateScale(90),
    height: moderateScale(80),
    backgroundColor: "#f0dcdc",
    borderRadius: moderateScale(12),
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
    width: "47%",
    height: moderateVerticalScale(110),
    backgroundColor: "#f0dcdc",
    borderRadius: moderateScale(15),
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
    elevation: 4,
  },
  categoryRow: {
    justifyContent: "space-between",
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
