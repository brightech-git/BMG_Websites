// useOrderTracking.js
import { useQuery } from "@tanstack/react-query";
import { trackOrder } from "../../service/orderService";

export const useTrackOrder = (refNumber) => {
  console.log("Tracking order with refNumber:", refNumber);
  return useQuery({
    queryKey: ["trackOrder", refNumber],
    queryFn: () => trackOrder(refNumber),
    enabled: !!refNumber, // Only fetch if refNumber is valid
    retry: 1, // Retry once on failure
  });
};