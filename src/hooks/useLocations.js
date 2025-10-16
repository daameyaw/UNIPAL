import { useQuery } from "@tanstack/react-query";
import { getLocationsByCategory } from "../services/apiLocations";
import { useRefreshOnFocus } from "./useRefetch";

export function useLocations(category) {
  const { isLoading, data, error, refetch } = useQuery({
    queryKey: ["locations", category],
    queryFn: async () => {
      const result = await getLocationsByCategory(category);
      console.log("Fetched locations for category:", category, result);
      return result;
    },
    enabled: !!category, // Only run query if category is provided
    staleTime: 24 * 60 * 60 * 1000, // 24 hours - don't refetch if data is fresh
    cacheTime: 24 * 60 * 60 * 1000, // 24 hours cache
    refetchOnMount: true,
    refetchOnReconnect: true, // Auto-refetch when network restored
    retry: (failureCount, error) => {
      if (failureCount < 3) {
        return Math.min(1000 * Math.pow(2, failureCount), 4000);
      }
      return false;
    },
  });

  useRefreshOnFocus(refetch);

  // Debug logs
  console.log("Current locations data:", data);
  console.log("Loading state:", isLoading);
  console.log("Error state:", error);

  return { isLoading, data, error };
}
