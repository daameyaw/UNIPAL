import { Ionicons } from "@expo/vector-icons";
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetScrollView,
} from "@gorhom/bottom-sheet";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  Alert,
  FlatList,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { saveData, getData } from "../store/storage";
import { StatusBar } from "expo-status-bar";
import { useFocusEffect, useNavigation } from "@react-navigation/native";

/**
 * SemesterCalculator Component
 *
 * Main component for the Semester Calculator screen. This component allows users to:
 * - Set and track their current and target CWA (Cumulative Weighted Average) goals
 * - Add, edit, and delete courses for the current semester
 * - View course details including course code, name, credit hours, target score, and letter grade
 * - Calculate semester CWA based on course data (calculation functionality pending)
 *
 * The component uses bottom sheet modals for user input and manages state for:
 * - Course list (array of course objects)
 * - CWA goals (current and target values)
 * - Form inputs for adding/editing courses
 * - Modal visibility states
 *
 * @returns {JSX.Element} The rendered Semester Calculator screen component
 */
export default function SemesterCalculator() {
  const navigation = useNavigation();

  const [courses, setCourses] = useState([]);
  const isCalculateDisabled = courses.length <= 3;

  const [currentCWA, setCurrentCWA] = useState(null);
  const [targetCWA, setTargetCWA] = useState(null);

  const [cumulativeCreditHours, setCumulativeCreditHours] = useState(null);

  // Temporary sheet values
  const [tempCurrent, setTempCurrent] = useState("");
  const [tempTarget, setTempTarget] = useState("");

  const [courseCode, setCourseCode] = useState("");
  const [courseName, setCourseName] = useState("");
  const [creditHours, setCreditHours] = useState("");
  const [targetScore, setTargetScore] = useState("");

  const [editingCourseId, setEditingCourseId] = useState(null);

  const [isLoaded, setIsLoaded] = useState(false);

  const isSaveDisabled = !tempCurrent || !tempTarget;
  const isSaveCourseDisabled =
    !courseCode || !courseName || !creditHours || !targetScore;

  // Load CWA data function (reusable)
  const loadCWAData = useCallback(async () => {
    try {
      const savedCWA = await getData("cwa");
      if (savedCWA) {
        setCurrentCWA(savedCWA.currentCWA);
        setTargetCWA(savedCWA.targetCWA);
        setCumulativeCreditHours(savedCWA.cumulativeCreditHours);
      }
    } catch (error) {
      console.error("Error loading CWA data:", error);
    }
  }, []);

  useEffect(() => {
    const loadData = async () => {
      try {
        // Load courses
        const savedCourses = await getData("semester_courses");
        if (savedCourses) {
          console.log("courses loaded from storage:", savedCourses);
          setCourses(savedCourses);
        } else {
          console.log("courses not available");
        }

        // Load CWA
        await loadCWAData();

        setIsLoaded(true);
      } catch (error) {
        console.error("Error loading data:", error);
        setIsLoaded(true);
      }
    };

    loadData();
  }, [loadCWAData]);

  // Reload CWA data when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      if (isLoaded) {
        loadCWAData();
      }
    }, [isLoaded, loadCWAData])
  );

  // SAVE COURSES ASYNC STORAGE
  useEffect(() => {
    if (!isLoaded) return;
    const persistCourses = async () => {
      await saveData("semester_courses", courses);
      console.log("saved courses to storage:", courses);
    };

    persistCourses();
  }, [courses, isLoaded]);

  //SAVE CWA TO ASYNC STORAGE
  useEffect(() => {
    if (!isLoaded) return;
    const persistCWA = async () => {
      await saveData("cwa", {
        currentCWA,
        targetCWA,
        cumulativeCreditHours,
      });
      console.log("saved cwa to storage:", { currentCWA, targetCWA, cumulativeCreditHours });
    };

    persistCWA();
  }, [currentCWA, targetCWA, cumulativeCreditHours, isLoaded]);

  /**
   * handleCurrentCWAChange
   *
   * Validates and updates the current CWA input value.
   * Only allows numeric values that are less than or equal to 100.
   *
   * @param {string} text - The input text from the TextInput
   *
   * Behavior:
   * - Allows empty string (for clearing the field)
   * - Allows numeric input including decimals
   * - Rejects values greater than 100
   * - Only updates state if the value is valid
   *
   * @returns {void}
   */
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

  /**
   * handleTargetCWAChange
   *
   * Validates and updates the target CWA input value.
   * Only allows numeric values that are less than or equal to 100.
   *
   * @param {string} text - The input text from the TextInput
   *
   * Behavior:
   * - Allows empty string (for clearing the field)
   * - Allows numeric input including decimals
   * - Rejects values greater than 100
   * - Only updates state if the value is valid
   *
   * @returns {void}
   */
  const handleTargetCreditHoursChange = (text) => {
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
    // if (numValue <= 100) {
      setTempTarget(text);
    // }
  };

  /**
   * handleTargetScoreChange
   *
   * Validates and updates the target score input value.
   * Only allows numeric values that are less than or equal to 100.
   *
   * @param {string} text - The input text from the TextInput
   *
   * Behavior:
   * - Allows empty string (for clearing the field)
   * - Allows numeric input including decimals
   * - Rejects values greater than 100
   * - Only updates state if the value is valid
   *
   * @returns {void}
   */
  const handleTargetScoreChange = (text) => {
    // Allow empty string
    if (text === "") {
      setTargetScore("");
      return;
    }

    // Check if it's a valid number (including decimals)
    const numValue = parseFloat(text);
    if (isNaN(numValue)) {
      return; // Don't update if not a valid number
    }

    // Check if value is <= 100
    if (numValue <= 100) {
      setTargetScore(text);
    }
  };

  const courseRef = useRef(null);

  const CWARef = useRef(null);

  /**
   * openCourseModal
   *
   * Opens the bottom sheet modal for adding or editing a course.
   * This function is memoized using useCallback to prevent unnecessary re-renders.
   *
   * Behavior:
   * - Calls the present() method on the courseRef to display the bottom sheet
   * - Uses optional chaining (?.) to safely handle cases where the ref might be null
   * - Logs a debug message to console for development purposes
   *
   * @returns {void}
   */
  const openCourseModal = useCallback(() => {
    console.log("openSheet called");

    courseRef.current?.present();
  }, []);

  /**
   * closeCourseModal
   *
   * Closes the bottom sheet modal for course input.
   *
   * Behavior:
   * - Calls the dismiss() method on the courseRef to hide the bottom sheet
   * - Uses optional chaining (?.) to safely handle cases where the ref might be null
   * - Note: This function does not reset form fields; that should be handled
   *   separately when opening the modal for a new course
   *
   * @returns {void}
   */
  const closeCourseModal = () => {
    courseRef.current?.dismiss();
  };

  /**
   * openCWAModal
   *
   * Opens the bottom sheet modal for setting or editing CWA (Cumulative Weighted Average) goals.
   * This function is memoized using useCallback to prevent unnecessary re-renders.
   *
   * Behavior:
   * - Populates temporary input fields with existing CWA values (if any)
   * - Calls the present() method on the CWARef to display the bottom sheet
   * - Uses optional chaining (?.) to safely handle cases where the ref might be null
   * - Logs a debug message to console for development purposes
   * - The modal allows users to input their current CWA and target CWA values
   *
   * @returns {void}
   */
  const openCWAModal = useCallback(() => {
    console.log("openSheet called");

    // Populate temp values with existing state values
    setTempCurrent(currentCWA !== null && currentCWA !== undefined ? currentCWA.toString() : "");
    setTempTarget(cumulativeCreditHours !== null && cumulativeCreditHours !== undefined ? cumulativeCreditHours.toString() : "");

    CWARef.current?.present();
  }, [currentCWA, cumulativeCreditHours]);

  /**
   * closeCWAModal
   *
   * Closes the bottom sheet modal for CWA goal input.
   *
   * Behavior:
   * - Calls the dismiss() method on the CWARef to hide the bottom sheet
   * - Uses optional chaining (?.) to safely handle cases where the ref might be null
   * - Note: This function does not save or reset temporary values; that is handled
   *   by handleSaveGoals or handleResetGoals functions
   *
   * @returns {void}
   */
  const closeCWAModal = () => {
    CWARef.current?.dismiss();
  };

  const snapPoints = useMemo(() => ["80%", "81%"], []);

  /**
   * renderBackdrop
   *
   * Renders a backdrop component that dims the background when a bottom sheet modal is open.
   * This provides visual feedback to users that a modal is active and helps focus attention
   * on the modal content.
   *
   * @param {Object} props - Props passed from the BottomSheetModal component
   * @param {Object} props.animatedIndex - Animated value representing the sheet's position
   * @param {Object} props.style - Style object for the backdrop
   *
   * Behavior:
   * - disappearsOnIndex={-1}: Backdrop disappears when sheet is at index -1 (closed)
   * - appearsOnIndex={0}: Backdrop appears when sheet is at index 0 (first snap point)
   * - Spreads all props to the BottomSheetBackdrop component for proper integration
   *
   * @returns {JSX.Element} The rendered BottomSheetBackdrop component
   */
  const renderBackdrop = (props) => (
    <BottomSheetBackdrop {...props} disappearsOnIndex={-1} appearsOnIndex={0} />
  );

  /**
   * handleSheetChange
   *
   * Callback function that is triggered whenever a bottom sheet modal changes its position
   * (opens, closes, or moves between snap points).
   *
   * This function is memoized using useCallback to prevent unnecessary re-renders.
   * Currently used for debugging purposes to track sheet state changes.
   *
   * @param {number} index - The current snap point index of the bottom sheet
   *                         -1 indicates the sheet is closed
   *                         0, 1, etc. indicate which snap point the sheet is at
   *
   * Behavior:
   * - Logs the sheet index to console for debugging
   * - Can be extended to handle side effects based on sheet state (e.g., resetting
   *   form fields when sheet closes, saving draft data, etc.)
   *
   * @returns {void}
   */
  const handleSheetChange = useCallback((index) => {
    console.log("handleSheetChange", index);
  }, []);

  /**
   * handleResetGoals
   *
   * Resets all CWA goal-related temporary input values and clears the saved target CWA.
   * This function is called when the user clicks the trash/reset button in the CWA goals modal.
   *
   * This function is memoized using useCallback to prevent unnecessary re-renders.
   *
   * Behavior:
   * - Clears the temporary current CWA input (tempCurrent)
   * - Clears the temporary target CWA input (tempTarget)
   * - Clears the saved target CWA value (targetCWA)
   * - Note: This does NOT clear currentCWA, only targetCWA
   * - Note: This does NOT close the modal; user must manually close it
   *
   * @returns {void}
   */
  const handleResetGoals = useCallback(() => {
    setTempCurrent("");
    setTempTarget("");
  }, []);

  /**
   * handleSaveGoals
   *
   * Saves the CWA goals entered by the user in the modal to the component's state.
   * This function validates that both fields are filled before saving and automatically
   * closes the modal after a successful save.
   *
   * This function is memoized using useCallback with dependencies on validation state
   * and input values to ensure it updates when these change.
   *
   * Behavior:
   * - Early returns if save is disabled (isSaveDisabled is true, meaning either
   *   tempCurrent or tempTarget is empty)
   * - Converts string inputs to numbers using Number() constructor
   * - Updates currentCWA state with the converted tempCurrent value
   * - Updates targetCWA state with the converted tempTarget value
   * - Automatically dismisses the CWA modal after saving
   * - Uses optional chaining to safely handle null ref
   *
   * Side Effects:
   * - Updates currentCWA and targetCWA state, which triggers re-render
   * - Closes the bottom sheet modal
   * - May cause progress calculation to update if both values are now set
   *
   * @returns {void}
   */
  const handleSaveGoals = useCallback(() => {
    if (isSaveDisabled) return;

    setCurrentCWA(Number(tempCurrent));
    setCumulativeCreditHours(Number(tempTarget));

    CWARef.current?.dismiss();
  }, [isSaveDisabled, tempCurrent, tempTarget]);

  /**
   * handleSaveCourse
   *
   * Saves or updates a course in the courses array. This function handles both creating
   * new courses and updating existing ones based on whether editingCourseId is set.
   *
   * Behavior:
   * - Validates that all required fields (courseCode, courseName, creditHours, targetScore)
   *   are filled; returns early if any are missing
   * - If editingCourseId is set: Updates the existing course with matching ID
   * - If editingCourseId is null: Creates a new course with a unique ID (timestamp-based)
   * - Converts creditHours and targetScore from strings to numbers
   * - Resets all form fields to empty strings after saving
   * - Clears the editingCourseId to exit edit mode
   * - Automatically closes the course modal after saving
   *
   * Course Object Structure:
   * {
   *   id: string (unique identifier),
   *   courseCode: string,
   *   courseName: string,
   *   creditHours: number,
   *   targetScore: number (0-100)
   * }
   *
   * Side Effects:
   * - Updates the courses state array
   * - Resets form input states
   * - Closes the bottom sheet modal
   * - May enable/disable the Calculate CWA button based on course count
   *
   * @returns {void}
   */
  const handleSaveCourse = () => {
    if (!courseCode || !courseName || !creditHours || !targetScore) return;

    if (editingCourseId) {
      // Update existing course
      setCourses((prev) =>
        prev.map((course) =>
          course.id === editingCourseId
            ? {
                ...course,
                courseCode,
                courseName,
                creditHours: Number(creditHours),
                targetScore: Number(targetScore),
              }
            : course
        )
      );
    } else {
      // Create new course
      const newCourse = {
        id: Date.now().toString(),
        courseCode,
        courseName,
        creditHours: Number(creditHours),
        targetScore: Number(targetScore),
      };
      setCourses((prev) => [...prev, newCourse]);
    }

    // reset fields
    setCourseCode("");
    setCourseName("");
    setCreditHours("");
    setTargetScore("");
    setEditingCourseId(null);

    courseRef.current?.dismiss();
  };

  /**
   * editCourse
   *
   * Prepares the course form for editing by populating all input fields with the
   * selected course's data and opening the course modal in edit mode.
   *
   * @param {Object} course - The course object to edit
   * @param {string} course.id - Unique identifier for the course
   * @param {string} course.courseCode - Course code (e.g., "CS101")
   * @param {string} course.courseName - Full name of the course
   * @param {number} course.creditHours - Number of credit hours for the course
   * @param {number} course.targetScore - Target score (0-100) for the course
   *
   * Behavior:
   * - Populates courseCode state with the course's code
   * - Populates courseName state with the course's name
   * - Converts creditHours to string and populates the input field
   * - Converts targetScore to string and populates the input field
   * - Sets editingCourseId to the course's ID to indicate edit mode
   * - Opens the course modal by calling present() on the courseRef
   * - The modal title will change to "Edit Course" based on editingCourseId being set
   *
   * Side Effects:
   * - Updates all form input states
   * - Sets editing mode flag
   * - Opens the bottom sheet modal
   *
   * @returns {void}
   */
  const editCourse = (course) => {
    setCourseCode(course.courseCode);
    setCourseName(course.courseName);
    setCreditHours(course.creditHours.toString());
    setTargetScore(course.targetScore.toString());
    setEditingCourseId(course.id);
    courseRef.current?.present();
  };

  /**
   * getGrade
   *
   * Converts a numerical target score to a letter grade based on a standard grading scale.
   * This function uses a percentage-based grading system commonly used in academic institutions.
   *
   * @param {number|string} targetScore - The target score to convert to a letter grade.
   *                                     Can be a number or string that can be converted to a number.
   *
   * Grading Scale:
   * - A: 70% and above
   * - B: 60% to 69%
   * - C: 50% to 59%
   * - D: 40% to 49%
   * - F: Below 40%
   *
   * Behavior:
   * - Converts the input to a number using Number() constructor
   * - Returns "-" if the conversion results in NaN (invalid input)
   * - Uses a switch statement with case expressions to determine the grade
   * - Returns the appropriate letter grade based on the score range
   *
   * @returns {string} The letter grade ("A", "B", "C", "D", "F") or "-" for invalid input
   *
   * Example Usage:
   * getGrade(85) // returns "A"
   * getGrade(65) // returns "B"
   * getGrade("invalid") // returns "-"
   */

  function getGrade(targetScore) {
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
  }

  function getClass(currentCWA) {
    const score = Number(currentCWA);

    if (isNaN(score)) return "-";

    switch (true) {
      case score >= 70:
        return "First Class";
      case score >= 60:
        return "Second Class Upper";
      case score >= 50:
        return "Second Class Lower";
      default:
        return "Third Class";
    }
  }

  const currentClass = getClass(currentCWA);

  /**
   * getCwaProgress
   *
   * Calculates the progress percentage toward the target CWA goal.
   * This represents how close the user is to achieving their target CWA,
   * expressed as a percentage where 100% means the target has been reached.
   *
   * Behavior:
   * - Returns null if either currentCWA or targetCWA is not set (falsy)
   * - Converts both values to numbers to ensure proper mathematical operations
   * - Calculates progress as: (currentCWA / targetCWA) * 100
   * - The result can be greater than 100% if current CWA exceeds target
   * - The result can be less than 0% if current CWA is negative (edge case)
   *
   * Edge Cases:
   * - Returns null if either value is missing (prevents division by zero or invalid calculations)
   * - If targetCWA is 0, this would cause division by zero, but the null check prevents this
   *
   * @returns {number|null} The progress percentage (0-100+), or null if data is incomplete
   *
   * Example Usage:
   * getCwaProgress() with currentCWA=65 and targetCWA=70 // returns ~92.86%
   * getCwaProgress() with currentCWA=null // returns null
   */
  const getCwaProgress = () => {
    if (!currentCWA || !targetCWA) return null;

    const C = Number(currentCWA);
    const T = Number(targetCWA);

    return (C / T) * 100;
  };

  const hasCWA = currentCWA && cumulativeCreditHours;

  const progress = getCwaProgress();

  /**
   * deleteCourse
   *
   * Removes a course from the courses array by filtering out the course with the matching ID.
   * This function is called after the user confirms deletion in an Alert dialog.
   *
   * @param {string} id - The unique identifier of the course to delete
   *
   * Behavior:
   * - Uses the functional update form of setState to access the previous courses array
   * - Filters the courses array to exclude the course with the matching ID
   * - Creates a new array (immutable update pattern) without the deleted course
   * - Updates the courses state with the filtered array
   *
   * Side Effects:
   * - Updates the courses state, removing the specified course
   * - Triggers a re-render of the course list
   * - May disable the "Calculate CWA" button if course count drops to 3 or fewer
   * - The course will no longer appear in the FlatList
   *
   * Note: This function does not show a confirmation dialog. The confirmation is handled
   * in the renderCourseItem function before calling deleteCourse.
   *
   * @returns {void}
   *
   * Example Usage:
   * deleteCourse("1234567890") // Removes course with id "1234567890"
   */
  function deleteCourse(id) {
    setCourses((prevCourses) =>
      prevCourses.filter((course) => course.id !== id)
    );
  }

  /**
   * renderCourseItem
   *
   * Render function for individual course items in the FlatList. This function creates
   * a visual card component that displays all course information and provides actions
   * for editing and deleting the course.
   *
   * @param {Object} props - Props object from FlatList's renderItem
   * @param {Object} props.item - The course object to render (aliased as 'course')
   * @param {string} props.item.id - Unique identifier for the course
   * @param {string} props.item.courseCode - Course code (e.g., "CS101")
   * @param {string} props.item.courseName - Full name of the course
   * @param {number} props.item.creditHours - Number of credit hours
   * @param {number} props.item.targetScore - Target score (0-100)
   *
   * Component Structure:
   * - Header Row: Displays course code with credit hours, course name, and letter grade
   * - Divider: Visual separator between header and content
   * - Progress Bar: Visual representation of target score (0-100%)
   * - Bottom Row: Target score display and action buttons (edit/delete)
   *
   * Features:
   * - Displays course code and credit hours in format: "CS101 (3)"
   * - Shows course name in uppercase
   * - Displays letter grade (A-F) calculated from target score
   * - Visual progress bar showing target score as percentage
   * - Edit button: Opens modal with course data pre-filled
   * - Delete button: Shows confirmation alert before deletion
   *
   * Styling:
   * - Uses courseCard style for the main container
   * - Color scheme: Red theme (#9B0E10) for primary actions
   * - Light pink background (#FDECEC) for card
   * - Shadow effects for depth
   *
   * @returns {JSX.Element} A View component representing a single course card
   */

  // <View style={styles.courseCard}></View>;
  const renderCourseItem = ({ item: course }) => (
    <ImageBackground
      source={require("../../assets/images/card3.png")}
      style={styles.courseCard}
      imageStyle={{ borderRadius: 12 }}
      resizeMode="cover"
    >
      {/* Top Row: Code + Credit + Grade */}
      <View style={styles.headerRow}>
        <View>
          <Text style={styles.courseCode}>
            {course.courseCode} ({course.creditHours})
          </Text>
          <Text style={styles.courseName}>{course.courseName}</Text>
        </View>

        <Text style={styles.gradeText}>{getGrade(course.targetScore)}</Text>
      </View>

      {/* Divider */}
      <View style={styles.divider} />

      {/* Progress Bar */}
      <View style={styles.progressTrack1}>
        <View
          style={[
            styles.progressFill,
            { width: `${course.targetScore}%` }, // ex. 90
          ]}
        />
      </View>

      {/* Bottom Row: Target Score + Action Buttons */}
      <View style={styles.bottomRow}>
        <Text style={styles.targetText}>
          Target Score (
          <Text style={styles.targetScoreValue}>{course.targetScore}</Text>
          /100)
        </Text>

        <View style={styles.actions}>
          <TouchableOpacity onPress={() => editCourse(course)}>
            <View style={styles.actionIcon}>
              <Ionicons name="pencil" size={18} color="#9B0E10" />
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              Alert.alert(
                "Delete Course",
                `Are you sure you want to delete ${course.courseCode}?`,
                [
                  {
                    text: "Cancel",
                    style: "cancel",
                  },
                  {
                    text: "Delete",
                    style: "destructive",
                    onPress: () => deleteCourse(course.id),
                  },
                ]
              );
            }}
          >
            <View style={styles.actionIcon}>
              <Ionicons name="trash" size={18} color="#9B0E10" />
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  );

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "left", "right"]}>
      <StatusBar style="dark" />
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
                      {currentCWA}% ({currentClass})
                    </Text>
                  </Text>
                  <Text style={styles.statText}>
                    Cumulative Credit Hours:{" "}
                    <Text style={styles.statValue}>{cumulativeCreditHours}</Text>
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
            <FlatList
              data={courses}
              renderItem={renderCourseItem}
              keyExtractor={(item) => item.id}
              ListEmptyComponent={
                <Text style={styles.placeholderText}>
                  Add each course to estimate this semester&apos;s CWA.
                </Text>
              }
              scrollEnabled={false}
              contentContainerStyle={
                courses.length === 0 ? styles.emptyListContainer : undefined
              }
            />
          </View>
          <TouchableOpacity
            style={styles.addCourseButton}
            onPress={() => {
              // Reset form and editing state for new course
              setCourseCode("");
              setCourseName("");
              setCreditHours("");
              setTargetScore("");
              setEditingCourseId(null);
              openCourseModal();
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
            onPress={() => navigation.navigate("CWAResults", { courses , currentCWA, cumulativeCreditHours })}
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

        <BottomSheetModal
          ref={courseRef}
          snapPoints={snapPoints}
          enableDynamicSizing={false}
          enablePanDownToClose
          backdropComponent={renderBackdrop}
          keyboardBehavior="extend" // Change to "extend"
          keyboardBlurBehavior="restore"
          android_keyboardInputMode="adjustResize"
          onChange={handleSheetChange}
          // bottomInset={46}
        >
          <BottomSheetScrollView
            contentContainerStyle={styles.contentContainer}
            keyboardShouldPersistTaps="handled"
          >
            <Text style={styles.sheetTitle}>
              {editingCourseId ? "Edit Course" : "Add Course"}
            </Text>

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
                onChangeText={handleTargetScoreChange}
                placeholder="e.g. 80"
                style={styles.input}
                keyboardType="numeric"
              />
            </View>

            {/* Actions */}
            <View style={styles.actions}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => {
                  // Reset form and editing state
                  setCourseCode("");
                  setCourseName("");
                  setCreditHours("");
                  setTargetScore("");
                  setEditingCourseId(null);
                  closeCourseModal();
                }}
              >
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.saveCourseButton,
                  isSaveCourseDisabled && styles.saveCourseButtonDisabled,
                ]}
                disabled={isSaveCourseDisabled}
                onPress={handleSaveCourse}
              >
                <Text
                  style={[
                    styles.saveCourseText,
                    isSaveCourseDisabled && styles.saveCourseTextDisabled,
                  ]}
                >
                  {" "}
                  {editingCourseId ? "Update Course" : "Add Course"}
                </Text>
              </TouchableOpacity>
            </View>
          </BottomSheetScrollView>
        </BottomSheetModal>

        {/* Current Semester Overview Sheet */}
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
                <Text style={styles.inputLabel}>Cumulative Credit Hours</Text>
                <TextInput
                  style={styles.inputField}
                  placeholder="e.g. 120"
                  placeholderTextColor="#B9A7A7"
                  keyboardType="numeric"
                  value={tempTarget || ""}
                  onChangeText={handleTargetCreditHoursChange}
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
    borderWidth: 0.2,
    borderColor: "#5A4A4A",
    borderStyle: "dashed",
    padding: 18,
    // paddingTop: 0,
    justifyContent: "center",
  },
  placeholderText: {
    textAlign: "center",
    color: "#CBBFBF",
    fontSize: 14,
  },
  emptyListContainer: {
    flex: 1,
    justifyContent: "center",
    minHeight: 200,
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

  progressTrack1: {
    height: 4,
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
    marginTop: 10,
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
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 24,
    // width: "100%",
    //  paddingHorizontal: 16,
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
    alignItems: "center",
    justifyContent: "space-around",
    flex: 1,
  },

  saveCourseButtonDisabled: {
    backgroundColor: "#E7D5D5",
  },

  saveCourseText: {
    color: "#FFF",
    fontWeight: "700",
  },

  saveCourseTextDisabled: {
    color: "#C2A9A9",
  },
  courseCard: {
    // backgroundColor: "#FDECEC",
    // backgroundColor: "#ECD6D5",
    padding: 14,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },

  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  courseCode: {
    fontSize: 12,
    fontWeight: "600",
    color: "#9B0E10",
  },

  courseName: {
    fontSize: 15,
    fontWeight: "700",
    color: "#5A0505",
    marginTop: 2,
    textTransform: "uppercase",
  },

  gradeText: {
    fontSize: 35,
    fontWeight: "700",
    color: "#9B0E10",
    opacity: 0.75,
  },

  divider: {
    height: 1,
    backgroundColor: "#E3B4B4",
    marginVertical: 10,
  },

  progressTrack: {
    height: 10,
    backgroundColor: "#E8B7B7",
    borderRadius: 10,
    overflow: "hidden",
  },

  progressFill: {
    height: "100%",
    backgroundColor: "#9B0E10",
    borderRadius: 10,
  },

  bottomRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 12,
  },

  targetText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#9B0E10",
    fontStyle: "italic",
  },

  targetScoreValue: {
    fontSize: 24,
    fontWeight: "700",
    color: "#9B0E10",
  },

  actions: {
    flexDirection: "row",
    gap: 14,
  },

  actionIcon: {
    backgroundColor: "#F9D9D9",
    padding: 8,
    borderRadius: 50,
  },
});
