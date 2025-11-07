// useOrderTracking.js
import { useQuery } from "@tanstack/react-query";
import { trackOrder, trackOrderById } from "../../service/orderService";

export const useTrackOrder = (refNumber) => {
  //console.log("Tracking order with refNumber:", refNumber);
  return useQuery({
    queryKey: ["trackOrder", refNumber],
    queryFn: () => trackOrder(refNumber),
    enabled: !!refNumber, // Only fetch if refNumber is valid
    retry: 1, // Retry once on failure
  });
};



export const useTrackOrderById = (orderId) => {
  return useQuery({
    queryKey: ["trackOrder", orderId],
    queryFn: () => trackOrderById(orderId),
    enabled: !!orderId, // only run if orderId is provided
    refetchInterval: 60 * 1000, // auto refresh every 1 min
  });
};