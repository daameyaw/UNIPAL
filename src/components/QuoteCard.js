import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
} from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import {
  moderateScale,
  moderateVerticalScale,
} from "react-native-size-matters";
import { useFavorites } from "../hooks/useFavorites";

const QuoteCard = ({ quote, author, onShare }) => {
  const { toggleFavorite, isFavorite } = useFavorites();
  const favorite = isFavorite(quote, author);

  return (
    <ImageBackground
      source={require("../../assets/images/card1.png")}
      resizeMode="cover"
      style={[styles.cardContainer, { width: "100%" }]}
      imageStyle={{ borderRadius: moderateScale(20) }}
    >
      <View style={styles.contentWrapper}>
        <Text style={styles.quoteText}>{quote}</Text>
        <Text style={styles.authorText}>
          — <Text style={{ fontStyle: "italic" }}>{author}</Text>
        </Text>
        <View style={styles.iconRow}>
          {/* <TouchableOpacity onPress={onShare}>
            <Ionicons
              name="share-outline"
              size={28}
              color="#a52828"
              style={styles.icon}
            />
          </TouchableOpacity> */}
          <TouchableOpacity onPress={() => toggleFavorite(quote, author)}>
            <MaterialIcons
              name={favorite ? "favorite" : "favorite-border"}
              size={28}
              color="#a52828"
              style={styles.icon}
            />
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    borderRadius: moderateScale(20),
    // margin: moderateScale(16),
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 5,
    minHeight: moderateVerticalScale(230, 0.2),
    // maxHeight: moderateVerticalScale(300, 0.2),
    // width: "100%",
    alignSelf: "center",
    justifyContent: "center",
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
    // marginBottom: moderateScale(10),
  },
  authorText: {
    fontSize: moderateScale(14),
    color: "#222",
    textAlign: "center",
    marginBottom: moderateScale(6),
    fontStyle: "italic",
  },
  iconRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: moderateScale(10),
  },
  icon: {
    marginHorizontal: moderateScale(12),
  },
});

export default QuoteCard;
