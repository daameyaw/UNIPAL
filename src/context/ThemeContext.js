import React, { createContext, useState, useEffect, useMemo } from "react";
import { Appearance } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const lightTheme = {
  mode: "light",
  background: "#fff",
  text: "#222",
  card: "#f8f8f8",
  primary: "#9B0E10",
  border: "#eee",
};

export const darkTheme = {
  mode: "dark",
  background: "#181818",
  text: "#fff",
  card: "#222",
  primary: "#9B0E10",
  border: "#333",
};

export const ThemeContext = createContext({
  theme: lightTheme,
  toggleTheme: () => {},
});

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(lightTheme);

  useEffect(() => {
    const loadTheme = async () => {
      const stored = await AsyncStorage.getItem("@theme");
      if (stored === "dark") setTheme(darkTheme);
      else if (stored === "light") setTheme(lightTheme);
      else {
        // Use system preference if not set
        const colorScheme = Appearance.getColorScheme();
        setTheme(colorScheme === "dark" ? darkTheme : lightTheme);
      }
    };
    loadTheme();
  }, []);

  const toggleTheme = async () => {
    setTheme((prev) => {
      const next = prev.mode === "light" ? darkTheme : lightTheme;
      AsyncStorage.setItem("@theme", next.mode);
      return next;
    });
  };

  const value = useMemo(() => ({ theme, toggleTheme }), [theme]);

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};
