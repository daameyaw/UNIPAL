import AsyncStorage from "@react-native-async-storage/async-storage";
import { useState, useEffect } from "react";

const FAVORITES_STORAGE_KEY = "favoriteQuotes";

export function useFavorites() {
  const [favorites, setFavorites] = useState([]);

  // Load favorites from storage on mount
  useEffect(() => {
    loadFavorites();
  }, []);

  const loadFavorites = async () => {
    try {
      const stored = await AsyncStorage.getItem(FAVORITES_STORAGE_KEY);
      if (stored) {
        setFavorites(JSON.parse(stored));
      }
    } catch (error) {
      console.error("Error loading favorites:", error);
    }
  };

  const toggleFavorite = async (quote, author) => {
    try {
      const quoteId = `${quote}-${author}`; // Create unique ID for the quote
      const newFavorites = favorites.includes(quoteId)
        ? favorites.filter((id) => id !== quoteId)
        : [...favorites, quoteId];

      await AsyncStorage.setItem(
        FAVORITES_STORAGE_KEY,
        JSON.stringify(newFavorites)
      );
      setFavorites(newFavorites);
    } catch (error) {
      console.error("Error toggling favorite:", error);
    }
  };

  const isFavorite = (quote, author) => {
    const quoteId = `${quote}-${author}`;
    return favorites.includes(quoteId);
  };

  return {
    favorites,
    toggleFavorite,
    isFavorite,
  };
}
