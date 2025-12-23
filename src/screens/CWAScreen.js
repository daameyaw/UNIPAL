import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  TextInput,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetScrollView,
} from "@gorhom/bottom-sheet";
import { getData, saveData } from "../store/storage";
import { StatusBar } from "expo-status-bar";

const quickActions = [
  {
    id: "semester-calculator",
    label: "SEMESTER CALCULATOR",
    icon: "hourglass-outline",
  },
  {
    id: "goal-scenarios",
    label: "GOALS & SCENARIOS",
    icon: "stats-chart-outline",
  },
];

const cwaTips = [
  "Focus more on high-credit courses — they influence your CWA the most.",
  "Track each semester so dips never catch you off guard.",
  "Use scenarios to know the scores you need before assessments arrive.",
];

const guideCards = [
  {
    id: "calc",
    title: "Calculation of CWA",
    subtitle:
      "Get the full picture — when forms are released, deadlines, more.",
    icon: "document-text-outline",
  },
];

export default function CWAScreen({ navigation }) {
  const [currentCWA, setCurrentCWA] = useState(null);
  const [targetCWA, setTargetCWA] = useState(null);

  // Temporary sheet values
  const [tempCurrent, setTempCurrent] = useState("");
  const [tempTarget, setTempTarget] = useState("");
  const [isLoaded, setIsLoaded] = useState(false);

  const isSaveDisabled = !tempCurrent || !tempTarget;

  const CWARef = useRef(null);

  const openCWAModal = useCallback(() => {
    console.log("openSheet called");

    CWARef.current?.present();
  }, []);

  const closeCWAModal = () => {
    CWARef.current?.dismiss();
  };

  const renderBackdrop = (props) => (
    <BottomSheetBackdrop {...props} disappearsOnIndex={-1} appearsOnIndex={0} />
  );

  const snapPoints = useMemo(() => ["80%", "81%"], []);

  useEffect(() => {
    const loadData = async () => {
      try {
        // Load CWA
        const savedCWA = await getData("cwa");
        if (savedCWA) {
          setCurrentCWA(savedCWA.currentCWA);
          setTargetCWA(savedCWA.targetCWA);
        }

        setIsLoaded(true);
      } catch (error) {
        console.error("Error loading data:", error);
        setIsLoaded(true);
      }
    };

    loadData();
  }, []);

  //SAVE CWA TARGETS ASYNC STORAGE
  useEffect(() => {
    if (!isLoaded) return;
    const persistCWA = async () => {
      await saveData("cwa", { currentCWA, targetCWA });
      console.log("saved cwa target to storage:", { currentCWA, targetCWA });
    };

    persistCWA();
  }, [currentCWA, targetCWA, isLoaded]);

  const handleSheetChange = useCallback((index) => {
    console.log("handleSheetChange", index);
  }, []);

  const handleResetGoals = useCallback(() => {
    setTempCurrent("");
    setTempTarget("");
    setTargetCWA("");
  }, []);

  const handleCurrentCWAChange = (text) => {
    // Allow empty string
    if (text === "") {
      setTempCurrent("");
      return;
    }

    // Check if it's a valid number (including decimals)
    const numValue = parseFloat(text);
    if (isNaN(numValue)) {
      return; // Don't update if not a valid number
    }

    // Check if value is <= 100
    if (numValue <= 100) {
      setTempCurrent(text);
    }
  };

  const handleTargetCWAChange = (text) => {
    // Allow empty string
    if (text === "") {
      setTempTarget("");
      return;
    }

    // Check if it's a valid number (including decimals)
    const numValue = parseFloat(text);
    if (isNaN(numValue)) {
      return; // Don't update if not a valid number
    }

    // Check if value is <= 100
    if (numValue <= 100) {
      setTempTarget(text);
    }
  };

  const getCwaProgress = () => {
    if (!currentCWA || !targetCWA) return null;

    const C = Number(currentCWA);
    const T = Number(targetCWA);

    return (C / T) * 100;
  };

  const hasCWA = currentCWA && targetCWA;

  const progress = getCwaProgress();

  const handleSaveGoals = useCallback(() => {
    if (isSaveDisabled) return;

    setCurrentCWA(Number(tempCurrent));
    setTargetCWA(Number(tempTarget));

    CWARef.current?.dismiss();
  }, [isSaveDisabled, tempCurrent, tempTarget]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="dark" />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.heroWrapper}>
          <ImageBackground
            source={require("../../assets/images/card1.png")}
            style={styles.heroCard}
            imageStyle={styles.heroImage}
            resizeMode="cover"
          >
            <View style={styles.heroIconRow}>
              <View style={styles.overviewHeaderLeft}>
                <View style={styles.heroIcon}>
                  <Ionicons
                    name="calculator-outline"
                    size={24}
                    color="#9B0E10"
                  />
                </View>
                <Text style={styles.overviewTitle}>
                  Current CWA Standing & Target
                </Text>
              </View>
              {hasCWA && (
                <TouchableOpacity
                  style={styles.editButton}
                  onPress={() => openCWAModal()}
                  accessibilityRole="button"
                  accessibilityLabel="Edit CWA goals"
                >
                  <Ionicons name="pencil-outline" size={20} color="#9B0E10" />
                </TouchableOpacity>
              )}
            </View>
            {!hasCWA ? (
              /* ================= EMPTY STATE (PLUS BUTTON) ================= */
              <TouchableOpacity
                style={styles.overviewAction}
                onPress={() => openCWAModal()}
              >
                <Ionicons name="add" size={26} color="#9B0E10" />
              </TouchableOpacity>
            ) : (
              /* ================= DATA STATE (IMAGE DESIGN) ================= */
              <>
                <View style={styles.statRow}>
                  <Text style={styles.statText}>
                    Current CWA:{" "}
                    <Text style={styles.statValue}>
                      {currentCWA}% (First Class)
                    </Text>
                  </Text>
                  <Text style={styles.statText}>
                    Target CWA:{" "}
                    <Text style={styles.statValue}>{targetCWA}%</Text>
                  </Text>
                </View>

                {/* Progress bar */}
                <View style={styles.progressTrack}>
                  <View
                    style={[styles.progressFill, { width: `${progress}%` }]}
                  />
                </View>

                <Text style={styles.helperText}>
                  You are{" "}
                  <Text style={styles.emphasis}>
                    {progress ? progress.toFixed(1) : "--"}%
                  </Text>{" "}
                  of the way to your goal.
                </Text>
              </>
            )}
          </ImageBackground>
        </View>

        <View style={styles.quickActionsContainer}>
          {quickActions.map((action) => (
            <TouchableOpacity
              key={action.id}
              style={styles.quickActionCard}
              onPress={() => navigation.navigate("SemCalc")}
            >
              <Ionicons name={action.icon} size={22} color="#9B0E10" />
              <Text style={styles.quickActionLabel}>{action.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Tips for Boosting Your CWA</Text>
          {cwaTips.map((tip, index) => (
            <View key={tip} style={styles.tipCard}>
              <View style={styles.tipIcon}>
                <Ionicons name="flag-outline" size={18} color="#9B0E10" />
              </View>
              <Text style={styles.tipText}>{tip}</Text>
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>CWA Guides</Text>
          {guideCards.map((guide) => (
            <TouchableOpacity key={guide.id} style={styles.guideCard}>
              <View style={styles.guideTextBlock}>
                <Text style={styles.guideTitle}>{guide.title}</Text>
                <Text style={styles.guideSubtitle}>{guide.subtitle}</Text>
              </View>
              <Ionicons name="arrow-forward" size={20} color="#9B0E10" />
            </TouchableOpacity>
          ))}
        </View>
        <BottomSheetModal
          ref={CWARef}
          snapPoints={snapPoints}
          enableDynamicSizing={false}
          onChange={handleSheetChange}
          enablePanDownToClose={true}
          backdropComponent={renderBackdrop}
          keyboardBehavior="extend" // Change to "extend"
          keyboardBlurBehavior="restore"
          android_keyboardInputMode="adjustResize"
          // bottomInset={46}
        >
          <BottomSheetScrollView style={styles.sheetContent}>
            <KeyboardAvoidingView
              style={styles.sheetKeyboardWrapper}
              behavior={Platform.OS === "ios" ? "padding" : undefined}
            >
              <View style={styles.sheetHeader}>
                <Text style={styles.sheetTitle}>Set Your CWA Goals</Text>
                <Text style={styles.sheetSubtitle}>
                  Update where you are and where you want to be.
                </Text>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Current CWA</Text>
                <TextInput
                  style={styles.inputField}
                  placeholder="e.g. 65.40"
                  placeholderTextColor="#B9A7A7"
                  keyboardType="numeric"
                  value={tempCurrent || ""}
                  onChangeText={handleCurrentCWAChange}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Target CWA</Text>
                <TextInput
                  style={styles.inputField}
                  placeholder="e.g. 72.00"
                  placeholderTextColor="#B9A7A7"
                  keyboardType="numeric"
                  value={tempTarget || ""}
                  onChangeText={handleTargetCWAChange}
                />
              </View>

              <View style={styles.sheetActions}>
                <TouchableOpacity
                  style={styles.trashButton}
                  onPress={handleResetGoals}
                  accessibilityRole="button"
                  accessibilityLabel="Clear CWA goals"
                >
                  <Ionicons name="trash-outline" size={18} color="#9B0E10" />
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.saveButton,
                    isSaveDisabled && styles.saveButtonDisabled,
                  ]}
                  disabled={isSaveDisabled}
                  onPress={handleSaveGoals}
                >
                  <Text
                    style={[
                      styles.saveButtonText,
                      isSaveDisabled && styles.saveButtonTextDisabled,
                    ]}
                  >
                    Save
                  </Text>
                </TouchableOpacity>
              </View>
            </KeyboardAvoidingView>
          </BottomSheetScrollView>
        </BottomSheetModal>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  scrollContent: {
    paddingVertical: 24,
    paddingHorizontal: 20,
    gap: 24,
  },
  heroWrapper: {
    shadowColor: "#9B0E10",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 20,
    elevation: 12,
    borderRadius: 24,
    overflow: "hidden",
  },
  heroCard: {
    borderRadius: 24,
    padding: 24,
  },
  heroImage: {
    borderRadius: 24,
  },
  heroIconRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 18,
  },
  heroIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
  },
  heroTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#2D0A0A",
  },
  heroBody: {
    fontSize: 15,
    color: "#4F3C3C",
    marginTop: 6,
    marginBottom: 20,
  },
  heroButton: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    gap: 8,
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 999,
    backgroundColor: "#FFFFFF",
  },
  heroButtonText: {
    color: "#9B0E10",
    fontWeight: "600",
  },
  quickActionsContainer: {
    flexDirection: "row",
    gap: 16,
  },
  quickActionCard: {
    flex: 1,
    paddingVertical: 20,
    paddingHorizontal: 14,
    backgroundColor: "#FFF8F8",
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  quickActionLabel: {
    fontSize: 12,
    textAlign: "center",
    color: "#4F3C3C",
    fontWeight: "600",
  },
  section: {
    gap: 14,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#2D0A0A",
  },
  tipCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },
  tipIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#FFF1F1",
    alignItems: "center",
    justifyContent: "center",
  },
  tipText: {
    flex: 1,
    color: "#4F3C3C",
    fontSize: 14,
    lineHeight: 20,
  },
  guideCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 18,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    gap: 12,
  },
  guideTextBlock: {
    flex: 1,
    gap: 6,
  },
  guideTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#2D0A0A",
  },
  guideSubtitle: {
    fontSize: 13,
    color: "#5C4A4A",
    lineHeight: 18,
  },
  editButton: {
    padding: 4,
    borderRadius: 8,
  },
  overviewTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#4B2F2F",
  },
  overviewAction: {
    marginTop: 45,
    alignSelf: "center",
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "#F2C8C8",
    alignItems: "center",
    justifyContent: "center",
  },
  statRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
    paddingHorizontal: 6,
  },

  statText: {
    fontSize: 13,
    color: "#4B2F2F",
    fontWeight: "500",
  },

  statValue: {
    fontWeight: "700",
    color: "#9B0E10",
  },

  progressTrack: {
    height: 15,
    backgroundColor: "#E4C5C5",
    borderRadius: 999,
    overflow: "hidden",
    marginBottom: 10,
  },

  progressFill: {
    height: "100%",
    backgroundColor: "#9B0E10",
    borderRadius: 999,
  },

  helperText: {
    fontSize: 15,
    color: "#6B4D4D",
    lineHeight: 16,
    marginTop: 10,
  },

  emphasis: {
    color: "#9B0E10",
    fontWeight: "700",
  },

  sheetContent: {
    flex: 1,
    width: "100%",
    paddingHorizontal: 24,
    paddingVertical: 20,
    gap: 18,
  },
  sheetHeader: {
    // gap: 6,
    width: "100%",
  },
  sheetKeyboardWrapper: {
    flex: 1,
    width: "100%",
    gap: 18,
  },
  sheetTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#2D0A0A",
    // marginHorizontal: 20,
  },
  sheetSubtitle: {
    fontSize: 13,
    color: "#6E5B5B",
  },
  inputGroup: {
    width: "100%",
    gap: 8,
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: "#4F3C3C",
  },
  inputField: {
    width: "100%",
    borderRadius: 12,
    borderWidth: 1.4,
    borderColor: "#F2C8C8",
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: "#2D0A0A",
    backgroundColor: "#FDF6F6",
  },
  sheetActions: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 8,
  },
  trashButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    borderWidth: 1.4,
    borderColor: "#F7D5D5",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFF6F6",
  },
  saveButton: {
    flex: 1,
    marginLeft: 16,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1.4,
    borderColor: "#9B0E10",
    backgroundColor: "#FDF5F5",
  },
  saveButtonDisabled: {
    borderColor: "#E7D5D5",
    backgroundColor: "#F9F4F4",
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#9B0E10",
  },
  saveButtonTextDisabled: {
    color: "#C2A9A9",
  },
  overviewHeaderLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    flex: 1,
  },
  editButton: {
    padding: 4,
    borderRadius: 8,
  },
  overviewTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#4B2F2F",
  },
});
