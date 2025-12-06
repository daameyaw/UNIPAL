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
  const [currentCWA, setCurrentCWA] = useState("");
  const [targetCWA, setTargetCWA] = useState("");

  const isSaveDisabled = currentCWA.trim() === "" || targetCWA.trim() === "";

  const sheetRef = useRef(null);

  const plusRef = useRef(null);

  // Snap points tell the sheet how far to open
  const snapPoints = useMemo(() => ["45%", "60%"], []);

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
    setCurrentCWA("");
    setTargetCWA("");
  }, []);
  const handleSaveGoals = useCallback(() => {
    if (isSaveDisabled) return;
    plusRef.current?.close();
  }, [isSaveDisabled]);

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
              <Ionicons name="calculator-outline" size={24} color="#9B0E10" />
              <Text style={styles.overviewTitle}>Current Sem Overview</Text>
            </View>
            <TouchableOpacity
              style={styles.overviewAction}
              onPress={() => {
                (console.log("pressed"), handleAddCourse(1));
              }}
            >
              <Ionicons name="add" size={26} color="#9B0E10" />
            </TouchableOpacity>
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
        <BottomSheet
          ref={sheetRef}
          snapPoints={snapPoints}
          enableDynamicSizing={false}
          onChange={handleSheetChange}
          enablePanDownToClose={true}
          backdropComponent={renderBackdrop}
          index={-1}
        >
          <BottomSheetView style={styles.contentContainer}>
            <Text>Awesome 🔥</Text>
          </BottomSheetView>
        </BottomSheet>
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
          bottomInset={46}
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
                <BottomSheetTextInput
                  style={styles.inputField}
                  placeholder="e.g. 65.40"
                  placeholderTextColor="#B9A7A7"
                  keyboardType="decimal-pad"
                  value={currentCWA}
                  onChangeText={setCurrentCWA}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Target CWA</Text>
                <BottomSheetTextInput
                  style={styles.inputField}
                  placeholder="e.g. 72.00"
                  placeholderTextColor="#B9A7A7"
                  keyboardType="decimal-pad"
                  value={targetCWA}
                  onChangeText={setTargetCWA}
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
    paddingVertical: 28,
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
    gap: 6,
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
    minHeight: 200,
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
    gap: 10,
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
});
