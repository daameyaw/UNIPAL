import React, { useRef } from "react";
import { Dimensions, View, Text, Image, StyleSheet } from "react-native";
import Carousel, { Pagination } from "react-native-reanimated-carousel";
import CourseRegistrationCard from "./CourseRegistrationCard";
import { useSharedValue } from "react-native-reanimated";
import QuoteCard from "./QuoteCard";
import NoticeCard from "./NoticeCard";

const { width } = Dimensions.get("window");

// Ref for carousel instance
const data = [
  {
    type: "card",
    title: "Course Registration",
    subTitle: "Register your courses for the upcoming semester",
    startDate: "19th May, 2025",
    endDate: "20th May, 2025",
  },
  {
    type: "mov",
    quote:
      "Success is not final, failure is not fatal: It is the courage to continue that counts.",
    author: "Winston Churchill",
  },
  {
    type: "not",
    title: "Notice",
    message:
      "You have exactly 3 days more to begin your second semester for the KNUST 2024/2025 Academic Year..",
  },
  {
    type: "image",
    title: "Lake View",
    image: "https://picsum.photos/id/1016/600/400",
  },
];

export default function MyCarousel() {
  const ref = useRef(null);

  // Use shared value from reanimated to track progress (current index)
  const progress = useSharedValue(0);

  const onPressPagination = (index) => {
    if (ref.current) {
      ref.current.scrollTo({
        count: index - progress.value, // Scroll by difference
        animated: true,
      });
      progress.value = index; // Update progress to new index
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
        renderItem={({ item }) => {
          if (item.type === "card") {
            return (
              <CourseRegistrationCard
                title={item.title}
                subTitle={item.subTitle}
                startDate={item.startDate}
                endDate={item.endDate}
              />
            );
          }
          if (item.type === "mov") {
            return <QuoteCard quote={item.quote} author={item.author} />;
          }
          if (item.type === "not") {
            return <NoticeCard title={item.title} message={item.message} />;
          }

          return (
            <View style={styles.card}>
              <Image source={{ uri: item.image }} style={styles.image} />
              <Text style={styles.title}>{item.title}</Text>
            </View>
          );
        }}
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
          //   backgroundColor: "green",
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
    // marginTop: 50,
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
});
