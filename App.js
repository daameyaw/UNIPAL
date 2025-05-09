import { StatusBar } from "expo-status-bar";
import { useFonts } from "expo-font";
import { StyleSheet, Text, View } from "react-native";
import "./global.css";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";
import StartScreen from "./src/screens/StartScreen";
import Onboarding from "./src/components/Onboarding";
import SignupSigninScreen from "./src/screens/SignupSigninScreen";
import SignUpScreen from "./src/screens/SignUpScreen";
import LoginScreen from "./src/screens/LoginScreen";
import CompleteSignUpScreen from "./src/screens/CompleteSignUpScreen";
import HomeScreen from "./src/screens/HomeScreen";
import AuthContextProvider, { AuthContext } from "./Store/AuthContext";
import { useContext, useEffect, useState, useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SplashScreen from "expo-splash-screen";

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

const Stack = createNativeStackNavigator();

function AuthStack() {
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
        name="SignupSigninScreen"
        component={SignupSigninScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="SignUpScreen"
        component={SignUpScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="LoginScreen"
        component={LoginScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="CompleteSignUpScreen"
        component={CompleteSignUpScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}

function AuthenticatedStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{ headerShown: false }}
      />
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

  useEffect(() => {
    async function fetchToken() {
      try {
        const storedToken = await AsyncStorage.getItem("token");

        if (storedToken) {
          authCtx.authenticate(storedToken);
        }
      } catch (e) {
        console.warn(e);
      } finally {
        setIsTryingLogin(false);
      }
    }
    fetchToken();
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
    <View style={{ flex: 1 }} onLayout={onLayoutRootView}>
      <StatusBar style="dark" />
      <AuthContextProvider>
        <Root />
      </AuthContextProvider>
    </View>
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
