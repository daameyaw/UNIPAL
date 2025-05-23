/**
 * Custom hook to fetch and manage a daily motivational quote.
 *
 * @returns {Object} An object containing:
 * - isLoading: Boolean indicating if the quote is being fetched
 * - quote: The text of the motivational quote (or default message)
 * - author: The author of the quote (or 'Unknown')
 * - date: The date of the quote
 * - error: Any error that occurred during fetching
 *
 * The hook uses AsyncStorage to cache the quote for a day,
 * preventing unnecessary API calls and ensuring a consistent
 * daily quote experience.
 */
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getMotivation } from "../services/apiMotivation";
import { useQuery } from "@tanstack/react-query";

const QUOTE_STORAGE_KEY = "dailyQuote";

/**
 * The function `getTodayDate` returns the current date in ISO format without the time.
 */
const getTodayDate = () => new Date().toISOString().split("T")[0];
console.log(getTodayDate());

export function useMotivation() {
  const { isLoading, data, error } = useQuery({
    queryKey: ["dailyQuote"],
    queryFn: async () => {
      try {
        const today = getTodayDate();
        const stored = await AsyncStorage.getItem(QUOTE_STORAGE_KEY);

        if (stored) {
          const parsed = JSON.parse(stored);
          if (parsed.date === today) {
            console.log("parsed", parsed);
            return parsed;
          }
        }

        // Clear the old quote before setting new one
        await AsyncStorage.removeItem(QUOTE_STORAGE_KEY);

        const newQuote = await getMotivation();
        await AsyncStorage.setItem(QUOTE_STORAGE_KEY, JSON.stringify(newQuote));
        return newQuote;
      } catch (error) {
        console.error("Error in useMotivation:", error);
        throw error;
      }
    },
    staleTime: 1000 * 60 * 60 * 24, // 24 hours
    cacheTime: 1000 * 60 * 60 * 24, // Keep cache for a day
    retry: 5,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });

  return {
    isLoading,
    quote: data?.quote || "No quote available",
    author: data?.author || "Unknown",
    date: data?.date,
    error,
  };
}
