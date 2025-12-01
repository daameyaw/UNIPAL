import React, { useMemo, useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

const createCourse = () => ({
  id: `course-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
  title: "",
  credits: "",
  score: "",
});

const SemesterCalculatorScreen = () => {
  const [courses, setCourses] = useState([createCourse()]);
  const [targetCwa, setTargetCwa] = useState("70");

  const calculation = useMemo(() => {
    let totalCredits = 0;
    let weighted = 0;

    courses.forEach((course) => {
      const credits = Number(course.credits);
      const score = Number(course.score);

      if (!Number.isNaN(credits) && !Number.isNaN(score) && credits > 0) {
        totalCredits += credits;
        weighted += credits * score;
      }
    });

    const cwa = totalCredits > 0 ? weighted / totalCredits : null;
    return {
      totalCredits,
      weighted,
      cwa,
    };
  }, [courses]);

  const handleCourseChange = (id, key, value) => {
    setCourses((prev) =>
      prev.map((course) =>
        course.id === id
          ? {
              ...course,
              [key]: value,
            }
          : course
      )
    );
  };

  // const addCourse = () => {
  //   setCourses((prev) => [...prev, createCourse()]);
  // };

  const removeCourse = (id) => {
    setCourses((prev) =>
      prev.length === 1 ? prev : prev.filter((c) => c.id !== id)
    );
  };

  const parsedTarget = Number(targetCwa);
  const remainingGap =
    calculation.cwa !== null && !Number.isNaN(parsedTarget)
      ? parsedTarget - calculation.cwa
      : null;

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.heroCard}>
            <View style={styles.heroIcon}>
              <Ionicons name="hourglass-outline" size={24} color="#9B0E10" />
            </View>
            <Text style={styles.heroTitle}>Semester Calculator</Text>
            <Text style={styles.heroBody}>
              Map out this semester, enter each course, and know the scores you
              need before results land.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Target CWA</Text>
            <View style={styles.targetCard}>
              <TextInput
                style={styles.targetInput}
                value={targetCwa}
                onChangeText={setTargetCwa}
                keyboardType="numeric"
                placeholder="e.g. 72"
                placeholderTextColor="#B3A4A4"
                maxLength={3}
              />
              <Text style={styles.targetSuffix}>%</Text>
            </View>
            {remainingGap !== null && (
              <Text style={styles.helperText}>
                {remainingGap <= 0
                  ? "You are on track for this target."
                  : `You need +${remainingGap.toFixed(1)} pts overall to reach your target.`}
              </Text>
            )}
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Courses</Text>
            {courses.map((course, index) => (
              <View key={course.id} style={styles.courseCard}>
                <View style={styles.courseHeader}>
                  <Text style={styles.courseLabel}>Course {index + 1}</Text>
                  {courses.length > 1 && (
                    <TouchableOpacity onPress={() => removeCourse(course.id)}>
                      <Ionicons
                        name="trash-outline"
                        size={18}
                        color="#B3261E"
                      />
                    </TouchableOpacity>
                  )}
                </View>
                <TextInput
                  style={styles.courseInput}
                  placeholder="Course name (optional)"
                  placeholderTextColor="#B3A4A4"
                  value={course.title}
                  onChangeText={(text) =>
                    handleCourseChange(course.id, "title", text)
                  }
                />
                <View style={styles.row}>
                  <View style={styles.inputGroup}>
                    <Text style={styles.label}>Credits</Text>
                    <TextInput
                      style={styles.numericInput}
                      placeholder="3"
                      keyboardType="numeric"
                      placeholderTextColor="#B3A4A4"
                      value={course.credits}
                      onChangeText={(text) =>
                        handleCourseChange(
                          course.id,
                          "credits",
                          text.replace(/[^0-9.]/g, "")
                        )
                      }
                    />
                  </View>
                  <View style={styles.inputGroup}>
                    <Text style={styles.label}>Score / 100</Text>
                    <TextInput
                      style={styles.numericInput}
                      placeholder="78"
                      keyboardType="numeric"
                      placeholderTextColor="#B3A4A4"
                      value={course.score}
                      onChangeText={(text) =>
                        handleCourseChange(
                          course.id,
                          "score",
                          text.replace(/[^0-9.]/g, "")
                        )
                      }
                    />
                  </View>
                </View>
              </View>
            ))}
            <TouchableOpacity style={styles.addButton} onPress={addCourse}>
              <Ionicons name="add-circle-outline" size={20} color="#9B0E10" />
              <Text style={styles.addButtonText}>Add another course</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Summary</Text>
            <View style={styles.summaryCard}>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Total Credits</Text>
                <Text style={styles.summaryValue}>
                  {calculation.totalCredits ? calculation.totalCredits : "--"}
                </Text>
              </View>
              <View style={styles.divider} />
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Semester CWA</Text>
                <Text style={styles.summaryHighlight}>
                  {calculation.cwa !== null ? calculation.cwa.toFixed(2) : "--"}
                </Text>
              </View>
              {remainingGap !== null && (
                <>
                  <View style={styles.divider} />
                  <View style={styles.summaryRow}>
                    <Text style={styles.summaryLabel}>Gap to Target</Text>
                    <Text
                      style={[
                        styles.summaryValue,
                        { color: remainingGap <= 0 ? "#1C7C54" : "#B3261E" },
                      ]}
                    >
                      {remainingGap <= 0
                        ? "On track"
                        : `-${remainingGap.toFixed(2)} pts`}
                    </Text>
                  </View>
                </>
              )}
            </View>
          </View>

          <Text style={styles.footerNote}>
            Tip: keep grades realistic—plug in projections before assessments to
            know what score you need on final papers or exams.
          </Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  content: {
    padding: 20,
    gap: 24,
  },
  heroCard: {
    backgroundColor: "#FFF3F3",
    borderRadius: 24,
    padding: 24,
    gap: 12,
  },
  heroIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
  },
  heroTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#2D0A0A",
  },
  heroBody: {
    fontSize: 15,
    color: "#4F3C3C",
    lineHeight: 20,
  },
  section: {
    gap: 14,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#2D0A0A",
  },
  targetCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    paddingHorizontal: 18,
    paddingVertical: 12,
  },
  targetInput: {
    flex: 1,
    fontSize: 28,
    fontWeight: "700",
    color: "#9B0E10",
  },
  targetSuffix: {
    fontSize: 18,
    fontWeight: "600",
    color: "#9B0E10",
  },
  helperText: {
    fontSize: 13,
    color: "#6B5A5A",
  },
  courseCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 16,
    gap: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  courseHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  courseLabel: {
    fontWeight: "600",
    color: "#3D2F2F",
  },
  courseInput: {
    backgroundColor: "#F6F2F2",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: "#2F1F1F",
  },
  row: {
    flexDirection: "row",
    gap: 12,
  },
  inputGroup: {
    flex: 1,
    gap: 6,
  },
  label: {
    fontSize: 13,
    fontWeight: "600",
    color: "#6B5A5A",
  },
  numericInput: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E6D6D6",
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 15,
    color: "#2F1F1F",
  },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#F2C8C8",
  },
  addButtonText: {
    color: "#9B0E10",
    fontWeight: "600",
  },
  summaryCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 18,
    gap: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  summaryLabel: {
    fontSize: 14,
    color: "#6B5A5A",
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: "600",
    color: "#2D0A0A",
  },
  summaryHighlight: {
    fontSize: 20,
    fontWeight: "700",
    color: "#9B0E10",
  },
  divider: {
    height: 1,
    backgroundColor: "#F1E2E2",
  },
  footerNote: {
    fontSize: 13,
    color: "#6B5A5A",
    marginBottom: 20,
  },
});

export default SemesterCalculatorScreen;
