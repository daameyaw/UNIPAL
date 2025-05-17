import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import * as React from "react";
import {
  StatusBar,
  Animated,
  Text,
  Image,
  View,
  StyleSheet,
  Dimensions,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
// import { TouchableOpacity } from "react-native-gesture-handler";
const { width, height } = Dimensions.get("screen");

// https://www.flaticon.com/packs/retro-wave
// inspiration: https://dribbble.com/shots/11164698-Onboarding-screens-animation
// https://twitter.com/mironcatalin/status/1321180191935373312

const bgs = ["#ED1518", "#9B0E10", "#881416", "#B98EFF"];
const DATA = [
  {
    key: "3571572",
    title: "🎓 Your Campus Companion",
    description:
      "From admissions to academics, grading systems to course registration — Unipal gives you all the essential university information, right at your fingertips.",
    image: require("../../assets/p1.png"),
  },
  {
    key: "3571747",
    title: "🗺️ Navigate Your Campus with Ease",
    description:
      "Find your way around like a pro — lecture halls, hostels, cafeterias, libraries, and more. Plus, get essential info on academics, grading systems, and student life all in one place.",
    image: require("../../assets/p2.png"),
  },
  {
    key: "3571680",
    title: "🔔 Never Miss a Beat",
    description:
      "Get real-time updates and official notifications, know where to go, and stay ready for every semester.",
    image: require("../../assets/p3.png"),
  },
  //   {
  //     key: "3571603",
  //     title: "Monitored global data-warehouse",
  //     description: "We need to program the open-source IB interface!",
  //     image: "https://image.flaticon.com/icons/png/256/3571/3571603.png",
  //   },
];

const Indicator = ({ scrollX }) => {
  return (
    <View
      style={{
        // position: "absolute",
        bottom: 60,
        // paddingHorizontal: 20,
        flexDirection: "row",
        marginHorizontal: 10,
      }}
    >
      {DATA.map((_, i) => {
        const inputRange = [(i - 1) * width, i * width, (i + 1) * width];
        const scale = scrollX.interpolate({
          inputRange,
          outputRange: [0.8, 1.4, 0.8],
          extrapolate: "clamp",
        });

        const opacity = scrollX.interpolate({
          inputRange,
          outputRange: [0.6, 0.9, 0.6],
          extrapolate: "clamp",
        });

        return (
          <Animated.View
            key={`indicator-${i}`}
            style={{
              height: 10,
              width: 10,
              // paddingHorizontal: 10,
              borderRadius: 5,
              backgroundColor: "#fff",
              margin: 10,
              transform: [
                {
                  scale,
                },
              ],
            }}
          />
        );
      })}
    </View>
  );
};

const Backdrop = ({ scrollX }) => {
  const backgroundColor = scrollX.interpolate({
    inputRange: bgs.map((_, i) => i * width),
    outputRange: bgs.map((bg) => bg),
  });
  return (
    <Animated.View
      style={[
        StyleSheet.absoluteFillObject,
        {
          backgroundColor,
        },
      ]}
    />
  );
};

const Square = ({ scrollX }) => {
  const YOLO = Animated.modulo(
    Animated.divide(Animated.modulo(scrollX, width), new Animated.Value(width)),
    1
  );

  const rotate = YOLO.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: ["35deg", "0deg", "35deg"],
  });

  const translateX = YOLO.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0, -height, 0],
  });

  return (
    <Animated.View
      style={{
        width: height,
        height: height,
        backgroundColor: "#fff",
        borderRadius: 86,
        position: "absolute",
        top: -height * 0.69,
        left: -height * 0.35,
        transform: [
          {
            rotate,
          },
          {
            translateX,
          },
        ],
      }}
    />
  );
};

export default function Onboarding() {
  const navigation = useNavigation();
  const scrollX = React.useRef(new Animated.Value(0)).current;
  const flatListRef = React.useRef(null);
  const [currentIndex, setCurrentIndex] = React.useState(0);
  // const navigation = useNavigation()

  const viewableItemsChanged = React.useRef(({ viewableItems }) => {
    if (viewableItems.length > 0) {
      setCurrentIndex(viewableItems[0].index);
    }
  }).current;

  const viewConfig = React.useRef({
    viewAreaCoveragePercentThreshold: 50,
  }).current;

  const scrollToNext = () => {
    if (currentIndex < DATA.length - 1) {
      flatListRef.current.scrollToIndex({ index: currentIndex + 1 });
    } else {
      // Last screen - could navigate
      console.log("Finished Onboarding!");
      navigation.navigate("SignUp"); // Uncomment this if you have a 'Home' screen
    }
  };

  const scrollToPrev = () => {
    if (currentIndex > 0) {
      flatListRef.current.scrollToIndex({ index: currentIndex - 1 });
    }
  };

  const skipToEnd = () => {
    navigation.navigate("SignUp"); // Uncomment this if you have a 'Home' screen

    // flatListRef.current.scrollToIndex({ index: DATA.length - 1 });
  };
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar hidden />
      <Backdrop scrollX={scrollX} />
      <Square scrollX={scrollX} />

      <TouchableOpacity
        style={{
          position: "absolute",
          top: 50,
          right: 30,
          backgroundColor:
            currentIndex === DATA.length - 1 ? "#ccc" : "#EAE7E7",
          paddingHorizontal: 15,
          paddingVertical: 15,
          borderRadius: 13,
          zIndex: 10,
          opacity: currentIndex === DATA.length - 1 ? 0.6 : 1,
        }}
        onPress={skipToEnd}
        disabled={currentIndex === DATA.length - 1}
      >
        <Text
          className="shadow-md"
          style={{
            color: currentIndex === DATA.length - 1 ? "#BDBDBD" : "#000",
            fontWeight: "bold",
          }}
        >
          Skip
        </Text>
      </TouchableOpacity>
      <Animated.FlatList
        ref={flatListRef}
        data={DATA}
        keyExtractor={(item) => item.key}
        horizontal
        scrollEventThrottle={32}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: false }
        )}
        contentContainerStyle={{ paddingBottom: 200 }}
        showsHorizontalScrollIndicator={false}
        pagingEnabled
        renderItem={({ item }) => {
          return (
            <View
              style={{
                width,
                alignItems: "center",
                padding: 20,
                paddingTop: 20,
              }}
            >
              <View
                style={{
                  flex: 0.7,
                  //   justifyContent: "center",
                }}
              >
                <Image
                  source={item.image}
                  style={{
                    width: width / 1.4,
                    height: width / 1.4,
                    resizeMode: "contain",
                    marginTop: 20,
                  }}
                />
              </View>
              <View style={{ flex: 0.3 }}>
                <Text
                  style={{
                    color: "#fff",
                    fontWeight: "800",
                    fontSize: 32,
                    marginBottom: 10,
                  }}
                  className="font-heading"
                >
                  {item.title}
                </Text>
                <Text
                  style={{
                    color: "#fff",
                    fontWeight: "300",
                    fontSize: 18,
                    textAlign: "left",
                    // marginBottom: 45,
                  }}
                  className="font-body "
                >
                  {item.description}
                </Text>
              </View>
            </View>
          );
        }}
        onViewableItemsChanged={viewableItemsChanged}
        viewabilityConfig={viewConfig}
      />
      {/* <Indicator scrollX={scrollX} /> */}

      {/* PREVIOUS and NEXT Buttons at Bottom */}
      <View
        style={{
          flexDirection: "row",
          position: "absolute",
          bottom: 120,
          width: "100%",
          justifyContent: "space-between",
          paddingHorizontal: 50,
          // marginTop: 10,
        }}
      >
        <TouchableOpacity
          onPress={scrollToPrev}
          disabled={currentIndex === 0}
          style={{
            backgroundColor: currentIndex === 0 ? "#BDBDBD" : "#fff",
            padding: 22,
            paddingHorizontal: 18,
            borderRadius: 20,
            width: 120,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text
            style={{
              color: currentIndex === 0 ? "#777" : "#000",
              fontWeight: "bold",
              color: "#000",
              alignItems: "center",
              fontSize: 16,
            }}
          >
            Previous
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={async () => {
            if (currentIndex === DATA.length - 1) {
              try {
                await AsyncStorage.setItem("@onboarding_complete", "true");
                // goToHome(); // or navigate to your home screen
                navigation.navigate("SignUp"); // Uncomment this if you have a 'Home' screen
              } catch (e) {
                console.error("Failed to save onboarding status:", e);
              }
            } else {
              scrollToNext();
            }
          }}
          style={{
            backgroundColor: "#fff",
            padding: 22,
            paddingHorizontal: 18,
            borderRadius: 20,
            width: 120,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text style={{ fontWeight: "bold", color: "#000", fontSize: 16 }}>
            {currentIndex === DATA.length - 1 ? "Done" : "Next"}
          </Text>
        </TouchableOpacity>
      </View>

      <Indicator scrollX={scrollX} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
