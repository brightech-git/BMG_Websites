
import { useQuery } from "@tanstack/react-query";
import { checkPincodeService ,checkShippingPrice } from "../../service/pincodeChecking";

export const useCheckPincode = (destPincode) => {
  return useQuery({
      queryKey: ["destPincode", destPincode],
      queryFn: () => checkPincodeService(destPincode),
      enabled: /^\d{6}$/.test(String(destPincode || "")),
      retry: false,
  });
};

export const useCheckShippingPrice = (destinationPincode, weightInGrams) => {
  return useQuery({
    queryKey: ["shippingPrice", destinationPincode, weightInGrams],
    queryFn: () => checkShippingPrice(destinationPincode, weightInGrams),

    // ✅ VERY IMPORTANT — only run when both exist
    enabled: !!destinationPincode && !!weightInGrams,

    staleTime: 5 * 60 * 1000, // optional (5 mins)
    retry: 1,
  });
};