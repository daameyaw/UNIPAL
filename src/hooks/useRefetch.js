import React from "react";
import { useFocusEffect } from "@react-navigation/native";

export function useRefreshOnFocus(refetch) {
  const firstTimeRef = React.useRef(true);
  useFocusEffect(
    React.useCallback(() => {
      if (firstTimeRef.current) {
        firstTimeRef.current = false;
        return;
      }
      console.log("refetching");
      refetch();
      console.log("refetched");
    }, [refetch])
  );
}
