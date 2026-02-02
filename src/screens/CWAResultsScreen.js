import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ImageBackground,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";

export default function CWAResultsScreen({ navigation , route }) {
  const { courses , currentCWA, cumulativeCreditHours , targetCWA } = route.params;
  console.log("courses passed from SemesterCalculator:", courses);



  const semesterCourses = courses;

  const totalSemesterCredits = semesterCourses.reduce( (sum, course) => sum + course.creditHours, 0);

  const totalWeightedScore = semesterCourses.reduce((sum, course) =>  sum + course.creditHours * course.targetScore,0 );
  
  const semesterWeightedAverage = (totalWeightedScore / totalSemesterCredits || 0).toFixed(2);

  const predictedCWACalculation =
  (currentCWA * cumulativeCreditHours +
    semesterWeightedAverage * totalSemesterCredits) /
  (cumulativeCreditHours + totalSemesterCredits);

  // Calculate progress bar positions (CWA is on 0-100 scale)
  const currentCWAPosition = Math.min(Math.max((Number(currentCWA) || 0) / 100 * 100, 0), 100);
  const predictedCWAPosition = Math.min(Math.max((Number(predictedCWACalculation) || 0) / 100 * 100, 0), 100);
  const targetCWAPosition = Math.min(Math.max((Number(targetCWA) || 0) / 100 * 100, 0), 100);

  console.log("semesterWeightedAverage:", semesterWeightedAverage); 
  console.log("totalSemesterCredits:", totalSemesterCredits);
  console.log("totalWeightedScore:", totalWeightedScore);

  // Function to convert targetScore to letter grade
  const getGrade = (targetScore) => {
    const score = Number(targetScore);
    if (isNaN(score)) return "-";
    
    switch (true) {
      case score >= 70:
        return "A";
      case score >= 60:
        return "B";
      case score >= 50:
        return "C";
      case score >= 40:
        return "D";
      default:
        return "F";
    }
  };

  // Function to find highest grade course
  const getHighestGrade = () => {
    if (!semesterCourses || semesterCourses.length === 0) {
      return { course: "--", grade: "--", credits: 0 };
    }
    
    const highest = semesterCourses.reduce((max, course) => {
      return Number(course.targetScore) > Number(max.targetScore) ? course : max;
    }, semesterCourses[0]);
    
    return {
      course: highest.courseCode || "--",
      grade: getGrade(highest.targetScore),
      credits: highest.creditHours || 0,
    };
  };

  // Function to find lowest grade course
  const getLowestGrade = () => {
    if (!semesterCourses || semesterCourses.length === 0) {
      return { course: "--", grade: "--", credits: 0 };
    }
    
    const lowest = semesterCourses.reduce((min, course) => {
      return Number(course.targetScore) < Number(min.targetScore) ? course : min;
    }, semesterCourses[0]);
    
    return {
      course: lowest.courseCode || "--",
      grade: getGrade(lowest.targetScore),
      credits: lowest.creditHours || 0,
    };
  };

  // Function to calculate contribution percentage
  const getContributionPercentage = () => {
    const totalCredits = cumulativeCreditHours + totalSemesterCredits;
    if (totalCredits === 0) return 0;
    return Math.round((totalSemesterCredits / totalCredits) * 100);
  };

  // Function to calculate course contributions
  // Impact is based on weighted scores (creditHours × targetScore) to show
  // which courses actually boosted CWA more, not just which have more credits
  const calculateCourseContributions = () => {
    if (!semesterCourses || semesterCourses.length === 0) {
      return [];
    }

    // Step 1: Compute total weighted score (total CWA influence this semester)
    const totalWeightedScore = semesterCourses.reduce((sum, course) => {
      const credits = Number(course.creditHours) || 0;
      const score = Number(course.targetScore) || 0;
      return sum + credits * score;
    }, 0);

    if (totalWeightedScore === 0) {
      return [];
    }

    // Step 2: Compute per-course impact based on weighted contribution
    const contributions = semesterCourses.map((course) => {
      const credits = Number(course.creditHours) || 0;
      const score = Number(course.targetScore) || 0;
      const weightedScore = credits * score;

      // Impact percentage = this course's weighted score / total weighted score
      const impactPercentage = (weightedScore / totalWeightedScore) * 100;

      return {
        course: course.courseCode || course.course || "--",
        // TRUE impact on CWA (based on both credits and performance)
        impactPercentage: Math.round(impactPercentage * 10) / 10,
        // Bar width uses same percentage (no need to fake it)
        visualPercentage: Math.round(impactPercentage * 10) / 10,
        expectedScore: score,
        credits: credits,
        isAnchor: false, // Will be set after sorting
      };
    });

    // Step 3: Sort by impact percentage and mark the highest as anchor
    const sorted = contributions.sort((a, b) => b.impactPercentage - a.impactPercentage);
    if (sorted.length > 0) {
      sorted[0].isAnchor = true;
    }

    return sorted;
  };

  // Function to calculate high impact courses
  // Impact value represents CWA change per 1 percentage point grade improvement
  const calculateHighImpactCourses = () => {
    if (!semesterCourses || semesterCourses.length === 0) {
      return [];
    }

    const totalCredits = cumulativeCreditHours + totalSemesterCredits;
    if (totalCredits === 0) {
      return [];
    }

    // Calculate impact value for each course (CWA change per 1% improvement)
    const coursesWithImpact = semesterCourses.map((course) => {
      const credits = Number(course.creditHours) || 0;
      // Impact value = how much CWA changes per 1 percentage point improvement
      const impactValue = credits / totalCredits;

      return {
        course: course.courseCode || course.course || "--",
        credits: credits,
        impactValue: impactValue,
        impact: "", // Will be categorized below
      };
    });

    // Sort by impact value (highest first)
    const sorted = coursesWithImpact.sort((a, b) => b.impactValue - a.impactValue);

    // Categorize as High/Medium/Low based on distribution
    // Divide courses into thirds: top third = High, middle third = Medium, bottom third = Low
    if (sorted.length > 0) {
      const third = Math.ceil(sorted.length / 3);
      
      sorted.forEach((course, index) => {
        if (index < third) {
          course.impact = "High";
        } else if (index < third * 2) {
          course.impact = "Medium";
        } else {
          course.impact = "Low";
        }
      });
    }

    // Return top 3 courses (or all if less than 3)
    return sorted.slice(0, 3);
  };

  const highestGrade = getHighestGrade();
  const lowestGrade = getLowestGrade();
  const contributionPercentage = getContributionPercentage();
  const courseContributions = calculateCourseContributions();
  const highImpactCourses = calculateHighImpactCourses();

  // Generate anchor course explanation
  const generateAnchorCourseExplanation = () => {
    if (courseContributions.length === 0) {
      return "No courses available for analysis.";
    }

    const anchorCourse = courseContributions.find((c) => c.isAnchor);
    if (!anchorCourse) {
      return "Analyze your course contributions to understand their impact on your CWA.";
    }

    const changeValue = (predictedCWACalculation - currentCWA).toFixed(2);
    const changeDirection = predictedCWACalculation > currentCWA ? "rising" : "falling";
    const changeText = Math.abs(changeValue) > 0.01 ? `by ${Math.abs(changeValue)}` : "slightly";

    return `Your CWA is ${changeDirection} ${changeText} mainly because ${anchorCourse.course}, which accounts for ${anchorCourse.impactPercentage}% of this semester's impact, is expected at ${anchorCourse.expectedScore}%. If ${anchorCourse.course} drops significantly, your predicted CWA will be affected more than other courses.`;
  };

  // Mock data - will be replaced with actual calculations later
  const mockData = {
    predictedCWA: predictedCWACalculation,
    currentCWA: currentCWA,
    change: (predictedCWACalculation - currentCWA).toFixed(2),
    isPositive: predictedCWACalculation > currentCWA,
    targetCWA: targetCWA,
    targetAchieved: predictedCWACalculation >= targetCWA ? true : false,
    gap: targetCWA - predictedCWACalculation,
    semesterWeightedAverage: semesterWeightedAverage,
    totalSemesterCredits: totalSemesterCredits,
    highestGrade: highestGrade,
    lowestGrade: lowestGrade,
    contributionPercentage: contributionPercentage,
    contributionExplanation:
      cumulativeCreditHours > totalSemesterCredits
        ? "High previous credit hours limited the impact of this semester."
        : "This semester has significant impact on your overall CWA.",
    courseContributions: courseContributions,
    anchorCourseExplanation: generateAnchorCourseExplanation(),
    highImpactCourses: highImpactCourses,
    insight:
      "You are on a strong upward trend — consistency can push you into Second Class Upper.",
    whatIfInsights: {
      allAsCWA: 71.2,
      requiredSemesterAverage: 68.0,
    },
    whatIfScenarios: [
      {
        type: "anchor_sensitivity",
        course: "MATH 203",
        currentScore: 85,
        simulatedScore: 70,
        cwaDelta: -0.2,
        isPositive: false,
        message: "If **Math** drops to **70%**, your CWA falls by **0.2**.",
      },
      {
        type: "effort_payoff",
        course: "MATH 203",
        currentScore: 85,
        simulatedScore: 90,
        cwaDelta: 0.08,
        isPositive: true,
        message: "Improving **Math** by **+5 marks** increases your CWA by **+0.08**.",
      },
      {
        type: "low_impact_reality",
        course: "HIST 101",
        currentScore: 80,
        simulatedScore: 90,
        cwaDelta: 0.01,
        isPositive: true,
        message: "Raising **HIST 101** by **+10 marks** only increases your CWA by **+0.01**.",
      },
    ],
  };

  const { predictedCWA, change, isPositive, targetAchieved, gap } =
    mockData;

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="dark" />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Section 1: Result Summary (Hero Section) */}
        <View style={styles.heroWrapper}>
          <ImageBackground
            source={require("../../assets/images/card1.png")}
            style={styles.heroCard}
            imageStyle={styles.heroImage}
            resizeMode="cover"
          >
            <View style={styles.heroHeader}>
              <View style={styles.heroIcon}>
                <Ionicons name="trophy-outline" size={24} color="#9B0E10" />
              </View>
              <Text style={styles.heroSubtitle}>After this semester</Text>
            </View>

            <View style={styles.cwaDisplay}>
              <Text style={styles.cwaValue}>{predictedCWA.toFixed(2)}</Text>``
              <View
                style={[
                  styles.changeIndicator,
                  isPositive ? styles.changePositive : styles.changeNegative,
                ]}
              >
                <Ionicons
                  name={isPositive ? "arrow-up" : "arrow-down"}
                  size={16}
                  color={isPositive ? "#10B981" : "#EF4444"}
                />
                <Text
                  style={[
                    styles.changeText,
                    isPositive
                      ? styles.changeTextPositive
                      : styles.changeTextNegative,
                  ]}
                >
                  {Math.abs(change).toFixed(2)}
                </Text>
              </View>
            </View>

            <Text style={styles.statusText}>
              {isPositive
                ? "Improved from your current CWA"
                : "Dropped slightly due to high previous credit weight"}
            </Text>
          </ImageBackground>
        </View>

        {/* Section 2: Target CWA Status */}
        <View style={styles.targetCard}>
          <View style={styles.targetHeader}>
            <Ionicons name="flag-outline" size={20} color="#9B0E10" />
            <Text style={styles.targetTitle}>Target CWA Status</Text>
          </View>

          <View style={styles.targetContent}>
            <Text style={styles.targetLabel}>Target CWA:</Text>
            <Text style={styles.targetValue}>{targetCWA.toFixed(2)}</Text>
          </View>

          <View style={styles.targetResult}>
            {targetAchieved ? (
              <>
                <Ionicons name="checkmark-circle" size={24} color="#10B981" />
                <Text style={styles.targetStatusText}>Target achieved</Text>
              </>
            ) : (
              <>
                <Ionicons name="close-circle" size={24} color="#EF4444" />
                <Text style={styles.targetStatusText}>Target missed</Text>
              </>
            )}
          </View>

          <Text style={styles.gapText}>
            {targetAchieved
              ? `You exceeded your target by ${gap.toFixed(2)}`
              : `You are short by ${gap.toFixed(2)}`}
          </Text>

          {/* Progress bar visualization */}
          <View style={styles.progressContainer}>
            <View style={styles.progressLabels}>
              <View style={styles.progressLabelContainer}>
                <View style={[styles.progressLabelDot, { backgroundColor: "#9B0E10" }]} />
                <Text style={[styles.progressLabel, { color: "#9B0E10" }]}>Current</Text>
                <Text style={[styles.progressLabelValue, { color: "#9B0E10" }]}>
                  {currentCWA ? Number(currentCWA).toFixed(2) : "--"}
                </Text>
              </View>
              <View style={styles.progressLabelContainer}>
                <View style={[styles.progressLabelDot, { backgroundColor: "#3B82F6" }]} />
                <Text style={[styles.progressLabel, { color: "#3B82F6" }]}>Predicted</Text>
                <Text style={[styles.progressLabelValue, { color: "#3B82F6" }]}>
                  {predictedCWACalculation ? Number(predictedCWACalculation).toFixed(2) : "--"}
                </Text>
              </View>
              <View style={styles.progressLabelContainer}>
                <View style={[styles.progressLabelDot, { backgroundColor: "#10B981" }]} />
                <Text style={[styles.progressLabel, { color: "#10B981" }]}>Target</Text>
                <Text style={[styles.progressLabelValue, { color: "#10B981" }]}>
                  {targetCWA ? Number(targetCWA).toFixed(2) : "--"}
                </Text>
              </View>
            </View>
            <View style={styles.progressTrack}>
              <View style={[styles.progressMarker, { left: `${currentCWAPosition}%` }]} />
              <View style={[styles.progressMarker, styles.progressMarkerPredicted, { left: `${predictedCWAPosition}%` }]} />
              <View
                style={[
                  styles.progressMarker,
                  styles.progressMarkerTarget,
                  { left: `${targetCWAPosition}%` },
                ]}
              />
            </View>
          </View>
        </View>

        {/* Section 3: Semester Performance Breakdown */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Semester Performance</Text>
          <View style={styles.breakdownCard}>
            <View style={styles.breakdownRow}>
              <Text style={styles.breakdownLabel}>Average:</Text>
              <Text style={styles.breakdownValue}>
                {mockData.semesterWeightedAverage}
              </Text>
            </View>
            <View style={styles.breakdownRow}>
              <Text style={styles.breakdownLabel}>Credit Hours:</Text>
              <Text style={styles.breakdownValue}>
                {mockData.totalSemesterCredits}
              </Text>
            </View>
            <View style={styles.breakdownRow}>
              <View style={styles.gradeBadge}>
                <Ionicons name="trending-up" size={16} color="#10B981" />
                <Text style={styles.breakdownLabel}>Best Grade:</Text>
              </View>
              <Text style={styles.breakdownValue}>
                {mockData.highestGrade.grade} ({mockData.highestGrade.course})
              </Text>
            </View>
            <View style={styles.breakdownRow}>
              <View style={styles.gradeBadge}>
                <Ionicons name="trending-down" size={16} color="#EF4444" />
                <Text style={styles.breakdownLabel}>Weakest Grade:</Text>
              </View>
              <Text style={styles.breakdownValue}>
                {mockData.lowestGrade.grade} ({mockData.lowestGrade.course})
              </Text>
            </View>
          </View>
        </View>

        {/* Section 4: Contribution Insight */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Why Your CWA Moved</Text>
          <View style={styles.insightCard}>
            <Ionicons name="bulb-outline" size={24} color="#9B0E10" />
            <View style={styles.insightContent}>
              <Text style={styles.insightText}>
                This semester contributes{" "}
                <Text style={styles.insightHighlight}>
                  {mockData.contributionPercentage}%
                </Text>{" "}
                of your total academic weight.
              </Text>
              <Text style={styles.insightSubtext}>
                {mockData.contributionExplanation}
              </Text>
            </View>
          </View>
        </View>

        {/* Section 4.5: Weighted Contribution Breakdown (Bar Chart) */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Weighted Contribution Breakdown</Text>
          <View style={styles.chartCard}>
            <View style={styles.chartContainer}>
              {courseContributions.length > 0 ? (
                courseContributions.map((course, index) => (
                  <View key={`${course.course}-${index}`} style={styles.chartBarWrapper}>
                    <View style={styles.chartBarHeader}>
                      <View style={styles.chartBarLabelContainer}>
                        <Text style={styles.chartBarCourseName}>
                          {course.course}
                        </Text>
                        {course.isAnchor && (
                          <View style={styles.anchorBadge}>
                            <Ionicons
                              name="star"
                              size={12}
                              color="#9B0E10"
                            />
                            <Text style={styles.anchorBadgeText}>Anchor</Text>
                          </View>
                        )}
                      </View>
                      <Text style={styles.chartBarPercentage}>
                        {course.impactPercentage.toFixed(1)}%
                      </Text>
                    </View>
                    <View style={styles.chartBarTrack}>
                      <View
                        style={[
                          styles.chartBarFill,
                          {
                            width: `${Math.min(course.visualPercentage, 100)}%`,
                            backgroundColor:
                              course.isAnchor ? "#9B0E10" : "#C80D10",
                          },
                        ]}
                      />
                    </View>
                    <View style={styles.chartBarFooter}>
                      <Text style={styles.chartBarScore}>
                        Expected: {course.expectedScore.toFixed(1)}%
                      </Text>
                      <Text style={styles.chartBarCredits}>
                        {course.credits} credits
                      </Text>
                    </View>
                  </View>
                ))
              ) : (
                <Text style={styles.chartBarCourseName}>No courses available</Text>
              )}
            </View>
            <View style={styles.chartExplanation}>
              <Ionicons name="information-circle-outline" size={20} color="#9B0E10" />
              <Text style={styles.chartExplanationText}>
                {mockData.anchorCourseExplanation}
              </Text>
            </View>
          </View>
        </View>

        {/* Section 4.6: What-If Insights */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>What-If Insights</Text>
          <View style={styles.whatIfInsightsCard}>
            {mockData.whatIfScenarios.map((scenario, index) => (
              <View key={index} style={styles.whatIfInsightItem}>
                <View
                  style={[
                    styles.whatIfInsightIcon,
                    scenario.isPositive
                      ? styles.whatIfInsightIconPositive
                      : styles.whatIfInsightIconNegative,
                  ]}
                >
                  <Ionicons
                    name={
                      scenario.type === "anchor_sensitivity"
                        ? "warning-outline"
                        : scenario.type === "effort_payoff"
                        ? "trending-up-outline"
                        : "information-circle-outline"
                    }
                    size={18}
                    color={
                      scenario.isPositive ? "#10B981" : "#EF4444"
                    }
                  />
                </View>
                <View style={styles.whatIfInsightContent}>
                  <Text style={styles.whatIfInsightText}>
                    {scenario.message.split("**").map((part, i) =>
                      i % 2 === 1 ? (
                        <Text
                          key={i}
                          style={styles.whatIfInsightHighlight}
                        >
                          {part}
                        </Text>
                      ) : (
                        part
                      )
                    )}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Section 5: High Impact Courses */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Courses with Highest Impact</Text>
          {mockData.highImpactCourses && mockData.highImpactCourses.length > 0 ? (
            mockData.highImpactCourses.map((course, index) => (
            <View key={course.course} style={styles.courseCard}>
              <View style={styles.courseRank}>
                <Text style={styles.courseRankNumber}>{index + 1}</Text>
              </View>
              <View style={styles.courseInfo}>
                <Text style={styles.courseName}>{course.course}</Text>
                <Text style={styles.courseCredits}>
                  {course.credits} credits
                </Text>
              </View>
              <View style={styles.courseImpact}>
                <View
                  style={[
                    styles.impactBadge,
                    course.impact === "High"
                      ? styles.impactBadgeHigh
                      : course.impact === "Medium"
                        ? styles.impactBadgeMedium
                        : styles.impactBadgeLow,
                  ]}
                >
                  <Text style={styles.impactBadgeText}>
                    {course.impact} impact
                  </Text>
                </View>
                <Text style={styles.impactValue}>
                  +{course.impactValue.toFixed(2)} CWA per grade improvement
                </Text>
              </View>
            </View>
            ))
          ) : (
            <View style={styles.courseCard}>
              <Text style={styles.courseName}>No courses available</Text>
            </View>
          )}
        </View>


        {/* Section 7: Insight / Advice Card */}
        <View style={styles.section}>
          <View style={styles.adviceCard}>
            <Ionicons
              name="chatbubble-ellipses-outline"
              size={24}
              color="#9B0E10"
            />
            <Text style={styles.adviceText}>{mockData.insight}</Text>
          </View>
        </View>

        {/* Section 8: Actions */}
        <View style={styles.actionsContainer}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="create-outline" size={20} color="#9B0E10" />
            <Text style={styles.actionButtonText}>Edit Courses</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => {
              // Navigate to target adjustment
            }}
          >
            <Ionicons name="flag-outline" size={20} color="#9B0E10" />
            <Text style={styles.actionButtonText}>Adjust Target CWA</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, styles.actionButtonSecondary]}
            onPress={() => {
              // Future: Simulate another scenario
            }}
          >
            <Ionicons name="calculator-outline" size={20} color="#9B0E10" />
            <Text style={styles.actionButtonText}>
              Simulate Another Scenario
            </Text>
          </TouchableOpacity>
        </View>
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
    paddingHorizontal: 20,
    paddingVertical: 24,
    gap: 24,
  },
  // Hero Section Styles
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
    alignItems: "center",
  },
  heroImage: {
    borderRadius: 24,
  },
  heroHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 16,
  },
  heroIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
  },
  heroSubtitle: {
    fontSize: 14,
    color: "#6B4D4D",
    fontWeight: "500",
  },
  cwaDisplay: {
    flexDirection: "row",
    alignItems: "baseline",
    justifyContent: "center",
    gap: 12,
    marginBottom: 12,
  },
  cwaValue: {
    fontSize: 56,
    fontWeight: "800",
    color: "#2D0A0A",
    letterSpacing: -1,
  },
  changeIndicator: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    backgroundColor: "#FFFFFF",
  },
  changePositive: {
    backgroundColor: "#ECFDF5",
  },
  changeNegative: {
    backgroundColor: "#FEF2F2",
  },
  changeText: {
    fontSize: 16,
    fontWeight: "700",
  },
  changeTextPositive: {
    color: "#10B981",
  },
  changeTextNegative: {
    color: "#EF4444",
  },
  statusText: {
    fontSize: 15,
    color: "#4F3C3C",
    textAlign: "center",
    fontWeight: "500",
  },
  // Target Card Styles
  targetCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
    gap: 16,
  },
  targetHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  targetTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#2D0A0A",
  },
  targetContent: {
    flexDirection: "row",
    alignItems: "baseline",
    gap: 8,
  },
  targetLabel: {
    fontSize: 14,
    color: "#6B4D4D",
    fontWeight: "500",
  },
  targetValue: {
    fontSize: 24,
    fontWeight: "700",
    color: "#9B0E10",
  },
  targetResult: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  targetStatusText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#2D0A0A",
  },
  gapText: {
    fontSize: 14,
    color: "#4F3C3C",
    lineHeight: 20,
  },
  progressContainer: {
    marginTop: 8,
  },
  progressLabels: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  progressLabelContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  progressLabelDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  progressLabel: {
    fontSize: 11,
    fontWeight: "500",
  },
  progressLabelValue: {
    fontSize: 11,
    fontWeight: "700",
    marginLeft: 4,
  },
  progressTrack: {
    height: 8,
    backgroundColor: "#F2C8C8",
    borderRadius: 4,
    position: "relative",
  },
  progressMarker: {
    position: "absolute",
    top: -2,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#9B0E10",
    borderWidth: 2,
    borderColor: "#FFFFFF",
  },
  progressMarkerPredicted: {
    backgroundColor: "#3B82F6",
  },
  progressMarkerTarget: {
    backgroundColor: "#10B981",
  },
  // Section Styles
  section: {
    gap: 14,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#2D0A0A",
  },
  // Breakdown Card Styles
  breakdownCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 18,
    gap: 14,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },
  breakdownRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  breakdownLabel: {
    fontSize: 14,
    color: "#4F3C3C",
    fontWeight: "500",
  },
  breakdownValue: {
    fontSize: 15,
    color: "#2D0A0A",
    fontWeight: "600",
  },
  gradeBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  // Insight Card Styles
  insightCard: {
    flexDirection: "row",
    backgroundColor: "#FFF8F8",
    borderRadius: 16,
    padding: 18,
    gap: 14,
    alignItems: "flex-start",
  },
  insightContent: {
    flex: 1,
    gap: 8,
  },
  insightText: {
    fontSize: 15,
    color: "#4F3C3C",
    lineHeight: 22,
  },
  insightHighlight: {
    fontWeight: "700",
    color: "#9B0E10",
  },
  insightSubtext: {
    fontSize: 13,
    color: "#6B4D4D",
    lineHeight: 18,
    fontStyle: "italic",
  },
  // Bar Chart Styles
  chartCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 18,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
    gap: 20,
  },
  chartContainer: {
    gap: 16,
  },
  chartBarWrapper: {
    gap: 8,
  },
  chartBarHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  chartBarLabelContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    flex: 1,
  },
  chartBarCourseName: {
    fontSize: 14,
    fontWeight: "600",
    color: "#2D0A0A",
  },
  anchorBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    backgroundColor: "#FFF1F1",
  },
  anchorBadgeText: {
    fontSize: 10,
    fontWeight: "700",
    color: "#9B0E10",
  },
  chartBarPercentage: {
    fontSize: 13,
    fontWeight: "700",
    color: "#9B0E10",
  },
  chartBarTrack: {
    height: 12,
    backgroundColor: "#F2C8C8",
    borderRadius: 6,
    overflow: "hidden",
  },
  chartBarFill: {
    height: "100%",
    borderRadius: 6,
  },
  chartBarFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  chartBarScore: {
    fontSize: 12,
    color: "#6B4D4D",
    fontWeight: "500",
  },
  chartBarCredits: {
    fontSize: 11,
    color: "#8B7A7A",
  },
  chartExplanation: {
    flexDirection: "row",
    gap: 12,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "#F2C8C8",
    alignItems: "flex-start",
  },
  chartExplanationText: {
    flex: 1,
    fontSize: 14,
    color: "#4F3C3C",
    lineHeight: 20,
  },
  // What-If Insights Styles
  whatIfInsightsCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 18,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
    gap: 14,
  },
  whatIfInsightItem: {
    flexDirection: "row",
    gap: 12,
    alignItems: "flex-start",
  },
  whatIfInsightIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 2,
  },
  whatIfInsightIconPositive: {
    backgroundColor: "#ECFDF5",
  },
  whatIfInsightIconNegative: {
    backgroundColor: "#FEF2F2",
  },
  whatIfInsightContent: {
    flex: 1,
  },
  whatIfInsightText: {
    fontSize: 14,
    color: "#4F3C3C",
    lineHeight: 20,
  },
  whatIfInsightHighlight: {
    fontWeight: "700",
    color: "#9B0E10",
  },
  // Course Card Styles
  courseCard: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    gap: 12,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },
  courseRank: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#FFF1F1",
    alignItems: "center",
    justifyContent: "center",
  },
  courseRankNumber: {
    fontSize: 14,
    fontWeight: "700",
    color: "#9B0E10",
  },
  courseInfo: {
    flex: 1,
    gap: 4,
  },
  courseName: {
    fontSize: 15,
    fontWeight: "600",
    color: "#2D0A0A",
  },
  courseCredits: {
    fontSize: 12,
    color: "#6B4D4D",
  },
  courseImpact: {
    alignItems: "flex-end",
    gap: 4,
  },
  impactBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  impactBadgeHigh: {
    backgroundColor: "#FEE2E2",
  },
  impactBadgeMedium: {
    backgroundColor: "#FEF3C7",
  },
  impactBadgeLow: {
    backgroundColor: "#E0E7FF",
  },
  impactBadgeText: {
    fontSize: 11,
    fontWeight: "600",
    color: "#2D0A0A",
  },
  impactValue: {
    fontSize: 11,
    color: "#6B4D4D",
    fontWeight: "500",
  },
  // What If Insights Styles
  whatIfCard: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 18,
    gap: 14,
    alignItems: "flex-start",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
    marginBottom: 12,
  },
  whatIfContent: {
    flex: 1,
  },
  whatIfText: {
    fontSize: 15,
    color: "#4F3C3C",
    lineHeight: 22,
  },
  whatIfHighlight: {
    fontWeight: "700",
    color: "#9B0E10",
  },
  // Advice Card Styles
  adviceCard: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 18,
    gap: 14,
    alignItems: "flex-start",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  adviceText: {
    flex: 1,
    fontSize: 15,
    color: "#4F3C3C",
    lineHeight: 22,
    fontStyle: "italic",
  },
  // Actions Styles
  actionsContainer: {
    gap: 12,
    paddingBottom: 20,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    paddingVertical: 16,
    paddingHorizontal: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1.5,
    borderColor: "#9B0E10",
  },
  actionButtonSecondary: {
    borderColor: "#F2C8C8",
    backgroundColor: "#FFF8F8",
  },
  actionButtonText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#9B0E10",
  },
});
