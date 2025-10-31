import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Platform,
  StatusBar,
  TouchableOpacity,
  Linking,
  ImageBackground,
} from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import ScreenHeader from "../components/ScreenHeader";
import { Ionicons } from "@expo/vector-icons";
import { getGuideById } from "../services/apiGuides";
import { LinearGradient } from "expo-linear-gradient";
import { moderateScale } from "react-native-size-matters";

/**
 * ArticleScreen
 *
 * Renders a single guide article. It can receive either:
 * - a full `guide` object via navigation params, or
 * - an `id` param, in which case the guide is fetched on mount.
 */
const ArticleScreen = ({ route, navigation }) => {
  // Prefer a concrete guide passed via navigation; fall back to id-based fetch
  const { guide: routeGuide, id } = route.params || {};
  const [guide, setGuide] = useState(routeGuide);

  useEffect(() => {
    // Fetch only when we were not provided a full guide but we do have an id
    async function fetchGuideById() {
      if (id && !routeGuide) {
        try {
          const fetchedGuide = await getGuideById(id);
          setGuide(fetchedGuide);
          console.log(guide)
        } catch (error) {
          console.error("Error fetching guide:", error);
        }
      }
    }

    fetchGuideById();

    return () => {
      // No subscriptions to clean up currently
    };
  }, [id, routeGuide]);

  const renderContentBlock = (block, index) => {
    // Handle step blocks (numbered steps)
    if (block._type === "stepBlock") {
      const handleLinkPress = async () => {
        if (block.linkUrl) {
          console.log("URL trimmed:", block.linkUrl?.trim());

          // Sanitize the URL
          const url = block.linkUrl.trim();

          try {
            await Linking.openURL(url);
          } catch (error) {
            console.error("Error:", error);
          }
        }
      };

      return (
        <View key={block._key || index} style={styles.stepCard}>
          <View style={styles.stepHeader}>
            {block.emoji && <Text style={styles.emoji}>{block.emoji}</Text>}
            {block.stepTitle && (
              <Text style={styles.stepTitle}>{block.stepTitle}</Text>
            )}
          </View>

          {block.description && (
            <Text style={styles.stepDescription}>{block.description}</Text>
          )}

          {block.points && block.points.length > 0 && (
            <View style={styles.pointsList}>
              {block.points.map((point, idx) => (
                <View key={idx} style={styles.pointItem}>
                  <View style={styles.bullet} />
                  <Text style={styles.pointText}>{point}</Text>
                </View>
              ))}
            </View>
          )}

          {block.linkText && (
            <TouchableOpacity
              style={styles.linkButton}
              // onPress={() => console.log("Navigate to:", block.linkUrl)}
              onPress={handleLinkPress}
              activeOpacity={0.7}
            >
              <Text style={styles.linkText}>{block.linkText}</Text>
              <Ionicons name="arrow-forward" size={16} color="#9B0E10" />
            </TouchableOpacity>
          )}
        </View>
      );
    }

    // Handle cut-off points block
    if (block._type === "cutOffBlock") {
      return (
        <View key={block._key || index} style={styles.cutOffCard}>
          {block.heading && (
            <Text style={styles.cutOffHeading}>{block.heading}</Text>
          )}
          {block.description && (
            <Text style={styles.cutOffDescription}>{block.description}</Text>
          )}

          {block.cutOffs && block.cutOffs.length > 0 && (
            <View style={styles.cutOffList}>
              {block.cutOffs.map((item, idx) => (
                <View key={idx} style={styles.cutOffRow}>
                  <Text style={styles.programText}>{item.program}</Text>
                  <Text style={styles.gradeText}>{item.grade}</Text>
                </View>
              ))}
            </View>
          )}
        </View>
      );
    }

    // Handle points block (just bullet points, no step styling)
    if (block._type === "pointsBlock") {
      return (
        <View key={block._key || index} style={styles.pointsCard}>
          {(block.emoji || block.heading) && (
            <View style={styles.pointsHeader}>
              {block.emoji && <Text style={styles.emoji}>{block.emoji}</Text>}
              {block.heading && (
                <Text style={styles.pointsHeading}>{block.heading}</Text>
              )}
            </View>
          )}

          {block.description && (
            <Text style={styles.pointsDescription}>{block.description}</Text>
          )}

          {block.points && block.points.length > 0 && (
            <View style={styles.pointsList}>
              {block.points.map((point, idx) => (
                <View key={idx} style={styles.pointItem}>
                  <View style={styles.bullet} />
                  <Text style={styles.pointText}>{point}</Text>
                </View>
              ))}
            </View>
          )}
        </View>
      );
    }

    // Handle simple text block
    if (block._type === "textBlock") {
      return (
        <View key={block._key || index} style={styles.textBlock}>
          {block.heading && (
            <Text style={styles.textBlockHeading}>{block.heading}</Text>
          )}
          {block.content && (
            <Text style={styles.textBlockContent}>{block.content}</Text>
          )}
        </View>
      );
    }

    // Handle tip blocks
    if (block._type === "tipBlock") {
      const tipStyles = {
        info: styles.tipInfo,
        warning: styles.tipWarning,
        success: styles.tipSuccess,
        tip: styles.tipDefault,
      };

      return (
        <View
          key={block._key || index}
          style={[
            styles.tipCard,
            tipStyles[block.tipType] || styles.tipDefault,
          ]}
        >
          <View style={styles.stepHeader}>
            {block.emoji && <Text style={styles.emoji}>{block.emoji}</Text>}
            {block.tipTitle && (
              <Text style={styles.tipTitle}>{block.tipTitle}</Text>
            )}
          </View>
          {block.tipContent && (
            <Text style={styles.tipDescription}>{block.tipContent}</Text>
          )}
        </View>
      );
    }

    //LOCATION BLOCK

    if (block._type === "locationLinkBlock") {
      return (
        <TouchableOpacity
          key={block._key || index}
          style={styles.locationLinkBlock}
          onPress={() =>
            navigation.navigate("LocationPlaces", {
              code: block.code,
              title: block.title,
            })
          }
          activeOpacity={0.9}
        >
          {/* <ImageBackground
            source={require("../../assets/images/Splash.png")}
            style={styles.locationBlockBackground}
            imageStyle={styles.locationBlockBackgroundImage}
            resizeMode="cover"
          > */}
            <View style={styles.locationOverlay}>
              <View style={styles.locationContent}>
                <View style={styles.locationIconContainer}>
                  <Ionicons name="location" size={28} color="#9B0E10" />
                </View>

                <View style={styles.locationTextContainer}>
                  {block.locationName && (
                    <Text style={styles.locationName}>
                      {block.locationName}
                    </Text>
                  )}
                  {block.locationDescription && (
                    <Text style={styles.locationDescription}>
                      {block.locationDescription}
                    </Text>
                  )}

                  <View style={styles.locationMetaContainer}>
                    {block.openingTimes && (
                      <View style={styles.locationTimesContainer}>
                        <Ionicons name="time-outline" size={12} color="#666" />
                        <Text style={styles.locationTimes}>
                          {block.openingTimes}
                        </Text>
                      </View>
                    )}
                    {block.distance && (
                      <View style={styles.locationDistanceContainer}>
                        <Ionicons
                          name="navigate-outline"
                          size={12}
                          color="#666"
                        />
                        <Text style={styles.locationDistance}>
                          {block.distance}
                        </Text>
                      </View>
                    )}
                  </View>

                  {/* Get Directions Button */}
                  <TouchableOpacity
                    style={styles.directionsButton}
                    onPress={() => {
                      console.log("pressed");
                      navigation.navigate("LocationPlaces", {
                        code: block.code,
                        title: block.title,
                      });
                    }}
                    activeOpacity={0.8}
                  >
                    <Ionicons name="navigate" size={16} color="#FFFFFF" />
                    <Text style={styles.directionsButtonText}>
                      Get Directions
                    </Text>
                  </TouchableOpacity>
                </View>

                <View style={styles.locationArrowContainer}>
                  <Ionicons name="arrow-forward" size={20} color="#9B0E10" />
                </View>
              </View>
            </View>
          {/* </ImageBackground> */}
        </TouchableOpacity>
      );
    } // Handle link block
    if (block._type === "linkBlock") {
      console.log(block.linkUrl);
      return (
        <TouchableOpacity
          key={block._key || index}
          style={styles.linkBlock}
          onPress={() => {
            console.log(block.linkUrl);
            navigation.push("Article", { id: block.linkUrl });
          }}
          activeOpacity={0.9}
        >
          <ImageBackground
            source={require("../../assets/images/Splash.png")}
            style={styles.linkBlockBackground}
            imageStyle={styles.linkBlockBackgroundImage}
            resizeMode="cover"
          >
            <View style={styles.linkBlockOverlay}>
              <View style={styles.linkBlockContent}>
                {block.emoji && (
                  <View style={styles.emojiContainer}>
                    <Text style={styles.emoji}>{block.emoji}</Text>
                  </View>
                )}
                <View style={styles.linkBlockTextContainer}>
                  {block.linkTitle && (
                    <Text style={styles.linkBlockTitle}>{block.linkTitle}</Text>
                  )}
                  <Text style={styles.linkBlockText}>{block.linkText}</Text>
                </View>
              </View>
              <Ionicons name="arrow-forward" size={20} color="#9B0E10" />
            </View>
          </ImageBackground>
        </TouchableOpacity>
      );
    } // Handle regular text blocks (portable text)
    if (block._type === "block") {
      const text = block.children?.map((child) => child.text).join(" ");

      if (block.style === "h2") {
        return (
          <Text key={block._key || index} style={styles.heading2}>
            {text}
          </Text>
        );
      }

      if (block.style === "h3") {
        return (
          <Text key={block._key || index} style={styles.heading3}>
            {text}
          </Text>
        );
      }

      return (
        <Text key={block._key || index} style={styles.paragraph}>
          {text}
        </Text>
      );
    }

    return null;
  };

  return (
    <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
      <ScreenHeader title={guide?.category.toUpperCase() || "Guide"} />
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {guide?.title && <Text style={styles.mainTitle}>{guide.title}</Text>}

        {guide?.subtitle && (
          <Text style={styles.subtitle}>{guide.subtitle}</Text>
        )}

        {guide?.content?.map((block, index) =>
          renderContentBlock(block, index)
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default ArticleScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingVertical: 24,
    paddingBottom: 40,
  },
  mainTitle: {
    fontSize: 24,
    fontWeight: "800",
    color: "#1a1a1a",
    marginBottom: 12,
    letterSpacing: 0.3,
  },
  subtitle: {
    fontSize: 16,
    color: "#555",
    marginBottom: 24,
    lineHeight: 24,
  },
  heading2: {
    fontSize: 22,
    fontWeight: "700",
    color: "#1a1a1a",
    marginTop: 24,
    marginBottom: 12,
  },
  heading3: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginTop: 20,
    marginBottom: 10,
  },
  paragraph: {
    fontSize: 15,
    color: "#666",
    lineHeight: 22,
    marginBottom: 16,
  },
  // Step card styles
  stepCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  stepHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  emoji: {
    fontSize: 24,
    marginRight: 10,
  },
  stepTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1a1a1a",
    flex: 1,
  },
  stepDescription: {
    fontSize: 15,
    color: "#555",
    marginBottom: 16,
    lineHeight: 22,
  },
  // Points card styles (lighter, no heavy borders)
  pointsCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 18,
    marginBottom: 16,
  },
  pointsHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  pointsHeading: {
    fontSize: 17,
    fontWeight: "600",
    color: "#1a1a1a",
    flex: 1,
  },
  pointsDescription: {
    fontSize: 14,
    color: "#666",
    marginBottom: 14,
    lineHeight: 20,
  },
  pointsList: {
    marginTop: 4,
  },
  pointItem: {
    flexDirection: "row",
    marginBottom: 12,
    paddingRight: 8,
  },
  bullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#9B0E10",
    marginTop: 7,
    marginRight: 12,
  },
  pointText: {
    flex: 1,
    fontSize: 14,
    color: "#444",
    lineHeight: 20,
  },
  // Text block styles
  textBlock: {
    marginBottom: 20,
  },
  textBlockHeading: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1a1a1a",
    marginBottom: 8,
  },
  textBlockContent: {
    fontSize: 15,
    color: "#555",
    lineHeight: 22,
  },
  // Tip card styles
  tipCard: {
    borderRadius: 12,
    padding: 18,
    marginBottom: 16,
    borderLeftWidth: 4,
  },
  tipDefault: {
    backgroundColor: "#fffbea",
    borderLeftColor: "#f59e0b",
  },
  tipInfo: {
    backgroundColor: "#eff6ff",
    borderLeftColor: "#3b82f6",
  },
  tipWarning: {
    backgroundColor: "#fef2f2",
    borderLeftColor: "#ef4444",
  },
  tipSuccess: {
    backgroundColor: "#f0fdf4",
    borderLeftColor: "#22c55e",
  },
  tipTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1a1a1a",
    flex: 1,
  },
  tipDescription: {
    fontSize: 14,
    color: "#333",
    lineHeight: 20,
    marginTop: 4,
  },
  // Link button styles
  linkButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: "#fff0f0",
    borderRadius: 10,
    marginTop: 8,
  },
  linkText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#9B0E10",
    marginRight: 8,
    flex: 1,
  },
  // Standalone link block
  linkBlock: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingVertical: 16,
    paddingHorizontal: 18,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 1 },
    elevation: 2,
  },
  linkIcon: {
    marginRight: 12,
  },
  linkBlockText: {
    flex: 1,
    fontSize: 15,
    fontWeight: "600",
    color: "#1a1a1a",
  },

  linkBlock: {
    borderRadius: 12,
    marginBottom: 12,
    overflow: "hidden", // Important for borderRadius to work with ImageBackground
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  linkBlockBackground: {
    width: "100%",
  },
  linkBlockBackgroundImage: {
    borderRadius: 12,
  },
  linkBlockOverlay: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "rgba(255, 255, 255, 0.95)", // Semi-transparent overlay
    paddingVertical: 16,
    paddingHorizontal: 18,
  },
  linkBlockContent: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    marginRight: 12,
  },
  emojiContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#fff0f0",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
  },
  emoji: {
    fontSize: 22,
  },
  linkBlockTextContainer: {
    flex: 1,
  },
  linkBlockTitle: {
    fontSize: 12,
    fontWeight: "500",
    color: "#666",
    marginBottom: 4,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  linkBlockText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1a1a1a",
  }, // Cut-off points block styles
  cutOffCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 1 },
    elevation: 2,
  },
  cutOffHeading: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1a1a1a",
    marginBottom: 8,
  },
  cutOffDescription: {
    fontSize: 14,
    color: "#666",
    marginBottom: 16,
    lineHeight: 20,
  },
  cutOffList: {
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb",
    paddingTop: 12,
  },
  cutOffRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
  },
  programText: {
    flex: 1,
    fontSize: 14,
    color: "#333",
    fontWeight: "500",
    paddingRight: 16,
  },
  gradeText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#9B0E10",
    minWidth: 50,
    textAlign: "right",
  },

  locationLinkBlock: {
    marginVertical: 10,
    borderRadius: 12,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  locationBlockBackground: {
    width: "100%",
    minHeight: 100,
  },
  locationBlockBackgroundImage: {
    borderRadius: 12,
    opacity: 0.95,
  },
  locationOverlay: {
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    padding: 16,
    borderRadius: 12,
  },
  locationContent: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  locationGradient: {
    padding: 20,
  },
  locationIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#FFE5E6",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
  },
  locationTextContainer: {
    flex: 1,
  },
  locationName: {
    fontSize: 17,
    fontWeight: "700",
    color: "#1A1A1A",
    marginBottom: 4,
  },
  locationDescription: {
    fontSize: 13,
    color: "#666",
    marginBottom: 8,
    lineHeight: 18,
  },
  locationMetaContainer: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 12,
    marginBottom: 10,
  },
  locationTimesContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  locationTimes: {
    fontSize: 12,
    color: "#666",
    marginLeft: 4,
    fontWeight: "500",
  },
  locationDistanceContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  locationDistance: {
    fontSize: 12,
    color: "#666",
    marginLeft: 4,
    fontWeight: "500",
  },
  locationArrowContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#FFE5E6",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 8,
  },
  directionsButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#9B0E10",
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 8,
    gap: 6,
    alignSelf: "flex-start",
  },
  directionsButtonText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "600",
  },
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
