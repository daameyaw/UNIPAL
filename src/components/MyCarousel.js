import React, { useEffect, useRef } from "react";
import {
  Dimensions,
  View,
  Text,
  Image,
  StyleSheet,
  ActivityIndicator,
  ImageBackground,
} from "react-native";
import Carousel, { Pagination } from "react-native-reanimated-carousel";
import CourseRegistrationCard from "./CourseRegistrationCard";
import { useSharedValue } from "react-native-reanimated";
import QuoteCard from "./QuoteCard";
import NoticeCard from "./NoticeCard";
import { useMotivation } from "../hooks/useMotivation";
import {
  moderateScale,
  moderateVerticalScale,
} from "react-native-size-matters";
import AsyncStorage from "@react-native-async-storage/async-storage";

const { width } = Dimensions.get("window");

// Ref for carousel instance
const staticData = [
  {
    type: "card",
    title: "Course Registration",
    subTitle: "Register your courses for the upcoming semester",
    startDate: "19th May, 2025",
    endDate: "20th May, 2025",
  },
  {
    type: "not",
    title: "Notice",
    message:
      "You have exactly 3 days more to begin your second semester for the KNUST 2024/2025 Academic Year..",
  },
];

const LoadingQuoteCard = () => (
  <ImageBackground
    source={require("../../assets/images/card1.png")}
    resizeMode="cover"
    style={[styles.cardContainer, { width: "100%" }]}
    imageStyle={{ borderRadius: moderateScale(20) }}
  >
    <View style={styles.contentWrapper}>
      <ActivityIndicator size="large" color="#a52828" />
      <Text style={styles.quoteText}>Loading your daily motivation...</Text>
    </View>
  </ImageBackground>
);

const ErrorQuoteCard = () => (
  <ImageBackground
    source={require("../../assets/images/card1.png")}
    resizeMode="cover"
    style={[styles.cardContainer, { width: "100%" }]}
    imageStyle={{ borderRadius: moderateScale(20) }}
  >
    <View style={styles.contentWrapper}>
      <Text style={styles.quoteText}>😔 Oops! Something went wrong</Text>
      <Text style={styles.authorText}>Couldn't load your daily motivation</Text>
    </View>
  </ImageBackground>
);

export default function MyCarousel() {
  const { isLoading, quote, author, error } = useMotivation();

  const viewAsyncStorage = async () => {
    const keys = await AsyncStorage.getAllKeys();
    const items = await AsyncStorage.multiGet(keys);
    console.log("🔍 AsyncStorage Contents:");
    items.forEach(([key, value]) => {
      console.log(`${key}: ${value}`);
    });
  };
  const ref = useRef(null);
  const progress = useSharedValue(0);

  const data = [
    ...staticData.slice(0, 1),
    {
      type: "mov",
      quote,
      author,
    },
    ...staticData.slice(1),
  ];
  // useEffect(() => {
  //   viewAsyncStorage();
  // }, []);

  const onPressPagination = (index) => {
    if (ref.current) {
      ref.current.scrollTo({
        count: index - progress.value,
        animated: true,
      });
      progress.value = index;
    }
  };

  const renderItem = ({ item }) => {
    switch (item.type) {
      case "card":
        return (
          <CourseRegistrationCard
            title={item.title}
            subTitle={item.subTitle}
            startDate={item.startDate}
            endDate={item.endDate}
          />
        );
      case "mov":
        if (isLoading) return <LoadingQuoteCard />;
        if (error) return <ErrorQuoteCard />;
        return <QuoteCard quote={item.quote} author={item.author} />;
      case "not":
        return <NoticeCard title={item.title} message={item.message} />;

      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      <Carousel
        ref={ref}
        width={width * 0.9}
        height={280}
        data={data}
        autoPlay={false}
        autoPlayInterval={5000}
        scrollAnimationDuration={1000}
        renderItem={renderItem}
        onProgressChange={(_, absoluteProgress) => {
          progress.value = absoluteProgress;
        }}
      />
      <Pagination.Basic
        progress={progress}
        data={data}
        dotStyle={{ backgroundColor: "rgba(0,0,0,0.2)", borderRadius: 50 }}
        containerStyle={{
          gap: 5,
          marginTop: 13,
          flexDirection: "row",
          justifyContent: "center",
        }}
        onPress={onPressPagination}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    marginHorizontal: 10,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 8,
    height: 300,
    padding: 10,
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
  },
  image: {
    width: "100%",
    height: 200,
    borderRadius: 8,
  },
  title: {
    fontSize: 18,
    marginTop: 10,
    fontWeight: "bold",
    textAlign: "center",
  },
  cardContainer: {
    borderRadius: moderateScale(20),
    margin: moderateScale(16),
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 5,
    minHeight: moderateVerticalScale(230, 0.2),
    width: "100%",
    alignSelf: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  contentWrapper: {
    padding: moderateScale(20),
    flex: 1,
    justifyContent: "center",
    gap: moderateScale(10),
  },
  quoteText: {
    fontSize: moderateScale(18, 0.6),
    color: "#222",
    fontWeight: "500",
    textAlign: "center",
    lineHeight: moderateScale(24),
  },
  authorText: {
    fontSize: moderateScale(14),
    color: "#222",
    textAlign: "center",
    marginBottom: moderateScale(6),
    fontStyle: "italic",
  },
});
