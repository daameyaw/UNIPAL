import React, { useCallback, useMemo, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ImageBackground,
  Button,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetModalProvider,
  BottomSheetScrollView,
  BottomSheetTextInput,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import { GestureHandlerRootView } from "react-native-gesture-handler";

const createCourseChip = (index) => ({
  id: `course-${index}`,
  label: `Course ${index + 1}`,
});

export default function SemesterCalculator() {
  const [courses, setCourses] = useState([]);
  const isCalculateDisabled = courses.length === 0;

  const [currentCWA, setCurrentCWA] = useState(null);
  const [targetCWA, setTargetCWA] = useState(null);

  // Temporary sheet values
  const [tempCurrent, setTempCurrent] = useState("");
  const [tempTarget, setTempTarget] = useState("");

  const [courseCode, setCourseCode] = useState("CS101");
  const [courseName, setCourseName] = useState("Introduction to Computing");
  const [creditHours, setCreditHours] = useState("3");
  const [targetScore, setTargetScore] = useState("80");

  const isSaveDisabled = !tempCurrent || !tempTarget;

  const sheetRef = useRef(null);

  const plusRef = useRef(null);

  // Snap points tell the sheet how far to open
  // const snapPoints = useMemo(() => ["45%", "60%", "80%", "100%"], []);

  const snapPoints = useMemo(() => ["80%", "81%"], []);

  const [isOpen, setIsOpen] = useState(true);

  const handleAddCourse = useCallback((index) => {
    plusRef.current?.snapToIndex(index);
  }, []);

  // Backdrop component for dimming background
  const renderBackdrop = (props) => (
    <BottomSheetBackdrop {...props} disappearsOnIndex={-1} appearsOnIndex={0} />
  );

  const bottomSheetRef = useRef(null);

  // callbacks
  const handleSheetChange = useCallback((index) => {
    console.log("handleSheetChange", index);
  }, []);
  const handleSnapPress = useCallback((index) => {
    sheetRef.current?.snapToIndex(index);
  }, []);
  const handleClosePress = useCallback(() => {
    sheetRef.current?.close();
  }, []);
  const handleResetGoals = useCallback(() => {
    setTempCurrent("");
    setTempTarget("");
    setTargetCWA("");
  }, []);

  const handleSaveGoals = useCallback(() => {
    if (isSaveDisabled) return;

    setCurrentCWA(Number(tempCurrent));
    setTargetCWA(Number(tempTarget));

    plusRef.current?.close();

    console.log("tempCurrent", tempCurrent);
    console.log("tempTarget", tempTarget);
    console.log("targetCWA", targetCWA);
  }, [isSaveDisabled, tempCurrent, tempTarget]);

  const handleSaveCourse = () => {
    if (!courseCode || !courseName || !creditHours || !targetScore) return;

    const newCourse = {
      id: Date.now().toString(),
      courseCode,
      courseName,
      creditHours: Number(creditHours),
      targetScore: Number(targetScore),
    };

    setCourses((prev) => [...prev, newCourse]);

    // reset fields
    setCourseCode("");
    setCourseName("");
    setCreditHours("");
    setTargetScore("");

    console.log("newCourse", newCourse);

    sheetRef.current?.close();
  };

  const getCwaProgress = () => {
    if (!currentCWA || !targetCWA) return null;

    const C = Number(currentCWA);
    const T = Number(targetCWA);

    return (C / T) * 100;
  };

  // render
  //   return (
  //     <GestureHandlerRootView style={styles.container}>
  //       <Button title="Snap To 90%" onPress={() => handleSnapPress(2)} />
  //       <Button title="Snap To 50%" onPress={() => handleSnapPress(1)} />
  //       <Button title="Snap To 25%" onPress={() => handleSnapPress(0)} />
  //       <Button title="Close" onPress={() => handleClosePress()} />
  //       <BottomSheet
  //         ref={sheetRef}
  //         snapPoints={snapPoints}
  //         enableDynamicSizing={false}
  //         onChange={handleSheetChange}
  //       >
  //         <BottomSheetView style={styles.contentContainer}>
  //           <Text>Awesome 🔥</Text>
  //         </BottomSheetView>
  //       </BottomSheet>
  //     </GestureHandlerRootView>
  //   );

  const hasCWA = currentCWA && targetCWA;

  const progress = getCwaProgress();

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "left", "right"]}>
      <View style={styles.wrapper}>
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.contentContainer}
          showsVerticalScrollIndicator={false}
        >
          <ImageBackground
            source={require("../../assets/images/card1.png")}
            style={styles.overviewCard}
            imageStyle={styles.overviewImage}
            resizeMode="cover"
          >
            <View style={styles.overviewHeader}>
              <View style={styles.overviewHeaderLeft}>
                <Ionicons name="calculator-outline" size={24} color="#9B0E10" />
                <Text style={styles.overviewTitle}>Current Sem Overview</Text>
              </View>
              {hasCWA && (
                <TouchableOpacity
                  style={styles.editButton}
                  onPress={() => handleAddCourse(1)}
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
                onPress={() => handleAddCourse(1)}
              >
                <Ionicons name="add" size={26} color="#9B0E10" />
              </TouchableOpacity>
            ) : (
              /* ================= DATA STATE (IMAGE DESIGN) ================= */
              <>
                <View style={styles.statRow}>
                  <Text style={styles.statText}>
                    Current CWA:{" "}
                    <Text style={styles.statValue}>{currentCWA}%</Text>
                  </Text>
                  <Text style={styles.statText}>
                    Target CWA:{" "}
                    <Text style={styles.statValue}>{targetCWA }%</Text>
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

          <View style={styles.courseArea}>
            {courses.length === 0 ? (
              <Text style={styles.placeholderText}>
                Add each course to estimate this semester&apos;s CWA.
              </Text>
            ) : (
              courses.map((course) => (
                <View key={course.id} style={styles.courseRow}>
                  <Text style={styles.courseLabel}>{course.label}</Text>
                  <View style={styles.courseDots}>
                    <View style={styles.dot} />
                    <View style={styles.dot} />
                    <View style={styles.dot} />
                  </View>
                </View>
              ))
            )}
          </View>

          <TouchableOpacity
            style={styles.addCourseButton}
            onPress={() => {
              (console.log("pressed"), handleSnapPress(1));
            }}
          >
            <Ionicons name="add" size={18} color="#9B0E10" />
            <Text style={styles.addCourseText}>Add Course</Text>
          </TouchableOpacity>
        </ScrollView>
        <View style={styles.footer}>
          <TouchableOpacity
            disabled={isCalculateDisabled}
            style={[
              styles.calculateButton,
              isCalculateDisabled && styles.calculateButtonDisabled,
            ]}
          >
            <Text
              style={[
                styles.calculateText,
                isCalculateDisabled && styles.calculateTextDisabled,
              ]}
            >
              Calculate CWA
            </Text>
          </TouchableOpacity>
        </View>

        {/* Add Course Sheet */}
        <BottomSheet
          ref={sheetRef}
          snapPoints={snapPoints}
          enableDynamicSizing={false}
          enablePanDownToClose
          backdropComponent={renderBackdrop}
          index={-1}
          keyboardBehavior="extend" // Change to "extend"
          keyboardBlurBehavior="restore"
          android_keyboardInputMode="adjustResize"
          // bottomInset={46}
        >
          <BottomSheetScrollView
            style={styles.contentContainer}
            keyboardBehavior="interactive"
            keyboardShouldPersistTaps="handled"
          >
            <KeyboardAvoidingView
              style={styles.sheetKeyboardWrapper}
              behavior={Platform.OS === "ios" ? "padding" : undefined}
            >
              <Text style={styles.sheetTitle}>Add Course</Text>

              {/* Course Code */}
              <View style={styles.field}>
                <Text style={styles.label}>Course Code</Text>
                <TextInput
                  value={courseCode}
                  onChangeText={setCourseCode}
                  placeholder="e.g. CS101"
                  style={styles.input}
                  autoCapitalize="characters"
                />
              </View>

              {/* Course Name */}
              <View style={styles.field}>
                <Text style={styles.label}>Course Name</Text>
                <TextInput
                  value={courseName}
                  onChangeText={setCourseName}
                  placeholder="e.g. Introduction to Computing"
                  style={styles.input}
                />
              </View>

              {/* Credit Hours */}
              <View style={styles.field}>
                <Text style={styles.label}>Credit Hours</Text>
                <TextInput
                  value={creditHours}
                  onChangeText={setCreditHours}
                  placeholder="e.g. 3"
                  style={styles.input}
                  keyboardType="numeric"
                />
              </View>

              {/* Target Score */}
              <View style={styles.field}>
                <Text style={styles.label}>Target Score (%)</Text>
                <TextInput
                  value={targetScore}
                  onChangeText={setTargetScore}
                  placeholder="e.g. 80"
                  style={styles.input}
                  keyboardType="numeric"
                />
              </View>

              {/* Actions */}
              <View style={styles.actions}>
                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={() => sheetRef.current?.close()}
                >
                  <Text style={styles.cancelText}>Cancel</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.saveCourseButton}
                  onPress={handleSaveCourse}
                >
                  <Text style={styles.saveCourseText}>Save Course</Text>
                </TouchableOpacity>
              </View>
            </KeyboardAvoidingView>
          </BottomSheetScrollView>
        </BottomSheet>

        {/* Current Semester Overview Sheet */}
        <BottomSheet
          ref={plusRef}
          snapPoints={snapPoints}
          enableDynamicSizing={false}
          onChange={handleSheetChange}
          enablePanDownToClose={true}
          backdropComponent={renderBackdrop}
          index={-1}
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
                  onChangeText={setTempCurrent}
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
                  onChangeText={setTempTarget}
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
        </BottomSheet>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: "center",
    backgroundColor: "grey",
  },
  contentContainer: {
    flex: 1,
    alignItems: "center",
    // paddingHorizontal: 20,
  },
  safeArea: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  wrapper: {
    flex: 1,
  },
  scroll: {
    flex: 1,
    paddingHorizontal: 20,
  },
  contentContainer: {
    paddingVertical: 12,
    paddingBottom: 32,
    gap: 20,
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
  heading: {
    color: "#E7E7E7",
    fontSize: 14,
    letterSpacing: 1.8,
    fontWeight: "700",
  },
  overviewCard: {
    borderRadius: 18,
    padding: 16,
    minHeight: 150,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  overviewImage: {
    borderRadius: 18,
  },
  overviewHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
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
  courseArea: {
    minHeight: 260,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#5A4A4A",
    borderStyle: "dashed",
    padding: 18,
    justifyContent: "center",
  },
  placeholderText: {
    textAlign: "center",
    color: "#CBBFBF",
    fontSize: 14,
  },
  courseRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#4C3D3D",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 14,
    marginBottom: 12,
  },
  courseLabel: {
    color: "#F8F2F2",
    fontWeight: "600",
  },
  courseDots: {
    flexDirection: "row",
    gap: 6,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#E8D7D7",
  },
  addCourseButton: {
    alignSelf: "flex-end",
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: "#FFFFFF",
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "#F2C8C8",
  },
  addCourseText: {
    color: "#9B0E10",
    fontWeight: "600",
  },
  footer: {
    paddingHorizontal: 20,
    paddingBottom: 44,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#F2E6E6",
    backgroundColor: "#ffffff",
  },
  calculateButton: {
    borderRadius: 12,
    borderWidth: 1.4,
    borderColor: "#9B0E10",
    paddingVertical: 16,
    alignItems: "center",
    backgroundColor: "#FDF5F5",
  },
  calculateButtonDisabled: {
    borderColor: "#D7CACA",
    backgroundColor: "#F8F4F4",
  },
  calculateText: {
    color: "#9B0E10",
    fontWeight: "700",
    fontSize: 16,
  },
  calculateTextDisabled: {
    color: "#B7A3A3",
  },
  overviewContainer: {
    borderRadius: 18,
    padding: 16,
  },

  overviewHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 10,
  },

  overviewTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#4B2F2F",
  },

  overviewRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },

  overviewLabel: {
    fontSize: 13,
    color: "#5A4A4A",
  },

  overviewValue: {
    fontWeight: "700",
    color: "#9B0E10",
  },

  progressTrack: {
    height: 12,
    backgroundColor: "#E6C7C7",
    borderRadius: 999,
    overflow: "hidden",
    marginBottom: 10,
  },

  progressFill: {
    height: "100%",
    backgroundColor: "#9B0E10",
    borderRadius: 999,
  },

  overviewHint: {
    fontSize: 12,
    color: "#6B5555",
  },

  highlight: {
    color: "#9B0E10",
    fontWeight: "700",
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
  },

  emphasis: {
    color: "#9B0E10",
    fontWeight: "700",
  },

  /* ================= COURSE INPUT STYLES ================= */
  sheetTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#3E2723",
    marginBottom: 20,
    marginHorizontal: 20,
  },

  field: {
    marginBottom: 16,
  },

  label: {
    fontSize: 13,
    fontWeight: "600",
    color: "#5A4A4A",
    marginBottom: 6,
    marginHorizontal: 20,
  },

  input: {
    height: 46,
    borderWidth: 1,
    borderColor: "#E6C7C7",
    borderRadius: 10,
    paddingHorizontal: 14,
    backgroundColor: "#FFF",
    fontSize: 14,
    marginHorizontal: 20,
  },

  actions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 24,
  },

  cancelButton: {
    paddingVertical: 14,
    paddingHorizontal: 24,
  },

  cancelText: {
    color: "#9B0E10",
    fontWeight: "600",
  },

  saveCourseButton: {
    backgroundColor: "#9B0E10",
    borderRadius: 10,
    paddingVertical: 14,
    paddingHorizontal: 26,
    marginHorizontal: 20,
  },

  saveCourseText: {
    color: "#FFF",
    fontWeight: "700",
  },
});
