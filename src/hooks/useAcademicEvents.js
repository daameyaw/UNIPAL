import { useQuery } from "@tanstack/react-query";
// import { client } from "./sanityClient";
import { getAcademicEvents } from "../services/apiAcademicEvents";
import { useRefreshOnFocus } from "./useRefetch";

export function useAcademicEvents() {
  const { isLoading, data, error, refetch } = useQuery({
    queryKey: ["academicEvents"],
    queryFn: async () => {
      const result = await getAcademicEvents();
      // console.log("Fetched new data:", result);
      return result;
    },
    // staleTime: 0,

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
    // refetchOnWindowFocus: true, // Enable refetch on window focus
  });

  useRefreshOnFocus(refetch);

  // Debug logs
  // console.log("Current data:", data);
  // console.log("Loading state:", isLoading);
  // console.log("Error state:", error);

  return { isLoading, data, error };
}
