import { StatusBar } from "expo-status-bar";
import { useFonts } from "expo-font";
import { StyleSheet, Text, View } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Provider } from "react-redux";
import { store } from "./src/store/store";

import "./global.css";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";
import StartScreen from "./src/screens/StartScreen";
import Onboarding from "./src/components/Onboarding";
import HomeScreen from "./src/screens/HomeScreen";
import AuthContextProvider, { AuthContext } from "./Store/AuthContext";
import { useContext, useEffect, useState, useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SplashScreen from "expo-splash-screen";
import Testing from "./src/screens/SignUp";
import SignUp from "./src/screens/SignUp";
import Login from "./src/screens/Login";
import ForgotPasswordScreen from "./src/screens/ForgotPasswordScreen";
import { Ionicons } from "@expo/vector-icons";
import MapScreen from "./src/screens/MapScreen";
import CWAScreen from "./src/screens/CWAScreen";
import ExploreScreen from "./src/screens/ExploreScreen";
import ArticlesScreen from "./src/screens/ArticlesScreen";
import ArticleScreen from "./src/screens/ArticleScreen";
import SettingsScreen from "./src/screens/SettingsScreen";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { setUserInfo } from "./src/store/features/userSlice";
import ProfileDetailsScreen from "./src/screens/ProfileDetailsScreen";
import HelpFAQScreen from "./src/screens/HelpFAQScreen";
import ReportProblemScreen from "./src/screens/ReportProblemScreen";
import ContactSupportScreen from "./src/screens/ContactSupportScreen";
import AboutApplicationScreen from "./src/screens/AboutApplicationScreen";
import RateAppScreen from "./src/screens/RateAppScreen";
import ReferralSystemScreen from "./src/screens/ReferralSystemScreen";
import LocationPlacesScreen from "./src/screens/LocationPlacesScreen";
import SearchScreen from "./src/screens/SearchScreen";
import SemesterCalculatorScreen from "./src/screens/SemesterCalculatorScreen";
import SemesterCalculator from "./src/screens/SemesterCalculator";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

const Stack = createNativeStackNavigator();

const queryClient = new QueryClient();

function AuthStack() {
  const [isLoading, setIsLoading] = useState(true);
  const [showOnboarding, setShowOnboarding] = useState(false);

  useEffect(() => {
    const checkOnboardingStatus = async () => {
      try {
        const value = await AsyncStorage.getItem("@onboarding_complete");
        if (value === "true") {
          setShowOnboarding(false);
        } else {
          setShowOnboarding(true);
        }
      } catch (e) {
        // console.error("Error reading onboarding status:", e);
        setShowOnboarding(true); // fallback to showing onboarding
      } finally {
        setIsLoading(false);
      }
    };

    checkOnboardingStatus();
  }, []);
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="StartScreen"
        component={StartScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="OnBoarding"
        component={Onboarding}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="SignUp"
        component={SignUp}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="Login"
        component={Login}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ForgotPasswordScreen"
        component={ForgotPasswordScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}
const Tab = createBottomTabNavigator();

function TabNavigator() {
  const insets = useSafeAreaInsets(); // 👈 get dynamic bottom inses
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: "#9B0E10", // active color
        tabBarInactiveTintColor: "#888", // inactive color
        tabBarStyle: {
          backgroundColor: "#ffffff", // tab bar background
          borderTopWidth: 1,
          borderTopColor: "#881416",
          height: 60 + insets.bottom, // 👈 dynamically adjust height
          paddingBottom: 10 + insets.bottom, // 👈 ensure tab items lift up
        },
        tabBarLabelStyle: {
          fontSize: 12,
          paddingBottom: 8,
        },
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === "Home") {
            iconName = focused ? "home" : "home-outline";
          } else if (route.name === "Locations") {
            iconName = focused ? "map" : "map-outline";
          } else if (route.name === "Guides") {
            iconName = focused ? "book" : "book-outline";
          } else if (route.name === "Settings") {
            iconName = focused ? "settings" : "settings-outline";
          } else if (route.name === "CWA ") {
            iconName = focused ? "calculator" : "calculator-outline";
          }

          return <Ionicons name={iconName} size={20} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Locations" component={MapScreen} />
      <Tab.Screen name="CWA " component={CWAScreen} />

      <Tab.Screen name="Guides" component={ExploreScreen} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
  );
}

function AuthenticatedStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="MainTabs" component={TabNavigator} />
      <Stack.Screen name="Search" component={SearchScreen} />
      <Stack.Screen name="Articles" component={ArticlesScreen} />
      <Stack.Screen name="Article" component={ArticleScreen} />
      <Stack.Screen name="LocationPlaces" component={LocationPlacesScreen} />
      <Stack.Screen name="ProfileDetails" component={ProfileDetailsScreen} />
      <Stack.Screen name="HelpFAQ" component={HelpFAQScreen} />
      <Stack.Screen name="ReportProblem" component={ReportProblemScreen} />
      <Stack.Screen name="ContactSupport" component={ContactSupportScreen} />
      <Stack.Screen name="CWACalculator" component={SemesterCalculatorScreen} />
      <Stack.Screen name="SemCalc" component={SemesterCalculator} />

      <Stack.Screen
        name="AboutApplication"
        component={AboutApplicationScreen}
      />
      <Stack.Screen name="RateApp" component={RateAppScreen} />
      <Stack.Screen name="ReferralSystem" component={ReferralSystemScreen} />
    </Stack.Navigator>
  );
}

function Navigation() {
  const authCtx = useContext(AuthContext);

  return (
    <NavigationContainer>
      {!authCtx.isAuthenticated && <AuthStack />}
      {authCtx.isAuthenticated && <AuthenticatedStack />}
    </NavigationContainer>
  );
}

function Root() {
  const [isTryingLogin, setIsTryingLogin] = useState(true);
  const authCtx = useContext(AuthContext);
  const dispatch = useDispatch();

  useEffect(() => {
    async function initializeApp() {
      try {
        const storedToken = await AsyncStorage.getItem("token");
        const storedUserData = await AsyncStorage.getItem("user");

        if (storedToken) {
          authCtx.authenticate(storedToken);

          // Rehydrate Redux from AsyncStorage
          if (storedUserData) {
            const userData = JSON.parse(storedUserData);
            dispatch(setUserInfo(userData));
            // console.log("✅ Redux rehydrated from AsyncStorage:", userData);
          }
        }
      } catch (e) {
        // console.warn("Error initializing app:", e);
      } finally {
        setIsTryingLogin(false);
      }
    }

    initializeApp();
  }, []);

  const onLayoutRootView = useCallback(async () => {
    if (!isTryingLogin) {
      await SplashScreen.hideAsync();
    }
  }, [isTryingLogin]);

  if (isTryingLogin) {
    return null;
  }

  return (
    <View style={{ flex: 1 }} onLayout={onLayoutRootView}>
      <Navigation />
    </View>
  );
}

export default function App() {
  const [fontsLoaded] = useFonts({
    "Roboto-Bold": require("./assets/fonts/Roboto-Bold.ttf"),
    "OpenSans-Regular": require("./assets/fonts/OpenSans-Regular.ttf"),
  });

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <BottomSheetModalProvider>
        <Provider store={store}>
          <QueryClientProvider client={queryClient}>
            <View style={{ flex: 1 }} onLayout={onLayoutRootView}>
              <StatusBar style="dark" />
              <AuthContextProvider>
                <Root />
              </AuthContextProvider>
            </View>
          </QueryClientProvider>
        </Provider>
      </BottomSheetModalProvider>
    </GestureHandlerRootView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: "red",
    alignItems: "center",
    justifyContent: "center",
  },
});
